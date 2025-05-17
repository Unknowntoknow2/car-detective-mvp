<<<<<<< HEAD
import React from 'react';
import { EnhancedErrorBoundary } from '@/components/common/EnhancedErrorBoundary';
import Home from './Home';
=======

import React, { useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { HeroSection } from '@/components/home/HeroSection';
import { ValuePropositionSection } from '@/components/home/ValuePropositionSection';
import { PremiumServicesGrid } from '@/components/home/PremiumServicesGrid';
import { KeyFeatures } from '@/components/home/KeyFeatures';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { ComparisonTable } from '@/components/home/ComparisonTable';
import { FeaturesOverview } from '@/components/home/FeaturesOverview';
import { MarketingBanner } from '@/components/marketing/MarketingBanner';

const HomePage: React.FC = () => {
  // Add diagnostic logging to confirm component is being rendered
  console.log('✅ HomePage loaded');

  useEffect(() => {
    console.log('✅ HomePage mounted in DOM');
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
>>>>>>> origin/main

  return (
    <MainLayout>
      {/* Fallback div to ensure something is visible even if components fail */}
      <div id="homepage-fallback" className="p-4 bg-yellow-100 text-black">
        It works! HomePage is rendering. If you see this message, the core routing is working.
      </div>
      
      <div className="min-h-screen">
        <HeroSection />
        <KeyFeatures />
        <ValuePropositionSection />
        
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <MarketingBanner 
            headline="Experience Premium Valuation with CARFAX® Reports"
            subtext="Get dealer-competitive offers, full vehicle history, and pricing forecasts not available in the free version."
            ctaText="Try Premium for $29.99"
            ctaHref="/premium"
          />
        </div>
        
        <PremiumServicesGrid />
        <FeaturesOverview />
        <TestimonialsSection />
        <ComparisonTable />
      </div>
    </MainLayout>
  );
};

export default HomePage;
