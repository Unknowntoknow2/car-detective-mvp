
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const { t } = useTranslation('common');

  useEffect(() => {
    // Check if consent was previously given
    const hasConsent = localStorage.getItem('cookie_consent');
    if (!hasConsent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie_consent', 'true');
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie_consent', 'false');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-slate-900 text-white p-4 md:p-5 shadow-lg" dir="ltr">
      <div className="container mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1 pr-8">
          <h3 className="text-lg font-semibold mb-1">{t('privacy.cookieTitle')}</h3>
          <p className="text-sm text-slate-300">
            {t('privacy.cookieMessage')} 
            <Link to="/privacy" className="underline hover:text-primary ml-1">
              {t('privacy.privacyPolicy')}
            </Link>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            onClick={declineCookies}
            className="border-slate-600 text-white hover:bg-slate-800"
          >
            {t('privacy.decline')}
          </Button>
          <Button onClick={acceptCookies}>
            {t('privacy.accept')}
          </Button>
        </div>
        <button 
          onClick={() => setShowBanner(false)} 
          className="absolute top-3 right-3 text-white p-1 rounded-full hover:bg-slate-800"
          aria-label={t('privacy.close')}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
