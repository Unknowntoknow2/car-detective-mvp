
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LookupTabs } from '@/components/premium/lookup/LookupTabs';
import { useVehicleLookup } from '@/hooks/useVehicleLookup';
import { Button } from '@/components/ui/button';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';

export default function PremiumPage() {
  const { lookupVehicle, isLoading, vehicle } = useVehicleLookup();
  const [lookup, setLookup] = React.useState<'vin' | 'plate' | 'manual'>('vin');
  
  const handleLookupChange = (value: 'vin' | 'plate' | 'manual') => {
    setLookup(value);
  };

  const handleManualSubmit = (data: ManualEntryFormData) => {
    lookupVehicle('manual', 'manual-entry', undefined, data);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1 container max-w-5xl py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 sm:space-y-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Premium Valuation
            </h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600">
              Get a detailed premium valuation with enhanced accuracy and comprehensive insights.
            </p>
          </div>

          <LookupTabs 
            lookup={lookup} 
            onLookupChange={handleLookupChange} 
            formProps={{ 
              onSubmit: handleManualSubmit,
              isLoading: isLoading,
              submitButtonText: "Get Premium Valuation"
            }} 
          />
          
          {vehicle && (
            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Vehicle Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p><span className="font-medium">Make:</span> {vehicle.make}</p>
                  <p><span className="font-medium">Model:</span> {vehicle.model}</p>
                  <p><span className="font-medium">Year:</span> {vehicle.year}</p>
                </div>
                <div className="space-y-2">
                  {vehicle.trim && <p><span className="font-medium">Trim:</span> {vehicle.trim}</p>}
                  {vehicle.mileage && <p><span className="font-medium">Mileage:</span> {vehicle.mileage.toLocaleString()}</p>}
                  {vehicle.bodyType && <p><span className="font-medium">Body Type:</span> {vehicle.bodyType}</p>}
                </div>
              </div>
              <div className="mt-6">
                <Button className="w-full">Proceed to Premium Valuation</Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
