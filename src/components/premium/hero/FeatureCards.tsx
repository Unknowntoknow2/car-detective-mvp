
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

export function FeatureCards() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 mt-4">
        <Button 
          size="lg" 
          className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white transition-all duration-300"
          asChild
        >
          <a href="#premium-form">
            Purchase Premium <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
      
      <div className="grid sm:grid-cols-3 gap-4 mt-8">
        <div className="bg-white p-4 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Check className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-sm">Full CARFAX Report</h3>
          </div>
          <p className="text-xs text-slate-600 ml-9">Complete vehicle history with accident records</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Check className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-sm">Dealer-beat Offers</h3>
          </div>
          <p className="text-xs text-slate-600 ml-9">Compare real-time offers from dealers</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Check className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-sm">12-Month Forecast</h3>
          </div>
          <p className="text-xs text-slate-600 ml-9">AI-powered price prediction for selling</p>
        </div>
      </div>
    </div>
  );
}
