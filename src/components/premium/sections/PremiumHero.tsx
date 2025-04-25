
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function PremiumHero() {
  return (
    <div className="bg-gradient-to-b from-slate-50 to-white py-16 border-b">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="bg-primary/5 text-primary mb-4">
            CARFAX® Report Included ($44 value)
          </Badge>
          
          <h1 className="text-4xl font-display font-bold text-slate-900 sm:text-5xl">
            Premium Valuation — $29.99
          </h1>
          
          <p className="mt-6 text-lg text-slate-600 max-w-3xl mx-auto">
            Get the most accurate valuation with our professional-grade service
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <a href="#premium-form">
                Purchase Premium <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-6 mt-12 text-left">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold mb-2">Full CARFAX Report</h3>
              <p className="text-sm text-slate-600">Complete vehicle history with accident records and service data</p>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold mb-2">Dealer-beat Offers</h3>
              <p className="text-sm text-slate-600">Compare real-time offers from local dealerships</p>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold mb-2">12-Month Forecast</h3>
              <p className="text-sm text-slate-600">AI-powered price prediction for optimal selling time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
