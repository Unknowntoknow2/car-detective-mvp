import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

<<<<<<< HEAD
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
=======
// Import translations
import enCommon from "./locales/en/common.json";
import esCommon from "./locales/es/common.json";
import arCommon from "./locales/ar/common.json";

// Import vehicle translations
import arVehicle from "./locales/ar/vehicle.json";

// Create English vehicle translations (will be filled with real data later)
const enVehicle = {
  selector: {
    makeLabel: "Make",
    modelLabel: "Model",
    yearLabel: "Year",
    makePlaceholder: "Select a make",
    modelPlaceholder: "Select a model",
    yearPlaceholder: "Select a year",
    loadingMakes: "Loading makes...",
    loadingModels: "Loading models...",
    noMakesFound: "No makes found",
    noModelsFound: "No models found",
    selectMakeFirst: "Select a make first",
    required: "Required",
  },
  validation: {
    makeRequired: "Make is required",
    modelRequired: "Model is required",
    yearRequired: "Year is required",
  },
};

// Create Spanish vehicle translations (will be filled with real data later)
const esVehicle = {
  selector: {
    makeLabel: "Marca",
    modelLabel: "Modelo",
    yearLabel: "Año",
    makePlaceholder: "Seleccione una marca",
    modelPlaceholder: "Seleccione un modelo",
    yearPlaceholder: "Seleccione un año",
    loadingMakes: "Cargando marcas...",
    loadingModels: "Cargando modelos...",
    noMakesFound: "No se encontraron marcas",
    noModelsFound: "No se encontraron modelos",
    selectMakeFirst: "Seleccione una marca primero",
    required: "Requerido",
  },
  validation: {
    makeRequired: "La marca es requerida",
    modelRequired: "El modelo es requerido",
    yearRequired: "El año es requerido",
  },
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
<<<<<<< HEAD
        common: enCommon
      },
      es: {
        common: esCommon
=======
        common: enCommon,
        vehicle: enVehicle,
      },
      es: {
        common: esCommon,
        vehicle: esVehicle,
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      },
      ar: {
        common: arCommon,
        vehicle: arVehicle,
      },
    },
<<<<<<< HEAD
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
=======
    fallbackLng: "en",
    ns: ["common", "vehicle"],
    defaultNS: "common",
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
