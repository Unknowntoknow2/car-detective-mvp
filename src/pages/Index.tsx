
import { useState, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
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

export default function Index() {
  const valuationRef = useRef<HTMLDivElement>(null);
  const [valuationType, setValuationType] = useState<'free' | 'premium'>('free');
  const { processFreeValuation, processPremiumValuation } = useValuation();
  
  const scrollToValuation = () => {
    valuationRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleValuationTypeChange = (value: string) => {
    setValuationType(value as 'free' | 'premium');
    
    // Track user selection for analytics purposes
    try {
      // Analytics tracking would go here
      console.log(`User selected ${value} valuation type`);
    } catch (error) {
      console.error("Error tracking valuation type selection:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1 animate-fade-in">
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
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Get Your Vehicle Valuation</h2>
            
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
                <LookupTabs defaultTab="vin" />
              </TabsContent>
              
              <TabsContent value="premium" className="mt-6">
                <div className="text-center mb-6">
                  <p className="text-lg text-slate-600">
                    Get comprehensive analysis with CARFAX® report and dealer-competitive offers.
                  </p>
                </div>
                {/* Show only the Premium component, not free valuation */}
                <PremiumTabs showFreeValuation={false} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
