
import { useState, useRef } from "react";
import { EnhancedHeroSection } from "@/components/home/EnhancedHeroSection";
import { EnhancedFeatures } from "@/components/home/EnhancedFeatures";
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
        <EnhancedHeroSection onFreeValuationClick={scrollToValuation} />
        <EnhancedFeatures />
        <div ref={valuationRef}>
          <PremiumTabs />
        </div>
      </main>
      <Footer />
    </div>
  );
}
