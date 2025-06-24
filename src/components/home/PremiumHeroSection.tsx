
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const PremiumHeroSection: React.FC = () => {
  const scrollToValuation = () => {
    const section = document.querySelector('[data-section="valuation"]');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-white py-20 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-none mb-6">
            Know Your Car's
            <span className="block text-blue-600">True Value</span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Instant, accurate vehicle valuations powered by real market data. 
            More precise than KBB, faster than appraisals.
          </p>

          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-12 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            onClick={scrollToValuation}
          >
            Get Instant Valuation
            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};
