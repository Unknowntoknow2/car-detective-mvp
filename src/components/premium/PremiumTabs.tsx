
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { LookupTabs } from "@/components/home/LookupTabs";
import { useValuation } from "@/contexts/ValuationContext";
import { useState } from "react";
import { toast } from "sonner";

interface PremiumTabsProps {
  showFreeValuation?: boolean;
}

export function PremiumTabs({ showFreeValuation = true }: PremiumTabsProps) {
  // If showFreeValuation is false, we'll default to premium tab
  const defaultTab = showFreeValuation ? "basic" : "premium";
  const { processPremiumValuation, isProcessing } = useValuation();
  const [upgrading, setUpgrading] = useState(false);
  
  const handlePremiumUpgrade = async () => {
    setUpgrading(true);
    try {
      // Here we would typically handle the payment flow
      // For now, we'll just show a toast
      toast.success("Redirecting to premium checkout...");
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      window.location.href = "/premium";
    } catch (error) {
      toast.error("Failed to process premium upgrade");
    } finally {
      setUpgrading(false);
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
              <LookupTabs />
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
