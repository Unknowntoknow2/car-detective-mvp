
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { LookupTabs } from "@/components/premium/lookup/LookupTabs";
import { useValuation } from "@/contexts/ValuationContext";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface PremiumTabsProps {
  showFreeValuation?: boolean;
  onSubmit?: (type: string, value: string, state?: string, data?: any) => void;
}

export function PremiumTabs({ 
  showFreeValuation = true,
  onSubmit
}: PremiumTabsProps) {
  // If showFreeValuation is false, we'll default to premium tab
  const defaultTab = showFreeValuation ? "basic" : "premium";
  const { processPremiumValuation, isProcessing } = useValuation();
  const [upgrading, setUpgrading] = useState(false);
  const navigate = useNavigate();
  
  // Add state for the lookup tabs
  const [lookupType, setLookupType] = useState<'vin' | 'plate' | 'manual'>('vin');
  
  const handlePremiumUpgrade = async () => {
    console.log("PREMIUM: Upgrade button clicked");
    setUpgrading(true);
    try {
      // Here we would typically handle the payment flow
      // For now, we'll just show a toast and redirect
      toast.success("Redirecting to premium checkout...");
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log("PREMIUM: Redirecting to premium checkout page");
      navigate("/premium#premium-form");
    } catch (error) {
      console.error("PREMIUM: Error during upgrade:", error);
      toast.error("Failed to process premium upgrade");
    } finally {
      setUpgrading(false);
    }
  };

  const handleLookupSubmit = (type: string, value: string, state?: string) => {
    console.log(`PREMIUM ${type.toUpperCase()}: Form submitted:`, { value, state });
    
    if (onSubmit) {
      onSubmit(type, value, state);
    } else {
      // Default handling if no onSubmit provided - We need to create a valuationData object
      const valuationData = {
        type,
        value,
        state,
        // Add any other required fields for the valuation context
        make: type === 'manual' ? JSON.parse(value).make : undefined,
        model: type === 'manual' ? JSON.parse(value).model : undefined,
        year: type === 'manual' ? JSON.parse(value).year : undefined,
        zipCode: type === 'manual' ? JSON.parse(value).zipCode : undefined,
      };
      
      processPremiumValuation(valuationData)
        .then(result => {
          console.log(`PREMIUM ${type.toUpperCase()}: Result:`, result);
          if (result?.valuationId) {
            console.log(`PREMIUM ${type.toUpperCase()}: Valuation ID:`, result.valuationId);
            localStorage.setItem('latest_valuation_id', result.valuationId);
            navigate(`/valuation-result?id=${result.valuationId}`);
          }
        })
        .catch(err => {
          console.error(`PREMIUM ${type.toUpperCase()}: Error:`, err);
          toast.error("Failed to process valuation");
        });
    }
  };
  
  return (
    <Tabs defaultValue={defaultTab} className="max-w-4xl mx-auto">
      {showFreeValuation ? (
        <TabsList className="grid w-full grid-cols-2 h-auto p-1">
          <TabsTrigger 
            value="basic" 
            className="py-3 px-4 rounded-md data-[state=active]:shadow-sm"
          >
            Free Valuation
          </TabsTrigger>
          <TabsTrigger 
            value="premium" 
            className="py-3 px-4 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Premium Report
          </TabsTrigger>
        </TabsList>
      ) : (
        // When showFreeValuation is false, don't show tabs selector - only premium content
        <div className="mb-6"></div>
      )}

      {showFreeValuation && (
        <TabsContent value="basic" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Free Valuation</CardTitle>
              <CardDescription>Get a quick, AI-powered estimate based on market data.</CardDescription>
            </CardHeader>
            <CardContent>
              <LookupTabs 
                lookup={lookupType}
                onLookupChange={setLookupType}
                formProps={{
                  onSubmit: (data) => handleLookupSubmit('manual', JSON.stringify(data)),
                  onVinLookup: (vin) => handleLookupSubmit('vin', vin),
                  onPlateLookup: (plate, state) => handleLookupSubmit('plate', plate, state),
                  isLoading: isProcessing,
                  submitButtonText: "Get Valuation"
                }}
                onSubmit={handleLookupSubmit}
              />
            </CardContent>
          </Card>
        </TabsContent>
      )}

      <TabsContent value="premium" className="mt-6">
        <Card className="border-2 border-primary">
          <CardHeader className="bg-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Premium Valuation</CardTitle>
                <CardDescription className="mt-1">Complete vehicle history and premium insights</CardDescription>
              </div>
              <div className="text-lg font-bold">$29.99</div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Full CARFAX® History Report</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Verified Dealer Offers</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>12-Month Resale Trend Forecast</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Detailed Confidence Score</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Professional PDF Report</span>
              </li>
            </ul>
            <Button 
              className="w-full mt-4" 
              size="lg" 
              onClick={handlePremiumUpgrade}
              disabled={upgrading || isProcessing}
            >
              {upgrading || isProcessing ? "Processing..." : "Get Premium Report for $29.99"}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
