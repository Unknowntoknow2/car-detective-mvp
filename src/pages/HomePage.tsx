
import React from 'react';
import { UnifiedLookupTabs } from '@/components/lookup/UnifiedLookupTabs';
import { PremiumHeroSection } from '@/components/home/PremiumHeroSection';
import { InstantTrustBar } from '@/components/home/InstantTrustBar';
import { CoreValueProps } from '@/components/home/CoreValueProps';
import { IndustryProof } from '@/components/home/IndustryProof';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero: Clear Value Proposition */}
      <PremiumHeroSection />
      
      {/* Instant Trust Building */}
      <InstantTrustBar />
      
      {/* Main Feature: Valuation Tool */}
      <section className="py-16 px-4" data-section="valuation">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Get Your Vehicle's True Value
            </h2>
            <p className="text-gray-600">
              Professional-grade valuation in seconds
            </p>
          </div>
          <UnifiedLookupTabs />
        </div>
      </section>

      {/* Core Value Props: Why Choose Us */}
      <CoreValueProps />
      
      {/* Industry Proof: Credibility */}
      <IndustryProof />
    </div>
  );
}
