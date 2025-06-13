import { useEffect, useRef, useState } from "react";
import { EnhancedHeroSection } from "@/components/home/EnhancedHeroSection";
import { KeyFeatures } from "@/components/home/KeyFeatures";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { ComparisonTable } from "@/components/home/ComparisonTable";
import { ValuePropositionSection } from "@/components/home/ValuePropositionSection";
import { PremiumServicesGrid } from "@/components/home/PremiumServicesGrid";
import { PremiumTabs } from "@/components/premium/PremiumTabs";
import { MarketingBanner } from "@/components/marketing/MarketingBanner";
import { AnnouncementBar } from "@/components/marketing/AnnouncementBar";
import { LookupTabs } from "@/components/home/LookupTabs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useValuation } from "@/contexts/ValuationContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Index() {
  const valuationRef = useRef<HTMLDivElement>(null);
  const [valuationType, setValuationType] = useState<"free" | "premium">(
    "free",
  );
  const { processFreeValuation, processPremiumValuation } = useValuation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("HOME PAGE: Component mounted");
  }, []);

  const scrollToValuation = () => {
    valuationRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleValuationTypeChange = (value: string) => {
    setValuationType(value as "free" | "premium");

    // Track user selection for analytics purposes
    try {
      // Analytics tracking would go here
      console.log(`HOME PAGE: User selected ${value} valuation type`);
    } catch (error) {
      console.error(
        "HOME PAGE: Error tracking valuation type selection:",
        error,
      );
    }
  };

  const handleFreeFormSubmit = (
    type: string,
    value: string,
    state?: string,
  ) => {
    console.log(
      `HOME FREE ${type.toUpperCase()}: Form submitted with value:`,
      value,
    );
    if (state) console.log(`HOME FREE ${type.toUpperCase()}: State:`, state);

    // Process valuation through context - Create valuationData object
    const valuationData = {
      type,
      value,
      state,
      // Add any other required fields for the valuation context
      make: type === "manual" ? JSON.parse(value).make : undefined,
      model: type === "manual" ? JSON.parse(value).model : undefined,
      year: type === "manual" ? JSON.parse(value).year : undefined,
      zipCode: type === "manual" ? JSON.parse(value).zipCode : undefined,
    };

    processFreeValuation(valuationData)
      .then((result) => {
        console.log(
          `HOME FREE ${type.toUpperCase()}: Valuation result:`,
          result,
        );
        if (result?.valuationId) {
          console.log(
            `HOME FREE ${type.toUpperCase()}: Got valuationId:`,
            result.valuationId,
          );
          localStorage.setItem("latest_valuation_id", result.valuationId);
          toast.success("Vehicle valuation complete!");
          navigate(`/result?valuationId=${result.valuationId}`);
        }
      })
      .catch((error) => {
        console.error(`HOME FREE ${type.toUpperCase()}: Error:`, error);
        toast.error("Failed to process valuation");
      });
  };

  const handlePremiumFormSubmit = (
    type: string,
    value: string,
    state?: string,
    data?: any,
  ) => {
    console.log(
      `HOME PREMIUM ${type.toUpperCase()}: Form submitted with value:`,
      value,
    );
    if (state) console.log(`HOME PREMIUM ${type.toUpperCase()}: State:`, state);
    if (data) console.log(`HOME PREMIUM ${type.toUpperCase()}: Data:`, data);

    // Process premium valuation - Create valuationData object
    const valuationData = {
      type,
      value,
      state,
      // Add any other required fields for the valuation context
      make: type === "manual" ? JSON.parse(value).make : undefined,
      model: type === "manual" ? JSON.parse(value).model : undefined,
      year: type === "manual" ? JSON.parse(value).year : undefined,
      zipCode: type === "manual" ? JSON.parse(value).zipCode : undefined,
      // Include any additional data
      ...data,
    };

    processPremiumValuation(valuationData)
      .then((result) => {
        console.log(
          `HOME PREMIUM ${type.toUpperCase()}: Premium valuation result:`,
          result,
        );
        if (result?.valuationId) {
          toast.success("Premium valuation complete!");
          navigate(`/result?valuationId=${result.valuationId}&premium=true`);
        } else {
          navigate("/premium");
        }
      })
      .catch((error) => {
        console.error(`HOME PREMIUM ${type.toUpperCase()}: Error:`, error);
        toast.error("Failed to process premium valuation");
      });
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
                <TabsTrigger value="free">Free Valuation</TabsTrigger>
                <TabsTrigger value="premium">Premium Report</TabsTrigger>
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
                    Get comprehensive analysis with CARFAX® report and
                    dealer-competitive offers.
                  </p>
                </div>
                {/* Show only the Premium component, not free valuation */}
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
