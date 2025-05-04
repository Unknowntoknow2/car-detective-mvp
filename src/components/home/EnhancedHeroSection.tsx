
import { Button } from "@/components/ui/button";
import { Shield, ChartBar } from "lucide-react";

interface EnhancedHeroSectionProps {
  onFreeValuationClick: () => void;
}

export function EnhancedHeroSection({ onFreeValuationClick }: EnhancedHeroSectionProps) {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-text-primary">
              Ready to Discover Your Car's True Worth?
            </h1>
            <div className="bg-yellow-100 text-yellow-800 inline-block px-3 py-1 rounded-md font-medium">
              No more guesswork
            </div>
            <p className="text-xl text-text-secondary max-w-xl">
              Get the accurate valuation you need today! Our AI-powered platform delivers 
              precise, market-driven price estimates instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary-hover text-white"
                onClick={onFreeValuationClick}
              >
                Start Free Valuation
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-primary/30 text-primary hover:bg-primary-light/20"
              >
                Premium Valuation ($29.99)
              </Button>
            </div>
            
            <div className="pt-6 flex items-center text-sm text-primary-accent">
              <Shield className="h-4 w-4 mr-2" />
              <span>Premium includes full CARFAX report ($44 value), market analysis, and dealer offers</span>
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
                Get a complete vehicle history report as part of your premium valuation.
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
                View current trends and price predictions based on real-time market data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
