
// Simplified i18n configuration to avoid build issues
// Will be properly implemented when i18next dependencies are resolved

export const i18n = {
  language: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
};

// Mock translation function
export const t = (key: string, options?: any) => {
  // Return the key as fallback
  return key;
};

export default i18n;
