
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import i18n from './config';

export type SupportedLanguage = 'en' | 'es' | 'ar';

interface LocalizationOptions {
  numberFormatting?: boolean;
  dateFormatting?: boolean;
  currencyCode?: string;
}

/**
 * Custom hook for handling localization throughout the application
 */
export function useLocalization(options: LocalizationOptions = {}) {
  const { t } = useTranslation('common');
  const [isRTL, setIsRTL] = useState(i18n.dir() === 'rtl');
  
  // Track when language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      setIsRTL(i18n.dir() === 'rtl');
      
      // Set HTML direction attribute
      document.documentElement.dir = i18n.dir();
      document.documentElement.lang = i18n.language;
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  /**
   * Format a number according to the current locale
   */
  const formatNumber = (value: number): string => {
    if (!options.numberFormatting) return value.toString();
    
    return new Intl.NumberFormat(i18n.language).format(value);
  };
  
  /**
   * Format a date according to the current locale
   */
  const formatDate = (date: Date, formatStyle: 'short' | 'medium' | 'long' = 'medium'): string => {
    if (!options.dateFormatting) return date.toLocaleDateString();
    
    return new Intl.DateTimeFormat(i18n.language, {
      dateStyle: formatStyle as any,
    }).format(date);
  };
  
  /**
   * Format currency according to the current locale
   */
  const formatCurrency = (value: number): string => {
    const currencyCode = options.currencyCode || 'USD';
    
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency: currencyCode,
    }).format(value);
  };
  
  /**
   * Change the current language
   */
  const changeLanguage = (lang: SupportedLanguage) => {
    i18n.changeLanguage(lang);
  };
  
  /**
   * Get the current language
   */
  const getCurrentLanguage = (): SupportedLanguage => {
    return i18n.language as SupportedLanguage;
  };

  return {
    t,
    isRTL,
    formatNumber,
    formatDate,
    formatCurrency,
    changeLanguage,
    getCurrentLanguage,
  };
}
