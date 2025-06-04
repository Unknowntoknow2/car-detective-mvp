
import React from 'react';
import { MainLayout } from '@/components/layout';
import { PremiumHero } from '@/components/premium/PremiumHero';
import { PremiumFeatures } from '@/components/premium/PremiumFeatures';
import { PremiumPricing } from '@/components/premium/PremiumPricing';
import { PremiumTestimonials } from '@/components/premium/PremiumTestimonials';
import { PremiumFaq } from '@/components/premium/PremiumFaq';
import { PremiumValuationTabs } from '@/components/premium/sections/PremiumValuationTabs';

export default function PremiumPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <PremiumHero />
        <PremiumValuationTabs />
        <PremiumFeatures />
        <PremiumTestimonials />
        <PremiumPricing />
        <PremiumFaq />
      </div>
    </MainLayout>
  );
}
