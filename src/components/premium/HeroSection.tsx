
import { BreadcrumbPath } from '@/components/ui/design-system';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/ui/design-system';
import { ChevronRight, Check } from 'lucide-react';
import { PremiumCard } from './PremiumCard';
import { RefObject } from 'react';

interface HeroSectionProps {
  scrollToFeatures: () => void;
  scrollToForm: () => void;
  cardRef: RefObject<HTMLDivElement>;
  cardRotation: { x: number; y: number; };
}

export function HeroSection({ scrollToFeatures, scrollToForm, cardRef, cardRotation }: HeroSectionProps) {
  return (
    <div className="bg-gradient-primary py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10"></div>
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <BreadcrumbPath 
          className="text-white/70 mb-8" 
          items={[
            { label: 'Home', href: '/' },
            { label: 'Premium Valuation' }
          ]}
        />
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge className="bg-white/20 text-white hover:bg-white/30 mb-2">CARFAX® Included</Badge>
            <SectionHeader
              title="Premium Vehicle Valuation"
              description="Unlock comprehensive insights with our professional-grade valuation service that combines market data with accident history"
              variant="gradient"
              className="text-white"
              size="lg"
            />
            
            <ul className="space-y-4 mt-8">
              {[
                "Complete CARFAX® accident and service history analysis",
                "Dealer network price comparison across your area",
                "12-month value forecast with market trend analysis",
                "Personalized PDF report with detailed breakdown"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-white/90">{item}</span>
                </li>
              ))}
            </ul>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button 
                onClick={scrollToForm}
                size="lg"
                className="button-3d"
              >
                Start Premium Valuation
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                onClick={scrollToFeatures}
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="relative hidden md:block preserve-3d">
            <div 
              ref={cardRef}
              className="relative preserve-3d transition-all duration-200 ease-out transform"
              style={{
                transform: `perspective(1000px) rotateX(${cardRotation.x}deg) rotateY(${cardRotation.y}deg)`
              }}
            >
              <PremiumCard />
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none">
          <path d="M0 0L48 8C96 16 192 32 288 37.3C384 43 480 37 576 32C672 27 768 21 864 24C960 27 1056 37 1152 42.7C1248 48 1344 48 1392 48H1440V80H0V0Z" fill="#F9FAFB"/>
        </svg>
      </div>
    </div>
  );
}
