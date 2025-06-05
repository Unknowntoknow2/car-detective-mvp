
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

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
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        vehicle: enVehicle,
      },
      es: {
        common: esCommon,
        vehicle: esVehicle,
      },
      ar: {
        common: arCommon,
        vehicle: arVehicle,
      },
    },
    fallbackLng: "en",
    ns: ["common", "vehicle"],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
