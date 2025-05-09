
import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LookupTabs } from '@/components/premium/lookup/LookupTabs';
import { useVehicleLookup } from '@/hooks/useVehicleLookup';
import { Button } from '@/components/ui/button';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';
import { PremiumHero } from '@/components/premium/PremiumHero';
import { EnhancedPremiumFeaturesTabs } from '@/components/premium/features/EnhancedPremiumFeaturesTabs';
import { ComparisonSection } from '@/components/premium/ComparisonSection';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function PremiumPage() {
  const { lookupVehicle, isLoading, vehicle, reset } = useVehicleLookup();
  const [lookup, setLookup] = useState<'vin' | 'plate' | 'manual'>('vin');
  const featuresRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Debugging logs to track vehicle data
  useEffect(() => {
    if (vehicle) {
      console.log("Vehicle data updated:", vehicle);
    }
  }, [vehicle]);
  
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLookupChange = (value: 'vin' | 'plate' | 'manual') => {
    setLookup(value);
    // Reset vehicle data when changing lookup method
    reset();
  };

  const handleLookupSubmit = async (type: 'vin' | 'plate' | 'manual', identifier: string, state?: string, data?: any) => {
    try {
      // Call lookupVehicle and handle the result
      const result = await lookupVehicle(type, identifier, state, data);
      
      if (result) {
        console.log("Lookup successful:", result);
        toast.success(`Found: ${result.year} ${result.make} ${result.model}`);
      }
    } catch (error) {
      console.error("Lookup error:", error);
    }
  };

  const handleManualSubmit = (data: ManualEntryFormData) => {
    lookupVehicle('manual', 'manual-entry', undefined, data);
  };

  const handleProceedToValuation = () => {
    if (!vehicle) return;
    
    // Save vehicle details to localStorage for the premium valuation process
    localStorage.setItem("premium_vehicle", JSON.stringify({
      identifierType: 'vin',
      identifier: vehicle.vin || '',
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      trim: vehicle.trim || "Standard",
      bodyType: vehicle.bodyType,
      transmission: vehicle.transmission,
      drivetrain: vehicle.drivetrain
    }));
    
    toast.success("Vehicle information saved. Continuing to premium valuation.");
    navigate("/premium-valuation");
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <PremiumHero />
        
        <div ref={featuresRef} className="py-12">
          <EnhancedPremiumFeaturesTabs />
        </div>
        
        <ComparisonSection scrollToForm={scrollToForm} />
        
        <div ref={formRef} id="premium-form" className="container max-w-5xl py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                Get Your Premium Valuation
              </h2>
              <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600">
                Start with your vehicle details below for a comprehensive premium analysis.
              </p>
            </div>

            <LookupTabs 
              lookup={lookup} 
              onLookupChange={handleLookupChange} 
              formProps={{ 
                onSubmit: handleManualSubmit,
                isLoading: isLoading,
                submitButtonText: "Get Premium Valuation",
                onVinLookup: (vin) => handleLookupSubmit('vin', vin),
                onPlateLookup: (plate, state) => handleLookupSubmit('plate', plate, state)
              }} 
            />
            
            {vehicle && (
              <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border animate-fade-in">
                <h2 className="text-xl font-semibold mb-4">Vehicle Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p><span className="font-medium">Make:</span> {vehicle.make}</p>
                    <p><span className="font-medium">Model:</span> {vehicle.model}</p>
                    <p><span className="font-medium">Year:</span> {vehicle.year}</p>
                  </div>
                  <div className="space-y-2">
                    {vehicle.trim && <p><span className="font-medium">Trim:</span> {vehicle.trim}</p>}
                    {vehicle.bodyType && <p><span className="font-medium">Body Type:</span> {vehicle.bodyType}</p>}
                    {vehicle.transmission && <p><span className="font-medium">Transmission:</span> {vehicle.transmission}</p>}
                    {vehicle.drivetrain && <p><span className="font-medium">Drivetrain:</span> {vehicle.drivetrain}</p>}
                  </div>
                </div>
                <div className="mt-6">
                  <Button className="w-full" onClick={handleProceedToValuation}>
                    Proceed to Premium Valuation
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
