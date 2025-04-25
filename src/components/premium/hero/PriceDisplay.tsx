
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function PriceDisplay() {
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
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {},
      });

      if (error || !data?.url) {
        throw new Error(error?.message || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Payment error:', error);
      toast.error("Failed to process payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center space-y-4">
      <h1 className="text-4xl font-display font-bold text-slate-900 sm:text-5xl">
        Premium Valuation — $29.99
      </h1>
      
      <p className="mt-6 text-lg text-slate-600 max-w-3xl mx-auto">
        Get the most accurate valuation with our professional-grade service
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
        <Button 
          size="lg" 
          className="w-full sm:w-auto"
          onClick={handlePurchase}
          disabled={isLoading}
        >
          {isLoading ? (
            "Processing..."
          ) : (
            <>
              Purchase Premium <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
