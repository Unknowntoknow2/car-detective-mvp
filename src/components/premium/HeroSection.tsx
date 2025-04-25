
import { BreadcrumbPath } from '@/components/ui/design-system';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/ui/design-system';
import { ChevronRight, CheckCircle, Shield, BarChart3, FileCheck } from 'lucide-react';
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
    <div className="relative py-20 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5"></div>
      
      {/* Light rays effect */}
      <div className="absolute inset-0 bg-gradient-radial from-slate-700/20 via-transparent to-transparent opacity-40"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <BreadcrumbPath 
          className="text-slate-300 mb-8" 
          items={[
            { label: 'Home', href: '/' },
            { label: 'Premium Valuation' }
          ]}
        />
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge className="bg-primary/90 text-white hover:bg-primary mb-2 py-1.5 px-3 text-sm font-medium">
              CARFAX® Included
            </Badge>
            
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold text-white font-display leading-tight">
                Premium Vehicle Valuation
              </h1>
              <p className="text-xl text-slate-300 max-w-lg">
                Unlock comprehensive insights with our professional-grade valuation service
              </p>
            </div>
            
            <ul className="space-y-4 mt-8">
              {[
                "Complete CARFAX® accident and service history analysis",
                "Dealer network price comparison across your area",
                "12-month value forecast with market trend analysis",
                "Personalized PDF report with detailed breakdown"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-slate-200">{item}</span>
                </li>
              ))}
            </ul>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button 
                onClick={scrollToForm}
                size="lg"
                className="bg-primary hover:bg-primary-hover text-white transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
              >
                Start Premium Valuation
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                onClick={scrollToFeatures}
                variant="outline"
                size="lg"
                className="border-slate-500 text-slate-200 hover:bg-slate-700 hover:text-white hover:border-slate-400 transition-all duration-300"
              >
                Learn More
              </Button>
            </div>
          </div>
          
          {/* Premium benefits card */}
          <div className="relative hidden md:block preserve-3d">
            <div 
              ref={cardRef}
              className="relative preserve-3d transition-all duration-200 ease-out transform"
              style={{
                transform: `perspective(1000px) rotateX(${cardRotation.x}deg) rotateY(${cardRotation.y}deg)`
              }}
            >
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl text-white">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Premium Report</h3>
                  <Badge className="bg-primary text-white">Exclusive</Badge>
                </div>
                
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <Shield className="h-10 w-10 text-primary p-2 bg-primary/10 rounded-lg" />
                    <div>
                      <h4 className="text-lg font-semibold">CARFAX® Integration</h4>
                      <p className="text-slate-300 text-sm">Complete vehicle history analysis included</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <BarChart3 className="h-10 w-10 text-primary p-2 bg-primary/10 rounded-lg" />
                    <div>
                      <h4 className="text-lg font-semibold">Market Trends</h4>
                      <p className="text-slate-300 text-sm">Future value projections based on market data</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <FileCheck className="h-10 w-10 text-primary p-2 bg-primary/10 rounded-lg" />
                    <div>
                      <h4 className="text-lg font-semibold">Detailed Reports</h4>
                      <p className="text-slate-300 text-sm">Professional PDF with complete breakdown</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-slate-300 text-sm">Starting at</span>
                      <div className="text-3xl font-bold">$49.99</div>
                    </div>
                    <Button 
                      onClick={scrollToForm}
                      className="bg-white text-slate-900 hover:bg-slate-100"
                    >
                      Get Started
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none">
          <path d="M0 0L48 8C96 16 192 32 288 37.3C384 43 480 37 576 32C672 27 768 21 864 24C960 27 1056 37 1152 42.7C1248 48 1344 48 1392 48H1440V80H0V0Z" fill="#F9FAFB"/>
        </svg>
      </div>
    </div>
  );
}
