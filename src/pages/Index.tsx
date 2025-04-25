
import { useState, useRef } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { KeyFeatures } from "@/components/home/KeyFeatures";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { ComparisonTable } from "@/components/home/ComparisonTable";
import { ValuePropositionSection } from "@/components/home/ValuePropositionSection";
import { PremiumTabs } from "@/components/premium/PremiumTabs";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function Index() {
  const valuationRef = useRef<HTMLDivElement>(null);
  
  const scrollToValuation = () => {
    valuationRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />
      <main className="flex-1 animate-fade-in">
        <HeroSection onFreeValuationClick={scrollToValuation} />
        <KeyFeatures />
        <ValuePropositionSection />
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
