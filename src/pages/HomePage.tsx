
import React from 'react';
import { UnifiedLookupTabs } from '@/components/lookup/UnifiedLookupTabs';
import { EnhancedHeroSection } from '@/components/home/EnhancedHeroSection';
import { FeaturesOverview } from '@/components/home/FeaturesOverview';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <EnhancedHeroSection />
      
      {/* Main Lookup Interface */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Get Your Car's Value</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose your preferred method to get an instant, accurate valuation of your vehicle
            </p>
          </div>
          <UnifiedLookupTabs />
        </div>
      </section>

      {/* Features Section */}
      <FeaturesOverview />
      
      {/* Testimonials */}
      <TestimonialsSection />
    </div>
  );
}
