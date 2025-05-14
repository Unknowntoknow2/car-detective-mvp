
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
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ArrowRight, Check, Info } from 'lucide-react';
import { LoadingState } from '@/components/premium/common/LoadingState';

export default function PremiumPage() {
  const { lookupVehicle, isLoading, vehicle, reset } = useVehicleLookup();
  const [lookup, setLookup] = useState<'vin' | 'plate' | 'manual'>('vin');
  const featuresRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const existingValuationId = searchParams.get('valuationId');
  const [existingValuation, setExistingValuation] = useState<any | null>(null);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  
  // Set page as loaded after component mounts
  useEffect(() => {
    console.log('PREMIUM PAGE: Component mounted');
    
    // Mark page as loaded to prevent infinite loading state
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Debugging logs to track vehicle data
  useEffect(() => {
    if (vehicle) {
      console.log("PREMIUM PAGE: Vehicle data updated:", vehicle);
    }

    // Check if we already have vehicle data in localStorage from a previous lookup
    const storedVehicle = localStorage.getItem('premium_vehicle');
    if (storedVehicle && !vehicle) {
      try {
        const parsedVehicle = JSON.parse(storedVehicle);
        // If we have stored vehicle data and we're on the initial premium page,
        // we should redirect to the premium-valuation page
        if (parsedVehicle && window.location.pathname === '/premium') {
          navigate('/premium-valuation');
        }
      } catch (error) {
        console.error('Error parsing stored vehicle data:', error);
      }
    }
  }, [vehicle, navigate]);

  // Load existing valuation if ID is provided
  useEffect(() => {
    if (existingValuationId) {
      setLoadingExisting(true);
      
      // In a real app, fetch from Supabase
      // For demo, we'll check localStorage
      const storedValuation = localStorage.getItem(`valuation_${existingValuationId}`);
      
      if (storedValuation) {
        try {
          const parsedValuation = JSON.parse(storedValuation);
          setExistingValuation(parsedValuation);
          
          // Populate the vehicle data
          if (!vehicle) {
            // Call reset without arguments, but update state elsewhere
            reset();
            // Update vehicle data in a different way if needed
            // For example: using useEffect or other state management
          }
        } catch (err) {
          console.error('Error parsing stored valuation:', err);
          setLoadingExisting(false);
        }
      } else {
        // Mock data for demo
        const mockValuation = {
          id: existingValuationId,
          make: 'Honda',
          model: 'Accord',
          year: 2019,
          mileage: 45000,
          condition: 'Good',
          zipCode: '90210',
          estimated_value: 19850
        };
        
        setExistingValuation(mockValuation);
        
        // Populate the vehicle data
        if (!vehicle) {
          // Call reset without arguments, but update state elsewhere
          reset();
        }
      }
      
      setLoadingExisting(false);
    }
  }, [existingValuationId, reset, vehicle]);
  
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLookupChange = (value: 'vin' | 'plate' | 'manual') => {
    console.log(`PREMIUM PAGE: Lookup method changed to ${value}`);
    setLookup(value);
    // Reset vehicle data when changing lookup method
    reset();
  };

  const handleLookupSubmit = async (type: 'vin' | 'plate' | 'manual', identifier: string, state?: string, data?: any) => {
    try {
      console.log(`PREMIUM ${type.toUpperCase()}: Submitting form with identifier:`, identifier);
      if (state) console.log(`PREMIUM ${type.toUpperCase()}: State:`, state);
      if (data) console.log(`PREMIUM ${type.toUpperCase()}: Form data:`, data);
      
      // Call lookupVehicle and handle the result
      const result = await lookupVehicle(type, identifier, state, data);
      
      if (result) {
        console.log(`PREMIUM ${type.toUpperCase()}: Lookup successful:`, result);
        toast.success(`Found: ${result.year} ${result.make} ${result.model}`);
      } else {
        console.warn(`PREMIUM ${type.toUpperCase()}: No result returned from lookup`);
      }
    } catch (error) {
      console.error(`PREMIUM ${type.toUpperCase()}: Lookup error:`, error);
    }
  };

  const handleManualSubmit = (data: ManualEntryFormData) => {
    console.log('PREMIUM MANUAL: Submitting manual entry form with data:', data);
    lookupVehicle('manual', 'manual-entry', undefined, data);
  };

  const handleProceedToValuation = () => {
    if (!vehicle && !existingValuation) {
      console.warn('PREMIUM PAGE: Cannot proceed to valuation - no vehicle data');
      toast.error('No vehicle information available. Please look up a vehicle first.');
      return;
    }
    
    const vehicleToUse = vehicle || existingValuation;
    console.log('PREMIUM PAGE: Proceeding to valuation with vehicle:', vehicleToUse);
    
    // Save vehicle details to localStorage for the premium valuation process
    localStorage.setItem("premium_vehicle", JSON.stringify({
      identifierType: existingValuationId ? 'existing' : 'vin',
      identifier: existingValuationId || vehicleToUse.vin || '',
      vin: vehicleToUse.vin || '',
      make: vehicleToUse.make,
      model: vehicleToUse.model,
      year: vehicleToUse.year,
      trim: vehicleToUse.trim || "Standard",
      bodyType: vehicleToUse.bodyType,
      transmission: vehicleToUse.transmission,
      drivetrain: vehicleToUse.drivetrain,
      mileage: vehicleToUse.mileage,
      condition: vehicleToUse.condition,
      zipCode: vehicleToUse.zipCode
    }));
    
    toast.success("Vehicle information saved. Continuing to premium valuation.");
    console.log('PREMIUM PAGE: Navigating to /premium-valuation');
    navigate("/premium-valuation");
  };

  const handleCompletePurchase = () => {
    if (!existingValuationId) {
      toast.error("No valuation to upgrade");
      return;
    }
    
    // In a real app, navigate to a payment page
    toast.success("Navigating to payment page...");
    
    // Mock: Update the existing valuation to premium
    if (existingValuation) {
      const updatedValuation = {
        ...existingValuation,
        premium_unlocked: true
      };
      
      // Store the updated valuation
      localStorage.setItem(`valuation_${existingValuationId}`, JSON.stringify(updatedValuation));
      
      // Redirect to the results page
      navigate(`/results?valuationId=${existingValuationId}`);
    }
  };

  // Force bypass loading state if it's taking too long
  if (!pageLoaded) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <LoadingState text="Loading premium features..." size="lg" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1">
        {existingValuationId ? (
          // Upgrade path for existing valuation
          <div className="container max-w-3xl py-12 px-4">
            <h1 className="text-3xl font-bold mb-6">Upgrade to Premium Valuation</h1>
            
            {loadingExisting ? (
              <Card>
                <CardContent className="p-6 flex justify-center items-center">
                  <Loader2 className="animate-spin h-6 w-6 mr-2" />
                  <span>Loading your valuation...</span>
                </CardContent>
              </Card>
            ) : existingValuation ? (
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Your Vehicle</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Make & Model</p>
                        <p className="font-medium">{existingValuation.year} {existingValuation.make} {existingValuation.model}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Current Valuation</p>
                        <p className="font-medium">${existingValuation.estimated_value.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Premium Benefits</h2>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Detailed Market Analysis</p>
                          <p className="text-sm text-muted-foreground">Compare your vehicle to similar listings in your area</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Professional PDF Report</p>
                          <p className="text-sm text-muted-foreground">Download a comprehensive report to share with dealers or private buyers</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Advanced AI Analysis</p>
                          <p className="text-sm text-muted-foreground">Get a more accurate valuation with our premium AI algorithms</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-primary/5 border border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">Premium Upgrade</h3>
                        <p className="text-muted-foreground">One-time payment</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">$9.99</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start mt-4 mb-6">
                      <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-700">
                        Your premium report is personalized for your specific vehicle and includes all premium features.
                      </p>
                    </div>
                    
                    <Button className="w-full" size="lg" onClick={handleCompletePurchase}>
                      Complete Purchase
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground mb-4">No valuation found.</p>
                  <Button asChild>
                    <Link to="/valuation">Create a New Valuation</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          // Normal premium valuation flow
          <>
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
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
