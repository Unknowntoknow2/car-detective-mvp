
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Car, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  onFreeValuationClick?: () => void;
}

export function HeroSection({ onFreeValuationClick }: HeroSectionProps) {
  const handleValuationClick = () => {
    if (onFreeValuationClick) {
      onFreeValuationClick();
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-background">
      <div className="container px-4 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Know Your Car's <span className="text-primary">True Value</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-md">
              Get an accurate valuation powered by market data, AI analysis, and real dealer insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {onFreeValuationClick ? (
                <Button size="lg" onClick={handleValuationClick}>
                  <Car className="mr-2 h-5 w-5" />
                  Get Free Valuation
                </Button>
              ) : (
                <Button size="lg" asChild>
                  <Link to="/valuation">
                    <Car className="mr-2 h-5 w-5" />
                    Get Free Valuation
                  </Link>
                </Button>
              )}
              <Button size="lg" variant="outline" asChild>
                <Link to="/premium">
                  Premium Features
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm">VIN and license plate lookup</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm">CARFAX® and auction history integration</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm">AI-powered market trend analysis</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative z-10">
              <img 
                src="/images/hero-car.png" 
                alt="Car valuation" 
                className="w-full h-auto rounded-lg shadow-xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80';
                }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg transform rotate-3 scale-105 -z-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
