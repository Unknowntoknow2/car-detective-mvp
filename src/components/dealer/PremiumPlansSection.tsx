
import React from 'react';
import { PremiumSubscriptionCard } from './PremiumSubscriptionCard';
import { PremiumBadge } from './PremiumDealerBadge';
import { usePremiumDealer } from '@/hooks/usePremiumDealer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function PremiumPlansSection() {
  const { isPremium, isLoading, expiryDate } = usePremiumDealer();
  const [isPortalLoading, setIsPortalLoading] = React.useState(false);

  const handleManageSubscription = async () => {
    try {
      setIsPortalLoading(true);
      const { data, error } = await supabase.functions.invoke('create-billing-portal', {});

      if (error) {
        console.error('Error creating billing portal:', error);
        toast.error('Unable to open billing portal');
        return;
      }

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      console.error('Error in opening billing portal:', err);
      toast.error('Something went wrong');
    } finally {
      setIsPortalLoading(false);
    }
  };

  const monthlyFeatures = [
    'Unlimited vehicle valuations',
    'Advanced market insights',
    'Premium dealer badge',
    'CSV export',
    'Email support'
  ];

  const yearlyFeatures = [
    ...monthlyFeatures,
    'Priority customer service',
    '15% discount over monthly billing',
    'Early access to new features'
  ];

  if (isLoading) {
    return <div className="py-8 text-center">Loading subscription status...</div>;
  }

  return (
    <div className="py-8">
      {isPremium ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <PremiumBadge variant="gold" size="lg" />
              <div>
                <h3 className="text-xl font-medium">You're a Premium Dealer</h3>
                {expiryDate && (
                  <p className="text-muted-foreground">
                    Your premium status is active until {format(expiryDate, 'MMMM d, yyyy')}
                  </p>
                )}
              </div>
            </div>
            <Button 
              onClick={handleManageSubscription} 
              disabled={isPortalLoading}
              variant="outline"
            >
              {isPortalLoading ? 'Loading...' : 'Manage Subscription'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="text-3xl font-bold mb-4">Upgrade to Premium Dealer</h2>
            <p className="text-lg text-muted-foreground">
              Get more leads, advanced market insights, and premium features to grow your dealership.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PremiumSubscriptionCard
              tier="monthly"
              price="$14.99"
              features={monthlyFeatures}
              ctaText="Subscribe Monthly"
            />
            <PremiumSubscriptionCard
              tier="yearly"
              price="$149"
              features={yearlyFeatures}
              ctaText="Subscribe Yearly"
              recommended={true}
            />
          </div>
          
          <div className="text-center text-sm text-muted-foreground mt-8">
            All plans include a 7-day money-back guarantee. You can cancel anytime.
          </div>
        </div>
      )}
    </div>
  );
}
