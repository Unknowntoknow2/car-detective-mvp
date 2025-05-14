
import React from 'react';
import { Button } from '@/components/ui/button';
import { usePremiumDealer } from '@/hooks/usePremiumDealer';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export const PremiumSubscriptionBanner = () => {
  const { isPremium, isLoading, expiryDate } = usePremiumDealer();
  const navigate = useNavigate();
  
  if (isLoading) return null;
  
  if (isPremium) {
    return (
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 text-indigo-600 mr-2" />
            <span className="text-sm font-medium text-indigo-800">
              Premium dealer subscription active
              {expiryDate && ` until ${new Date(expiryDate).toLocaleDateString()}`}
            </span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/dealer-subscription')}
            className="text-indigo-700 border-indigo-300 hover:bg-indigo-50"
          >
            Manage Subscription
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-medium text-amber-800">Upgrade to Premium Dealer</h3>
          <p className="text-sm text-amber-700 mt-1">
            Get access to inventory management, leads, and analytics features.
          </p>
        </div>
        <Button 
          onClick={() => navigate('/dealer-subscription')} 
          variant="premium"
          className="whitespace-nowrap"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Upgrade Now
        </Button>
      </div>
    </div>
  );
};
