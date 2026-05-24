import { config } from '../../constants/config';

export const endpoints = {
  // DolarAPI
  dolarApi: {
    oficial: `${config.urls.dolarApiBase}/dolares/oficial`,
    euros: `${config.urls.dolarApiBase}/euros`,
    cripto: `${config.urls.dolarApiBase}/dolares/cripto`, // Retorna el promedio del USDT
  },
  
  // Fallbacks
  fallback: {
    bcv: config.urls.openErApi, // Usar tasa USD y luego calcular (si DolarApi falla)
    binance: config.urls.binanceP2P,
  }
};
