export const config = {
  // Feature flags
  ADS_ENABLED: false, // Se activará en Fase 3
  
  // API settings
  API_TIMEOUT: 10000, // 10 segundos
  CACHE_MINUTES: 15,  // Tiempo mínimo antes de volver a fetchear
  
  // URLs
  urls: {
    dolarApiBase: 'https://ve.dolarapi.com/v1',
    openErApi: 'https://open.er-api.com/v6/latest/USD',
    binanceP2P: 'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search',
  },
  
  // App constants
  DEFAULT_DECIMALS: 2,
};
