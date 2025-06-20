
import { useEffect, useRef, useState } from "react";
import { EnhancedHeroSection } from "@/components/home/EnhancedHeroSection";
import { KeyFeatures } from "@/components/home/KeyFeatures";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { ComparisonTable } from "@/components/home/ComparisonTable";
import { ValuePropositionSection } from "@/components/home/ValuePropositionSection";
import { PremiumServicesGrid } from "@/components/home/PremiumServicesGrid";
import { PremiumTabs } from "@/components/premium/premium-core/PremiumTabs";
import { MarketingBanner } from "@/components/marketing/MarketingBanner";
import { AnnouncementBar } from "@/components/marketing/AnnouncementBar";
import { LookupTabs } from "@/components/home/LookupTabs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useValuation } from "@/contexts/ValuationContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function HomePage() {
  const valuationRef = useRef<HTMLDivElement>(null);
  const [valuationType, setValuationType] = useState<"free" | "premium">("free");
  const { processFreeValuation, processPremiumValuation, isLoading } = useValuation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("HOME PAGE: Component mounted");
  }, []);

  const scrollToValuation = () => {
    valuationRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleValuationTypeChange = (value: string) => {
    setValuationType(value as "free" | "premium");
    console.log(`HOME PAGE: User selected ${value} valuation type`);
  };

  const handleFreeFormSubmit = async (
    type: string,
    value: string,
    state?: string
  ) => {
    console.log(`HOME FREE ${type.toUpperCase()}:`, value);
    
    if (isLoading) {
      toast.error("Please wait for the current valuation to complete");
      return;
    }

    try {
      const parsed = type === "manual" ? JSON.parse(value) : {};
      const valuationData = {
        type,
        value,
        state,
        make: parsed.make,
        model: parsed.model,
        year: parsed.year,
        zipCode: parsed.zipCode
      };

      const result = await processFreeValuation(valuationData);
      
      if (result?.valuationId) {
        localStorage.setItem("latest_valuation_id", result.valuationId);
        toast.success("Vehicle valuation complete!");
        navigate(`/results/${result.valuationId}`);
      }
    } catch (error) {
      console.error("Free valuation error:", error);
      toast.error("Failed to process valuation. Please try again.");
    }
  };

  const handlePremiumFormSubmit = async (
    type: string,
    value: string,
    state?: string,
    data?: any
  ) => {
    console.log(`HOME PREMIUM ${type.toUpperCase()}:`, value);
    
    if (isLoading) {
      toast.error("Please wait for the current valuation to complete");
      return;
    }

    try {
      const parsed = type === "manual" ? JSON.parse(value) : {};
      const valuationData = {
        type,
        value,
        state,
        make: parsed.make,
        model: parsed.model,
        year: parsed.year,
        zipCode: parsed.zipCode,
        ...data
      };

      const result = await processPremiumValuation(valuationData);
      
      if (result?.valuationId) {
        toast.success("Premium valuation complete!");
        navigate(`/premium/results/${result.valuationId}`);
      } else {
        navigate("/premium");
      }
    } catch (error) {
      console.error("Premium valuation error:", error);
      toast.error("Failed to process premium valuation. Please try again.");
    }
  };

  return (
    <div className="animate-fade-in">
      <AnnouncementBar />
      <main>
        <EnhancedHeroSection onFreeValuationClick={scrollToValuation} />
        <KeyFeatures />
        <ValuePropositionSection />
        
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <MarketingBanner
            headline="Experience Premium Valuation with CARFAX® Reports"
            subtext="Get dealer-competitive offers, full vehicle history, and pricing forecasts not available in the free version."
            ctaText="Try Premium for $29.99"
            ctaHref="/premium"
          />
        </div>
        
        <PremiumServicesGrid />
        <TestimonialsSection />
        <ComparisonTable />
        
        <div ref={valuationRef} className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Get Your Vehicle Valuation
            </h2>
            
            <Tabs
              defaultValue="free"
              value={valuationType}
              onValueChange={handleValuationTypeChange}
              className="w-full max-w-3xl mx-auto mb-8"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="free" disabled={isLoading}>
                  {isLoading && valuationType === "free" ? "Processing..." : "Free Valuation"}
                </TabsTrigger>
                <TabsTrigger value="premium" disabled={isLoading}>
                  {isLoading && valuationType === "premium" ? "Processing..." : "Premium Report"}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="free" className="mt-6">
                <div className="text-center mb-6">
                  <p className="text-lg text-slate-600">
                    Get a quick, AI-powered estimate based on market data.
                  </p>
                </div>
                <LookupTabs 
                  defaultTab="vin" 
                  onSubmit={handleFreeFormSubmit}
                />
              </TabsContent>
              
              <TabsContent value="premium" className="mt-6">
                <div className="text-center mb-6">
                  <p className="text-lg text-slate-600">
                    Get comprehensive analysis with CARFAX® report and dealer-competitive offers.
                  </p>
                </div>
                <PremiumTabs 
                  showFreeValuation={false} 
                  onSubmit={handlePremiumFormSubmit}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
