
import { useState, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EnhancedHeroSection } from "@/components/home/EnhancedHeroSection";
import { KeyFeatures } from "@/components/home/KeyFeatures";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { ComparisonTable } from "@/components/home/ComparisonTable";
import { ValuePropositionSection } from "@/components/home/ValuePropositionSection";
import { PremiumServicesGrid } from "@/components/home/PremiumServicesGrid";
import { PremiumTabs } from "@/components/premium/PremiumTabs";
import { MarketingBanner } from "@/components/marketing/MarketingBanner";
import { AnnouncementBar } from "@/components/marketing/AnnouncementBar";

export default function Index() {
  const valuationRef = useRef<HTMLDivElement>(null);
  
  const scrollToValuation = () => {
    valuationRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1 animate-fade-in">
        <EnhancedHeroSection onFreeValuationClick={scrollToValuation} />
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
        <TestimonialsSection />
        <ComparisonTable />
        <div ref={valuationRef} className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Get Your Vehicle Valuation</h2>
            <PremiumTabs />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
