
import React from 'react';
import { SEO } from '@/components/layout/seo';
import PremiumValuationForm from '@/components/premium/form/PremiumValuationForm'; 
import { MainLayout } from '@/components/layout';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function Premium() {
  const navigate = useNavigate();

  const handlePremiumSubmit = (data: any) => {
    // Store the valuation data
    localStorage.setItem('premium_valuation_data', JSON.stringify(data));
    
    // Show success toast
    toast.success('Premium valuation submitted successfully!');
    
    // Navigate to results page (or you could implement a specific premium result page)
    navigate('/result');
  };

  return (
    <MainLayout>
      <SEO title="Premium Valuation" description="Get a premium valuation for your vehicle" />
      <div className="container mx-auto py-8">
        <PremiumValuationForm onSubmit={handlePremiumSubmit} />
      </div>
    </MainLayout>
  );
}
