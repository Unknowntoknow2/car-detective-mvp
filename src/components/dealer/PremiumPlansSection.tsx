
import React from 'react';
import { PremiumSubscriptionCard } from './PremiumSubscriptionCard';
import { PremiumBadge } from './PremiumDealerBadge';
import { usePremiumDealer } from '@/hooks/usePremiumDealer';

export const PremiumPlansSection = () => {
  const { isPremium, expiryDate, isLoading } = usePremiumDealer();

  const plans = [
    {
      name: 'Basic Dealer',
      price: '$9.99/month',
      features: [
        'Access to dealer dashboard',
        'Inventory management (up to 10 vehicles)',
        'Basic analytics',
        'Email support'
      ],
      priceId: 'price_basic_dealer'
    },
    {
      name: 'Premium Dealer',
      price: '$29.99/month',
      features: [
        'Access to dealer dashboard',
        'Unlimited inventory management',
        'Advanced analytics & market insights',
        'Priority support',
        'Customer leads from premium valuations',
        'Featured listings'
      ],
      recommended: true,
      priceId: 'price_premium_dealer'
    },
    {
      name: 'Enterprise Dealer',
      price: '$99.99/month',
      features: [
        'All Premium features',
        'Multi-user access',
        'White-label reports',
        'API access',
        'Dedicated account manager',
        'Custom integration support'
      ],
      priceId: 'price_enterprise_dealer'
    }
  ];

  if (isLoading) {
    return <div className="p-6">Loading subscription information...</div>;
  }

  if (isPremium) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <PremiumBadge className="bg-amber-100 text-amber-800 px-3 py-1" />
            <div>
              <h3 className="text-xl font-medium">You're a Premium Dealer</h3>
              {expiryDate && (
                <p className="text-gray-600">
                  Your subscription is active until {new Date(expiryDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50">
            Manage Subscription
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Choose Your Dealer Plan</h2>
        <p className="text-gray-600 mt-2">
          Unlock premium features with our dealer subscription plans
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <PremiumSubscriptionCard
            key={plan.name}
            name={plan.name}
            price={plan.price}
            features={plan.features}
            recommended={plan.recommended}
            priceId={plan.priceId}
          />
        ))}
      </div>
    </div>
  );
};
