
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function PriceDisplay() {
  return (
    <div className="text-center space-y-4">
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
    </div>
  );
}
