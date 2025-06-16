
import React from 'react';
import { SEO } from '@/components/common/SEO';
import { HeroSection } from './HeroSection';
import { LookupTabs } from './LookupTabs';
import { KeyFeatures } from './KeyFeatures';
import { EnhancedFeatures } from './EnhancedFeatures';

const EnhancedHomePage: React.FC = () => {
  return (
    <>
      <SEO
        title="Car Detective - AI Vehicle Valuation"
        description="Discover your car's true market value with AI-powered insights"
      />
      <div className="min-h-screen bg-gradient-to-b from-background via-surface to-background">
        <HeroSection onFreeValuationClick={() => window.location.href = '/valuation'} />
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-center mb-6">Get Started With Your Valuation</h2>
          <LookupTabs />
        </div>
        <KeyFeatures />
        <EnhancedFeatures />
      </div>
    </>
  );
};

export default EnhancedHomePage;
