
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Create mock JSON structures directly instead of importing from files
const enCommon = {
  "app": {
    "name": "Car Detective",
    "tagline": "Get accurate vehicle valuations instantly"
  },
  "common": {
    "loading": "Loading...",
    "error": "An error occurred",
    "submit": "Submit",
    "cancel": "Cancel",
    "continue": "Continue",
    "save": "Save",
    "back": "Back"
  }
};

const esCommon = {
  "app": {
    "name": "Car Detective",
    "tagline": "Obtenga valoraciones precisas de vehículos al instante"
  },
  "common": {
    "loading": "Cargando...",
    "error": "Se produjo un error",
    "submit": "Enviar",
    "cancel": "Cancelar",
    "continue": "Continuar",
    "save": "Guardar",
    "back": "Atrás"
  }
};

const arCommon = {
  "app": {
    "name": "كار ديتيكتيف",
    "tagline": "احصل على تقييمات دقيقة للسيارات على الفور"
  },
  "common": {
    "loading": "جار التحميل...",
    "error": "حدث خطأ",
    "submit": "إرسال",
    "cancel": "إلغاء",
    "continue": "متابعة",
    "save": "حفظ",
    "back": "رجوع"
  }
};

const arVehicle = {
  "vehicle": {
    "make": "الشركة المصنعة",
    "model": "الطراز",
    "year": "سنة الصنع",
    "mileage": "المسافة المقطوعة",
    "condition": "الحالة",
    "zipCode": "الرمز البريدي"
  }
};

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
