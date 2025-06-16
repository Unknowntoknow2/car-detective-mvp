// src/components/home/EnhancedHeroSection.tsx

import React from "react";
import { Button } from "@/components/ui/button";

interface EnhancedHeroSectionProps {
  onFreeValuationClick?: () => void;
}

export const EnhancedHeroSection: React.FC<EnhancedHeroSectionProps> = ({
  onFreeValuationClick,
}) => {
  return (
    <section className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-20 px-6 md:px-12 rounded-b-3xl shadow-lg">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
          The Smarter Way to Know Your Car’s True Value
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl">
          Get instant market pricing, AI-powered insights, and verified auction data for your vehicle — all in one place.
        </p>
        <Button
          className="text-lg px-8 py-4 rounded-xl font-medium bg-white text-indigo-700 hover:bg-slate-100 transition"
          onClick={onFreeValuationClick}
        >
          Get Free Valuation
        </Button>
      </div>
    </section>
  );
};
