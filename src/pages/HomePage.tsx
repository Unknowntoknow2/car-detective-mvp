
import React from 'react';
import { UnifiedLookupTabs } from '@/components/lookup/UnifiedLookupTabs';
import { FangHeroSection } from '@/components/home/FangHeroSection';
import { TrustIndicatorsSection } from '@/components/home/TrustIndicatorsSection';
import { ValuePropositionGrid } from '@/components/home/ValuePropositionGrid';
import { ProofPointsSection } from '@/components/home/ProofPointsSection';
import { SocialProofSection } from '@/components/home/SocialProofSection';
import { FinalCTA } from '@/components/home/FinalCTA';
import { TrendingUp } from 'lucide-react';
import { LiveMarketTestComponent } from '@/components/test/LiveMarketTestComponent';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* FANG-Level Hero Section */}
      <FangHeroSection />
      
      {/* Trust Indicators with Real Metrics */}
      <TrustIndicatorsSection />
      
      {/* Main Feature: Valuation Tool - FANG Level */}
      <section className="relative py-32 px-4 overflow-hidden" data-section="valuation">
        {/* Premium Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-background to-muted/50" />
        <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
        
        <div className="relative z-10 container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-medium px-4 py-2 rounded-full text-sm mb-6 glass-effect">
              <TrendingUp className="w-4 h-4" />
              AI-Powered Valuation Engine
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Get Your Vehicle's
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                True Value
              </span>
            </h2>
            
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Professional-grade valuation in seconds. Enter your VIN or license plate to get started.
            </p>
          </div>
          
          {/* Premium Glass Container */}
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-2xl opacity-50" />
            
            {/* Main Container */}
            <div className="relative glass-effect rounded-3xl p-8 lg:p-12 border border-border/20 shadow-2xl">
              <UnifiedLookupTabs />
            </div>
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
      
      {/* Live Market Testing Component */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <LiveMarketTestComponent />
        </div>
      </section>
    </div>
  );
}
