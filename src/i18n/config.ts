
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import JSON resources directly
import enCommon from './locales/en/common.json';
import esCommon from './locales/es/common.json';
import arCommon from './locales/ar/common.json';

// Vehicle-specific translations
import arVehicle from './locales/ar/vehicle.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon
      },
      es: {
        common: esCommon
      },
      ar: {
        common: arCommon,
        vehicle: arVehicle
      }
    },
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;
