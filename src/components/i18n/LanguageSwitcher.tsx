
// import { useTranslation } from 'react-i18next'; // Disabled for MVP
import React from 'react';
import { Button } from '@/components/ui/button';

export function LanguageSwitcher() {
  // Disabled for MVP launch
  return null;
  
  /*
  const { i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => changeLanguage('en')}
        className={i18n.language === 'en' ? 'bg-primary text-primary-foreground' : ''}
      >
        EN
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => changeLanguage('es')}
        className={i18n.language === 'es' ? 'bg-primary text-primary-foreground' : ''}
      >
        ES
      </Button>
    </div>
  );
  */
}

export default LanguageSwitcher;
