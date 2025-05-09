
import React from "react";
import { Button } from "@/components/ui/button";
import { LookupTabs } from "@/components/home/LookupTabs";

const HeroSection: React.FC = () => {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
              Know Your Car's True Value
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Get an accurate, data-driven valuation of your vehicle in minutes. No hidden fees.
            </p>
            <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex">
              <Button size="lg" className="w-full md:w-auto px-8">
                See How It Works
              </Button>
              <Button variant="outline" size="lg" className="w-full md:w-auto px-8">
                View Recent Valuations
              </Button>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <LookupTabs defaultTab="vin" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
