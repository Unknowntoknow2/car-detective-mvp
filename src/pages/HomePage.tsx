
import React from 'react';
import { UnifiedLookupTabs } from '@/components/lookup/UnifiedLookupTabs';
import { FangHeroSection } from '@/components/home/FangHeroSection';
import { TrustIndicatorsSection } from '@/components/home/TrustIndicatorsSection';
import { ValuePropositionGrid } from '@/components/home/ValuePropositionGrid';
import { ProofPointsSection } from '@/components/home/ProofPointsSection';
import { SocialProofSection } from '@/components/home/SocialProofSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero: Immediate Problem/Solution Above Fold */}
      <FangHeroSection />
      
      {/* Instant Trust Building */}
      <TrustIndicatorsSection />
      
      {/* Main Feature: Valuation Tool - Primary CTA */}
      <section className="py-20 px-4 bg-gray-50" data-section="valuation">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Get Your Vehicle's True Market Value
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional-grade valuation in under 30 seconds
            </p>
          </div>
          <UnifiedLookupTabs />
        </div>
      </section>

      {/* Value Propositions: Why Us */}
      <ValuePropositionGrid />
      
      {/* Proof Points: How We Deliver */}
      <ProofPointsSection />
      
      {/* Social Proof: Who Trusts Us */}
      <SocialProofSection />
    </div>
  );
}
