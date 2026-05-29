import { onRequest } from "firebase-functions/v2/https";
// import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import axios from "axios";
import * as cheerio from "cheerio";
import * as https from "https";

admin.initializeApp({
    databaseURL: "https://tutasa-backend-default-rtdb.firebaseio.com"
});
const getDb = () => admin.database();

// Agente para ignorar errores de certificado SSL (La página del BCV suele tenerlos vencidos)
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

/**
 * Función 1: Scraper directo a la página oficial del BCV
 */
async function scrapeBcv() {
    try {
        const res = await axios.get("https://www.bcv.org.ve/", { httpsAgent, timeout: 15000 });
        const $ = cheerio.load(res.data);
        
        const parseValue = (id: string) => {
            const text = $(`#${id} strong`).text().trim().replace(',', '.');
            const num = parseFloat(text);
            return isNaN(num) ? 0 : num;
        };
        
        const bcv = parseValue("dolar");
        const eur = parseValue("euro");
        
        if (bcv === 0) throw new Error("No se pudo extraer el valor del dólar BCV");
        
        return { bcv, eur };
    } catch (e) {
        logger.error("Error en Scraper BCV (posible caída de la página oficial)", e);
        return null;
    }
}

/**
 * Función 2: Fallback usando DolarAPI
 */
async function fetchDolarApi() {
    try {
        const [bcvRes, eurRes] = await Promise.all([
            axios.get("https://ve.dolarapi.com/v1/dolares/oficial", { timeout: 10000 }),
            axios.get("https://ve.dolarapi.com/v1/euros", { timeout: 10000 })
        ]);
        
        const eurData = Array.isArray(eurRes.data) ? eurRes.data.find((e: any) => e.fuente === 'oficial') : eurRes.data;
        
        return {
            bcv: bcvRes.data.promedio || 0,
            eur: eurData?.promedio || 0
        };
    } catch (e) {
        logger.error("Error en DolarAPI", e);
        return null;
    }
}

/**
 * Función 3: Obtener USDT desde Binance P2P
 */
async function fetchBinanceUsdt() {
    try {
        const body = {
            fiat: "VES",
            page: 1,
            rows: 20,
            tradeType: "SELL",
            asset: "USDT",
            countries: [],
            proMerchantAds: false,
            shieldMerchantAds: false,
            publisherType: null,
            payTypes: [],
            classifies: ["mass", "profession"]
        };
        
        const res = await axios.post("https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search", body, { timeout: 10000 });
        const data = res.data?.data;
        if (!data || data.length === 0) return 0;
        
        let prices = data.map((item: any) => parseFloat(item.adv.price)).sort((a: number, b: number) => a - b);
        
        // Recortar 10% de los extremos para evitar valores locos
        const trimCount = Math.floor(prices.length * 0.1);
        prices = prices.slice(trimCount, prices.length - trimCount);
        
        if (prices.length === 0) return 0;
        
        const sum = prices.reduce((a: number, b: number) => a + b, 0);
        return sum / prices.length;
    } catch (e) {
        logger.error("Error en Binance P2P", e);
        return 0;
    }
}

/**
 * Orquestador principal: Ejecuta la lógica y guarda en BD
 */
async function updateRatesLogic() {
    let bcv = 0;
    let eur = 0;
    
    // 1. Intentar Scraper
    const scraped = await scrapeBcv();
    if (scraped && scraped.bcv > 0) {
        bcv = scraped.bcv;
        eur = scraped.eur;
        logger.info("Tasas extraídas exitosamente desde BCV Scraper oficial");
    } else {
        // 2. Fallback a DolarAPI
        logger.info("Usando DolarAPI como fallback para BCV/EUR");
        const apiData = await fetchDolarApi();
        if (apiData) {
            bcv = apiData.bcv;
            eur = apiData.eur;
        }
    }
    
    // 3. Obtener USDT
    let usdt = await fetchBinanceUsdt();
    if (usdt === 0) usdt = bcv; // Fallback extremo
    
    if (bcv === 0) {
        throw new Error("Imposible obtener tasas BCV desde todas las fuentes");
    }
    
    // 4. Guardar en Realtime DB
    const rates = {
        bcv,
        eur: eur || bcv,
        usdt,
        lastUpdated: Date.now()
    };
    
    await getDb().ref("rates/current").set(rates);
    logger.info("Nuevas tasas guardadas en BD:", rates);
    return rates;
}

// ----------------------------------------------------------------------
// EXPORT 1: CRON JOB (ELIMINADO)
// Para evitar errores de permisos de Google Cloud Scheduler, usaremos "Lazy Evaluation" en el endpoint HTTP.

// ----------------------------------------------------------------------
// EXPORT 2: API HTTP (La app móvil llamará a esta URL)
// ----------------------------------------------------------------------
export const getRates = onRequest({ cors: true, maxInstances: 10 }, async (req, res) => {
    // MAGIA ANTI-SATURACIÓN: 
    // Obligamos a los servidores intermedios a guardar esto en caché por 10 minutos.
    // Si 1 millón de usuarios entran, 999,999 leerán el caché y solo 1 golpeará la base de datos.
    res.set('Cache-Control', 'public, max-age=600, s-maxage=600');
    
    try {
        const snapshot = await getDb().ref("rates/current").once("value");
        const rates = snapshot.val();
        
        // Si no hay tasas o pasaron más de 15 minutos (900000 ms), forzamos actualización
        const isOld = rates && (Date.now() - rates.lastUpdated > 900000);
        
        if (!rates || isOld) {
            logger.info("Tasas viejas o inexistentes. Forzando actualización en vivo...");
            const newRates = await updateRatesLogic();
            res.status(200).json(newRates);
            return;
        }
        
        res.status(200).json(rates);
    } catch (e) {
        logger.error("Error al servir tasas HTTP", e);
        res.status(500).send("Internal Server Error");
    }
});
