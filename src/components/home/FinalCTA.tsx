
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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center bg-gray-50 rounded-3xl p-12 border border-gray-100">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Ready to Get Your Vehicle's True Value?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of professionals who trust our platform for accurate, instant vehicle valuations.
          </p>
          
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-12 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
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
