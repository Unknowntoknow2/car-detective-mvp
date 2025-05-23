
import React from 'react';
import { SEO } from '@/components/layout/seo';
import PremiumValuationForm from '@/components/premium/form/PremiumValuationForm'; 
import { MainLayout } from '@/components/layout';

export default function Premium() {
  return (
    <MainLayout>
      <SEO title="Premium Valuation" description="Get a premium valuation for your vehicle" />
      <div className="container mx-auto py-8">
        <PremiumValuationForm />
      </div>
    </MainLayout>
  );
}
