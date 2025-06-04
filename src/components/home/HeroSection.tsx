<<<<<<< HEAD

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Car, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
=======
import { Button } from "@/components/ui/button";
import { Car, ChartBar, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface HeroSectionProps {
  onFreeValuationClick?: () => void;
}

export function HeroSection({ onFreeValuationClick }: HeroSectionProps) {
<<<<<<< HEAD
  const handleValuationClick = () => {
    if (onFreeValuationClick) {
      onFreeValuationClick();
    }
  };

=======
  const navigate = useNavigate();

  const handleFreeValuationClick = () => {
    if (onFreeValuationClick) {
      onFreeValuationClick();
    } else {
      navigate("/valuation");
    }
  };

  const handlePremiumClick = () => {
    navigate("/premium");
  };

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  return (
    <div className="relative bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-background">
      <div className="container px-4 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Know Your Car's <span className="text-primary">True Value</span>
            </h1>
<<<<<<< HEAD
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
=======
            <div className="bg-yellow-100 text-yellow-800 inline-block px-3 py-1 rounded-md font-medium">
              No more guesswork
            </div>
            <p className="text-xl text-text-secondary max-w-xl">
              Get the accurate valuation you need today! Our AI-powered platform
              delivers precise, market-driven price estimates instantly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary-hover text-white"
                onClick={handleFreeValuationClick}
              >
                Start Free Valuation
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-primary/30 text-primary hover:bg-primary-light/20"
                onClick={handlePremiumClick}
              >
                Premium Valuation ($29.99)
              </Button>
            </div>

            <div className="pt-6 flex items-center text-sm text-primary-accent">
              <Shield className="h-4 w-4 mr-2" />
              <span>
                Premium includes full CARFAX report ($44 value), market
                analysis, and dealer offers
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-border transform transition-all hover:shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium text-lg">CARFAX Integration</h3>
              </div>
              <p className="text-text-secondary">
                Get a complete vehicle history report as part of your premium
                valuation.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-border transform transition-all hover:shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <ChartBar className="h-5 w-5 text-success" />
                </div>
                <h3 className="font-medium text-lg">Market Analysis</h3>
              </div>
              <p className="text-text-secondary">
                View current trends and price predictions based on real-time
                market data.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-border transform transition-all hover:shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Car className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-medium text-lg">Enterprise API</h3>
              </div>
              <p className="text-text-secondary">
                Access our machine learning model directly through our
                developer-friendly API.
              </p>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg transform rotate-3 scale-105 -z-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
