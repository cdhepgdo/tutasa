import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import es from './locales/es.json';

// Preparado para soportar más idiomas en el futuro.
// Solo necesitas agregar el archivo .json y descomentar aquí.
const resources = {
  es: { translation: es },
  en: { translation: en },
  // pt: { translation: require('./locales/pt-BR.json') },
  // ar: { translation: require('./locales/ar.json') },
  // zh: { translation: require('./locales/zh.json') },
  // it: { translation: require('./locales/it.json') },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: Localization.getLocales()[0]?.languageCode ?? 'es',
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false, // React ya previene XSS
    },
  });

export default i18n;
