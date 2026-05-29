import { apiClient } from '../../services/api/client';
import { RateData } from './types';

// La nueva URL de nuestro backend de Firebase (Escudo Anti-Saturación)
const BACKEND_URL = 'https://getrates-z4ayjul6bq-uc.a.run.app';

export const ratesService = {
  /**
   * Función principal que ahora consulta nuestro propio backend.
   * Toda la lógica pesada (Scraping, Fallbacks, Binance) ocurre en el servidor.
   */
  async getRates(useFutureRate = false): Promise<RateData> {
    try {
      // Usamos un timestamp param para evitar que Axios cachee localmente,
      // queremos que el caché lo maneje exclusivamente el servidor (SWR).
      const t = Date.now();
      const res = await apiClient.get(`${BACKEND_URL}?t=${t}`);
      const data = res.data;

      if (!data || !data.bcv) {
        throw new Error("Datos inválidos desde el servidor central");
      }

      return {
        bcv: data.bcv,
        eur: data.eur || data.bcv,
        usdt: data.usdt || data.bcv,
        lastUpdated: data.lastUpdated || Date.now(),
      };
    } catch (e) {
      console.error("Fallo al conectar con el backend anti-saturación:", e);
      throw new Error("Todas las fuentes de tasas fallaron en el servidor central.");
    }
  }
};
