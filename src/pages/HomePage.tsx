
import React from 'react';
import { UnifiedLookupTabs } from '@/components/lookup/UnifiedLookupTabs';
import { FangHeroSection } from '@/components/home/FangHeroSection';
import { TrustIndicatorsSection } from '@/components/home/TrustIndicatorsSection';
import { ValuePropositionGrid } from '@/components/home/ValuePropositionGrid';
import { ProofPointsSection } from '@/components/home/ProofPointsSection';
import { SocialProofSection } from '@/components/home/SocialProofSection';
import { FinalCTA } from '@/components/home/FinalCTA';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* FANG-Level Hero Section */}
      <FangHeroSection />
      
      {/* Trust Indicators with Real Metrics */}
      <TrustIndicatorsSection />
      
      {/* Main Feature: Valuation Tool */}
      <section className="py-20 px-4 bg-muted/50" data-section="valuation">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Get Your Vehicle's True Value
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional-grade valuation in seconds. Enter your VIN or license plate to get started.
            </p>
          </div>
          <div className="bg-card rounded-2xl shadow-xl p-8">
            <UnifiedLookupTabs />
          </div>
        </div>
      </section>

      {/* Value Propositions with Enhanced Design */}
      <ValuePropositionGrid />
      
      {/* Proof Points with Industry Standards */}
      <ProofPointsSection />
      
      {/* Social Proof with Professional Testimonials */}
      <SocialProofSection />
      
      {/* Final Call to Action */}
      <FinalCTA />
    </div>
  );
}
