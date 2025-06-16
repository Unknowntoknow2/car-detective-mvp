
export const i18n = {
  language: 'en',
  fallbackLng: 'en',
  dir: 'ltr',
  interpolation: {
    escapeValue: false,
  },
  on: (event: string, callback: () => void) => {
    // Mock implementation
  },
  off: (event: string, callback: () => void) => {
    // Mock implementation  
  },
  changeLanguage: (lang: string) => {
    // Mock implementation
    return Promise.resolve();
  }
};

export const t = (key: string, options?: any) => {
  return key;
};

export default i18n;
