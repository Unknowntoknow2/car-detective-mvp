
import { Button } from "@/components/ui/button";
import { Shield, ChartBar, Car, Award, TrendingUp } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';

interface EnhancedHeroSectionProps {
  onFreeValuationClick: () => void;
}

export function EnhancedHeroSection({ onFreeValuationClick }: EnhancedHeroSectionProps) {
  const isMobile = useIsMobile();
  
  return (
    <section className="py-12 md:py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-5 md:space-y-6">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
              Ready to Discover Your Car's <span className="text-primary">True Worth?</span>
            </h1>
            <div className="bg-yellow-100 text-yellow-800 inline-block px-3 py-1 rounded-md font-medium text-sm">
              No more guesswork
            </div>
            <p className="text-lg md:text-xl text-gray-700 max-w-xl">
              Get the accurate valuation you need today! Our AI-powered platform delivers 
              precise, market-driven price estimates instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2 md:pt-4">
              <Button 
                size={isMobile ? "default" : "lg"} 
                className="bg-primary hover:bg-primary-hover text-white mobile-full-width"
                onClick={onFreeValuationClick}
              >
                Start Free Valuation
              </Button>
              <Button 
                variant="outline" 
                size={isMobile ? "default" : "lg"}
                className="border-primary/30 text-primary hover:bg-primary-light/20 mobile-full-width"
              >
                Premium Valuation ($29.99)
              </Button>
            </div>
            
            <div className="pt-4 md:pt-6 flex items-center text-sm text-primary-accent">
              <Shield className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>Premium includes full CARFAX report ($44 value) and dealer offers</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:gap-6">
            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 transform transition-all hover:shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-100 p-2.5 rounded-full">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium text-lg">CARFAX Integration</h3>
              </div>
              <p className="text-gray-600">
                Get a complete vehicle history report as part of your premium valuation.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 transform transition-all hover:shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-100 p-2.5 rounded-full">
                  <ChartBar className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-medium text-lg">Market Analysis</h3>
              </div>
              <p className="text-gray-600">
                View current trends and price predictions based on real-time market data.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 transform transition-all hover:shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-purple-100 p-2.5 rounded-full">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-medium text-lg">Price Confidence Score</h3>
              </div>
              <p className="text-gray-600">
                Understand how confident we are in your valuation with our proprietary algorithm.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
