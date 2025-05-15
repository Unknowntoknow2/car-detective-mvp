
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const DealerSubscription = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-border rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Upgrade Your Dealer Plan</h3>
      <p className="text-muted-foreground mb-4">
        Get access to premium features and increase your selling potential.
      </p>
      <Button 
        onClick={() => navigate('/dealer-subscription-plans')}
        className="w-full sm:w-auto"
      >
        View Plans
      </Button>
    </div>
  );
};

export default DealerSubscription;
