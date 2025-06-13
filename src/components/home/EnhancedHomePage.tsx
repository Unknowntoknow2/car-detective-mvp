import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { SEO } from '@/components/common/SEO';
import { WelcomeBanner } from '@/components/home/WelcomeBanner';
import { HeroSection } from '@/components/home/HeroSection';
import { KeyFeatures } from '@/components/home/KeyFeatures';
import { LookupTabs } from '@/components/home/LookupTabs';
import { ComparisonTable } from '@/components/home/ComparisonTable';
import { PremiumServicesGrid } from '@/components/home/PremiumServicesGrid';
import { ValuePropositionSection } from '@/components/home/ValuePropositionSection';
import { EnhancedFeatures } from '@/components/home/EnhancedFeatures';
import { FeaturesOverview } from '@/components/home/FeaturesOverview';
import { MarketSnapshot } from '@/components/home/MarketSnapshot';
import { PdfPreview } from '@/components/home/PdfPreview';
import { PhotoScoringWidget } from '@/components/home/PhotoScoringWidget';
import { EnhancedTestimonialsCarousel } from '@/components/home/EnhancedTestimonialsCarousel';
import { TestimonialsSection } from '@/components/home/TestimonialsSection'; // Optional
import { OnboardingTour } from '@/components/home/OnboardingTour';
import { AiAssistantPreview } from '@/components/home/AiAssistantPreview';
import { Footer } from '@/components/home/Footer';

export const EnhancedHomePage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO 
        title="Car Detective - AI Vehicle Valuation"
        description="Discover your car's true market value with AI-powered insights, auction data, and premium CARFAX-backed valuation reports."
      />

      <div className="min-h-screen bg-gradient-to-b from-background via-surface to-background">
        <WelcomeBanner />
        <HeroSection onFreeValuationClick={() => navigate('/valuation')} />
        <KeyFeatures />
        <LookupTabs defaultTab="vin" />
        <ComparisonTable />
        <PremiumServicesGrid />
        <ValuePropositionSection />
        <EnhancedFeatures />
        <FeaturesOverview />
        <MarketSnapshot />
        <PdfPreview />
        <PhotoScoringWidget />
        <EnhancedTestimonialsCarousel />
        <TestimonialsSection /> {/* Optional if using carousel only */}
        <OnboardingTour />
        <AiAssistantPreview />
        <Footer />
      </div>
    </>
  );
};
