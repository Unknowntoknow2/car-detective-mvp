
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, ChevronDown, Check } from 'lucide-react';

interface PremiumHeroProps {
  scrollToForm: () => void;
}

export function PremiumHero({ scrollToForm }: PremiumHeroProps) {
  return (
    <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 md:py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div>
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 transition-colors">
              Premium Experience
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Advanced Vehicle Valuation & Analytics
          </h1>
          
          <p className="text-lg md:text-xl mb-8 text-white/90">
            Get dealer-competitive offers, full vehicle history, and pricing forecasts 
            with our comprehensive premium valuation tools.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-indigo-700 hover:bg-white/90"
              onClick={scrollToForm}
            >
              <Zap className="mr-2 h-5 w-5" />
              Try Premium for $29.99
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent border-white text-white hover:bg-white/10"
            >
              <ChevronDown className="mr-2 h-5 w-5" />
              Learn More
            </Button>
          </div>
          
          <div className="mt-10 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-green-300" />
              <span>CARFAX® Included</span>
            </div>
            <div className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-green-300" />
              <span>One-Time Payment</span>
            </div>
            <div className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-green-300" />
              <span>No Subscription</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
