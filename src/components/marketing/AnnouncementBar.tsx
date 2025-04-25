
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('announcementDismissed');
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('announcementDismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="bg-slate-900 text-white animate-fade-in">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between">
        <Link 
          to="/premium" 
          className="text-sm hover:text-primary-light transition-colors flex-1"
        >
          New! Dealer-beat Offers & Marketplace Price Averages now live in Premium Valuation.
        </Link>
        <button
          onClick={handleDismiss}
          className="ml-4 p-1 hover:text-primary-light transition-colors"
          aria-label="Dismiss announcement"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
