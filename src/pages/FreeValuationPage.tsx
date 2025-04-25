
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FreeValuationForm } from '@/components/valuation/free/FreeValuationForm';
import { ValuationResult } from '@/components/valuation/free/ValuationResult';
import { UpsellBanner } from '@/components/valuation/free/UpsellBanner';
import { FeaturesIncluded } from '@/components/valuation/free/FeaturesIncluded';

export default function FreeValuationPage() {
  const [valuationComplete, setValuationComplete] = useState(false);
  
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 container max-w-2xl py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Free Vehicle Valuation
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Enter your vehicle details to get an instant, accurate market estimate—100% free.
            </p>
          </div>

          <FreeValuationForm onValuationComplete={() => setValuationComplete(true)} />
          
          {valuationComplete && (
            <div className="space-y-6">
              <ValuationResult />
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
