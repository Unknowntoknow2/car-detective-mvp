
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

export default function Index() {
  const valuationRef = useRef<HTMLDivElement>(null);
  
  const scrollToValuation = () => {
    valuationRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />
      <main className="flex-1 animate-fade-in">
        <EnhancedHeroSection onFreeValuationClick={scrollToValuation} />
        <KeyFeatures />
        <ValuePropositionSection />
        <PremiumServicesGrid />
        <TestimonialsSection />
        <ComparisonTable />
        <div ref={valuationRef}>
          <PremiumTabs />
        </div>
      </main>
      <Footer />
    </div>
  );
}
