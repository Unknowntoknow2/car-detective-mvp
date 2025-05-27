
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '@/components/home/HeroSection';
import { ValuePropositionSection } from '@/components/home/ValuePropositionSection';
import { PremiumServicesGrid } from '@/components/home/PremiumServicesGrid';
import { KeyFeatures } from '@/components/home/KeyFeatures';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { FeaturesOverview } from '@/components/home/FeaturesOverview';
import { MarketingBanner } from '@/components/marketing/MarketingBanner';
import { OnboardingTour } from '@/components/home/OnboardingTour';
import { PdfPreview } from '@/components/home/PdfPreview';
import { LookupTabs } from '@/components/home/LookupTabs';
import { AiAssistantPreview } from '@/components/home/AiAssistantPreview';
import { SEO } from '@/components/common/SEO';

export const EnhancedHomePage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFreeValuationClick = () => {
    navigate('/valuation');
  };
  
  const handleSignInClick = () => {
    navigate('/auth');
  };
  
  const handlePremiumClick = () => {
    navigate('/premium');
  };

  return (
    <>
      <SEO 
        title="Car Detective - AI Vehicle Valuation" 
        description="Discover your car's true market value with AI-powered insights, auction data, and premium CARFAX-backed valuation reports." 
      />

      <div className="min-h-screen">
        <HeroSection onFreeValuationClick={handleFreeValuationClick} />
        <KeyFeatures />
        
        <div className="container mx-auto max-w-2xl px-4 py-12">
          <h2 className="text-2xl font-semibold text-center mb-6">Start Your Free Valuation</h2>
          <LookupTabs defaultTab="vin" />
        </div>
        
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
        
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-8">Ask Our AI Assistant</h2>
            <AiAssistantPreview />
          </div>
        </div>
        
        <div className="container mx-auto max-w-md px-4 py-12">
          <PdfPreview />
        </div>
        
        <FeaturesOverview />
        <TestimonialsSection />
        
        <OnboardingTour />
      </div>
    </>
  );
};

export default EnhancedHomePage;
