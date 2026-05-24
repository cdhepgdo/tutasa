import { config } from '../../constants/config';

// Placeholder del servicio de anuncios.
// Cuando activemos AdMob en la Fase 3, aquí se configurarán los intersticiales.
export const adsService = {
  initialize: async () => {
    if (!config.ADS_ENABLED) return;
    console.log("Ads Service initialized");
  },
  
  showInterstitial: async () => {
    if (!config.ADS_ENABLED) return;
    console.log("Showing interstitial Ad");
  }
};
