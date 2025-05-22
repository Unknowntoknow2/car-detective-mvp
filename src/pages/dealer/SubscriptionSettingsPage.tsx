
import React from 'react';
import { MainLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function SubscriptionSettingsPage() {
  const navigate = useNavigate();
  
  const handleUpgrade = () => {
    navigate('/dealer/subscription/upgrade');
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Subscription Settings</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Current Plan: Free</h2>
          <p className="mb-6 text-gray-600">
            Upgrade to our premium plan to access all features including advanced analytics,
            unlimited vehicle listings, and priority support.
          </p>
          
          <Button 
            variant="secondary" 
            onClick={handleUpgrade}
          >
            Upgrade Now
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
