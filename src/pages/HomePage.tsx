
import React from 'react';
import { UnifiedLookupTabs } from '@/components/lookup/UnifiedLookupTabs';
import { EnterpriseHeroSection } from '@/components/home/EnterpriseHeroSection';
import { EnterpriseFeaturesSection } from '@/components/home/EnterpriseFeaturesSection';
import { EnterpriseTestimonialsSection } from '@/components/home/EnterpriseTestimonialsSection';
import { EnterpriseStatsSection } from '@/components/home/EnterpriseStatsSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Enterprise Hero Section */}
      <EnterpriseHeroSection />
      
      {/* Trust Indicators & Statistics */}
      <EnterpriseStatsSection />
      
      {/* Main Lookup Interface */}
      <section className="py-24 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              Trusted by Fortune 500 Companies
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">
              Professional Vehicle Valuation Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Enterprise-grade accuracy with institutional-level security. 
              Get comprehensive vehicle valuations backed by real-time market data and AI-powered insights.
            </p>
          </div>
          <UnifiedLookupTabs />
        </div>
      </section>

      {/* Enterprise Features */}
      <EnterpriseFeaturesSection />
      
      {/* Client Testimonials */}
      <EnterpriseTestimonialsSection />
    </div>
  );
}
