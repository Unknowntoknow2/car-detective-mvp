
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, Shield, Building, ChartBar } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface PremiumHeroProps {
  scrollToForm?: () => void;
}

export function PremiumHero({ scrollToForm }: PremiumHeroProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePurchase = async () => {
    if (!user) {
      toast.error("Please sign in to purchase premium valuation");
      navigate("/auth");
      return;
    }

    try {
      setIsLoading(true);
      toast.info("Preparing checkout...");
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {},
      });

      if (error) {
        console.error('Checkout error:', error);
        throw new Error(error.message || 'Failed to create checkout session');
      }

      if (!data?.url) {
        throw new Error('No checkout URL received');
      }
      
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Payment error:', error);
      toast.error("Failed to process payment. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white py-24 border-b">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6">
          <Badge variant="outline" className="bg-primary/5 text-primary py-1.5 px-3 mb-4 font-medium">
            CARFAX® Report Included ($44 value)
          </Badge>
          
          <h1 className="text-4xl font-display font-bold text-slate-900 sm:text-5xl md:text-6xl">
            Premium Valuation — $29.99
          </h1>
          
          <p className="mt-4 text-xl text-slate-600 max-w-3xl mx-auto">
            Get the most accurate valuation with our professional-grade service
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white transition-all duration-300 py-6 px-8 h-auto text-lg font-medium"
              onClick={handlePurchase}
              disabled={isLoading}
            >
              {isLoading ? (
                <>Processing...</>
              ) : (
                <>Purchase Premium <ArrowRight className="ml-2 h-5 w-5" /></>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto border-slate-300 hover:bg-slate-50 transition-all duration-300 py-6 px-8 h-auto text-lg font-medium"
              onClick={scrollToForm}
            >
              View Options <ChevronDown className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-8 mt-16 text-left">
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Full CARFAX Report</h3>
              </div>
              <p className="text-slate-600">Complete vehicle history with accident records and service data</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Building className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Dealer-beat Offers</h3>
              </div>
              <p className="text-slate-600">Compare real-time offers from local dealerships</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <ChartBar className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">12-Month Forecast</h3>
              </div>
              <p className="text-slate-600">AI-powered price prediction for optimal selling time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
