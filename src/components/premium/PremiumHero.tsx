
import React from 'react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { ShieldCheck, DollarSign, Clock, BarChart3 } from 'lucide-react';

interface PremiumHeroProps {
  scrollToForm: () => void;
}

export const PremiumHero: React.FC<PremiumHeroProps> = ({ scrollToForm }) => {
  return (
    <div className="bg-gradient-to-b from-primary/5 to-background py-20">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
            Premium Vehicle Valuation
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Get the most accurate valuation with our premium service, including complete vehicle history, dealer offers, and future value projections.
          </p>
          
          <div className="mt-10">
            <Button 
              size="lg" 
              onClick={scrollToForm}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg"
            >
              Get Premium Valuation
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <ShieldCheck className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Verified Accuracy</h3>
              <p className="text-gray-600">
                Data verified from multiple trusted sources for precision
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <DollarSign className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Real Dealer Offers</h3>
              <p className="text-gray-600">
                See what dealers in your area would actually pay
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <Clock className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Complete History</h3>
              <p className="text-gray-600">
                Full vehicle history including accidents and service records
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <BarChart3 className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Market Analysis</h3>
              <p className="text-gray-600">
                12-month price forecast based on market trends
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
