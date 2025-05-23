
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface PremiumHeroProps {
  scrollToForm: () => void;
}

export const PremiumHero: React.FC<PremiumHeroProps> = ({ scrollToForm }) => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-primary/10 to-background">
      <div className="container flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Unlock Your Vehicle's
          <span className="text-primary block mt-2">True Market Value</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-8">
          Our premium valuation service delivers detailed insights and accurate pricing
          that you can trust when buying, selling, or trading your vehicle.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Button size="lg" onClick={scrollToForm} className="gap-2">
            Get Premium Valuation <ChevronDown className="h-4 w-4" />
          </Button>
          
          <Button size="lg" variant="outline" onClick={() => window.open('/how-it-works', '_blank')}>
            Learn How It Works
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
          {[
            { label: 'Accuracy Rate', value: '95%' },
            { label: 'Data Points', value: '50M+' },
            { label: 'Valuations', value: '750K+' },
            { label: 'Trusted By', value: '1000+ Dealers' },
          ].map((stat, index) => (
            <div key={index} className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</span>
              <span className="text-sm md:text-base text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
