import { apiClient, binanceClient } from '../../services/api/client';
import { endpoints } from '../../services/api/endpoints';
import { RateData } from './types';

export const ratesService = {
  // Fetch from DolarAPI (fuente primaria para BCV y EUR)
  async fetchDolarApiBcvAndEur() {
    // DolarAPI retorna array para /euros. Usamos el oficial.
    const [bcvRes, eurRes] = await Promise.all([
      apiClient.get(endpoints.dolarApi.oficial),
      apiClient.get(endpoints.dolarApi.euros)
    ]);
    
    // Buscar la tasa oficial del euro
    const eurData = Array.isArray(eurRes.data) 
      ? eurRes.data.find(e => e.fuente === 'oficial') 
      : eurRes.data;

    return {
      bcv: bcvRes.data.promedio,
      eur: eurData?.promedio || 0,
    };
  },
  
  // Fallback 1: open.er-api para BCV y EUR
  async fetchFallbackBcvAndEur() {
    const res = await apiClient.get(endpoints.fallback.bcv);
    // open.er-api retorna base USD. Ejemplo: res.data.rates.VES
    const ves = res.data.rates.VES;
    const eurToUsd = res.data.rates.EUR; // tasa de 1 USD a EUR
    const eur = eurToUsd ? ves / eurToUsd : 0; // Calculamos EUR en VES
    return { bcv: ves, eur };
  },
  
  // Fallback 2: Binance P2P para USDT (Promedio recortado)
  async fetchFallbackUsdt() {
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
    
    const res = await binanceClient.post(endpoints.fallback.binance, body);
    
    const data = res.data?.data;
    if (!data || data.length === 0) return null;
    
    let prices = data.map((item: any) => parseFloat(item.adv.price));
    prices.sort((a: number, b: number) => a - b);
    
    // Recortar 10% de los extremos para evitar outliers (como tenías en tu script original)
    const trimPercent = 0.1;
    const trimCount = Math.floor(prices.length * trimPercent);
    prices = prices.slice(trimCount, prices.length - trimCount);
    
    if (prices.length === 0) return null;
    
    const sum = prices.reduce((acc: number, val: number) => acc + val, 0);
    return sum / prices.length;
  },
  
  // Función principal de orquestación
  async getRates(): Promise<RateData> {
    let bcvRate = 0;
    let eurRate = 0;
    let usdtRate = 0;

    // 1. Obtener BCV y EUR (Intentamos DolarAPI, si falla usamos Fallback)
    try {
      const data = await this.fetchDolarApiBcvAndEur();
      bcvRate = data.bcv;
      eurRate = data.eur;
    } catch (e) {
      console.warn("DolarAPI falló para BCV/EUR. Intentando fallback...");
      const fallbackData = await this.fetchFallbackBcvAndEur().catch(() => ({ bcv: 0, eur: 0 }));
      bcvRate = fallbackData.bcv;
      eurRate = fallbackData.eur;
    }

    // 2. Obtener USDT (Intentamos Binance P2P directamente)
    try {
      const binanceRate = await this.fetchFallbackUsdt();
      usdtRate = binanceRate || 0;
    } catch (e) {
      console.warn("Binance P2P falló para USDT. Posible problema de CORS en Web.");
    }

    if (!bcvRate && !usdtRate && !eurRate) {
      throw new Error("Todas las fuentes de tasas fallaron.");
    }

    return {
      bcv: bcvRate,
      eur: eurRate || bcvRate, // Fallback si EUR falla
      usdt: usdtRate || bcvRate, // Si USDT falla (ej. por CORS), igualarlo al BCV
      lastUpdated: Date.now(),
    };
  }
};
