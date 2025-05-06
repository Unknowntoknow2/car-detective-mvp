
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FreeValuationForm } from '@/components/valuation/free/FreeValuationForm';
import { ValuationResult } from '@/components/valuation/free/ValuationResult';
import { UpsellBanner } from '@/components/valuation/free/UpsellBanner';
import { FeaturesIncluded } from '@/components/valuation/free/FeaturesIncluded';
import { AnnouncementBar } from '@/components/marketing/AnnouncementBar';
import { MarketingBanner } from '@/components/marketing/MarketingBanner';
import type { ManualVehicleInfo } from '@/hooks/useManualValuation';

export default function FreeValuationPage() {
  const [valuationComplete, setValuationComplete] = useState(false);
  const [valuationData, setValuationData] = useState<ManualVehicleInfo | null>(null);
  const [valuationId, setValuationId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleValuationComplete = (data: ManualVehicleInfo, id?: string) => {
    setValuationData(data);
    if (id) {
      setValuationId(id);
      // Store valuationId in localStorage for persistence
      localStorage.setItem('latest_valuation_id', id);
    }
    setValuationComplete(true);
    setIsLoading(false);
  };
  
  const handleStartLoading = () => {
    setIsLoading(true);
  };
  
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1 container max-w-2xl py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 sm:space-y-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Free Vehicle Valuation
            </h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600">
              Enter your vehicle details to get an instant, accurate market estimate—100% free.
            </p>
          </div>

          {!valuationComplete && (
            <MarketingBanner 
              headline="Want the full analysis with CARFAX® history?"
              subtext="Our premium valuation includes complete vehicle history, accident details, and market-based pricing adjustments."
              ctaText="View Premium Features"
              ctaHref="/premium"
            />
          )}

          {!valuationComplete ? (
            <FreeValuationForm 
              onValuationComplete={handleValuationComplete} 
              onStartLoading={handleStartLoading}
              isLoading={isLoading}
            />
          ) : (
            <div className="space-y-4 sm:space-y-6">
              <ValuationResult 
                valuationData={valuationData} 
                valuationId={valuationId} 
              />
              <UpsellBanner />
              <FeaturesIncluded />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
