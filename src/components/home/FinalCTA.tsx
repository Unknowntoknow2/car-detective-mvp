
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const FinalCTA: React.FC = () => {
  const scrollToValuation = () => {
    const section = document.querySelector('[data-section="valuation"]');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-blue-600">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Get Your Vehicle's True Value?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who trust our platform for accurate, instant vehicle valuations.
          </p>
          
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-12 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            onClick={scrollToValuation}
          >
            Start Free Valuation
            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};
