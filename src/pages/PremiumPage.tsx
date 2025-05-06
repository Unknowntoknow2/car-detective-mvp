
import React from 'react';
import { Button } from '@/components/ui/button';

const PremiumPage = () => {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Premium Features</h1>
      <p className="mb-6">
        Unlock advanced valuation tools, comprehensive vehicle history, and more.
      </p>
      <Button>Upgrade to Premium</Button>
    </div>
  );
};

export default PremiumPage;
