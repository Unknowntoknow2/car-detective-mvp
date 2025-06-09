
import React from 'react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onFreeValuationClick: () => void;
}

export function HeroSection({ onFreeValuationClick }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 px-4">
      <div className="container mx-auto max-w-6xl text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Discover Your Car's True Value
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Get instant, AI-powered vehicle valuations with market insights, auction data, and premium CARFAX reports
        </p>
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Button 
            onClick={onFreeValuationClick}
            size="lg"
            className="w-full sm:w-auto"
          >
            Get Free Valuation
          </Button>
          <Button 
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}
