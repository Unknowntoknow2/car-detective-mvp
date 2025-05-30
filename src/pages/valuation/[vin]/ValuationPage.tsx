
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { CarFinderQaherHeader } from '@/components/common/CarFinderQaherHeader';
import { CarFinderQaherCard } from '@/components/valuation/CarFinderQaherCard';
import { UnifiedFollowUpQuestions } from '@/components/lookup/form-parts/UnifiedFollowUpQuestions';
import { decodeVin } from '@/services/vinService';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';
import { SHOW_ALL_COMPONENTS } from '@/lib/constants';
import { toast } from 'sonner';
import { PremiumBadge } from '@/components/premium/insights/PremiumBadge';

export default function ValuationPage() {
  const { vin: vinParam } = useParams<{ vin: string }>();
  const [searchParams] = useSearchParams();
  const [vehicle, setVehicle] = useState<DecodedVehicleInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ManualEntryFormData>({
    vin: vinParam || '',
    make: '',
    model: '',
    year: '',
    mileage: '',
    condition: 'good' as any,
    zipCode: '',
    trim: '',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    color: '',
    titleStatus: 'clean',
    previousOwners: 1,
    previousUse: 'personal',
    serviceHistory: 'unknown',
    hasRegularMaintenance: null,
    maintenanceNotes: '',
    accidentDetails: {
      hasAccident: false,
      severity: 'minor',
      repaired: false,
      description: ''
    },
    tireCondition: 'good',
    dashboardLights: [],
    hasModifications: false,
    modificationTypes: []
  });

  // Check if this is a premium valuation
  const isPremium = searchParams.get('premium') === 'true';

  // Handle potentially undefined VIN parameter with proper type handling
  const safeVin: string = vinParam ?? '';

  useEffect(() => {
    if (safeVin && safeVin.length === 17) {
      console.log('🔍 ValuationPage: Loading vehicle data for VIN:', safeVin, 'Premium:', isPremium);
      loadVehicleData(safeVin);
    } else if (vinParam) {
      // VIN is present but invalid length
      toast.error('Invalid VIN format. VIN must be 17 characters long.');
    }
  }, [safeVin, vinParam, isPremium]);

  const loadVehicleData = async (vinCode: string) => {
    setIsLoading(true);
    try {
      const result = await decodeVin(vinCode);
      
      if (result.success && result.data) {
        console.log('✅ ValuationPage: Vehicle data loaded:', result.data);
        setVehicle(result.data);
        
        // Update form data with vehicle info
        setFormData(prev => ({
          ...prev,
          vin: vinCode,
          make: result.data?.make || '',
          model: result.data?.model || '',
          year: result.data?.year?.toString() || '',
          trim: result.data?.trim || ''
        }));
        
        toast.success('Vehicle details loaded successfully!');
      } else {
        console.error('❌ ValuationPage: Failed to load vehicle data:', result.error);
        toast.error('Failed to load vehicle details');
      }
    } catch (error) {
      console.error('❌ ValuationPage: Error loading vehicle data:', error);
      toast.error('Error loading vehicle details');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (updates: Partial<ManualEntryFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleFollowUpSubmit = async (): Promise<void> => {
    console.log('✅ ValuationPage: Follow-up submitted:', formData, 'Premium:', isPremium);
    toast.success('Valuation completed successfully!');
    // Handle final valuation here
  };

  // If no VIN parameter at all, show error message
  if (!vinParam) {
    return (
      <Container className="max-w-6xl py-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Vehicle Valuation
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Please enter a VIN to get started with your valuation.
          </p>
        </div>
      </Container>
    );
  }

  // If VIN is present but invalid length
  if (safeVin.length !== 17) {
    return (
      <Container className="max-w-6xl py-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Invalid VIN
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            The provided VIN "{safeVin}" is not valid. VINs must be exactly 17 characters long.
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="max-w-6xl py-10">
      <div className="relative">
        {isPremium && <PremiumBadge />}
        
        <CarFinderQaherHeader />
        
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading vehicle details...</p>
          </div>
        )}
        
        {vehicle && (
          <div className="space-y-8">
            {/* Enhanced Car Finder Qaher Card */}
            <CarFinderQaherCard vehicle={vehicle} />
            
            {/* Follow-up Questions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Vehicle Details</h2>
                <p className="text-gray-600 mt-2">
                  Please provide additional information about your vehicle to get the most accurate valuation.
                </p>
              </div>
              
              <UnifiedFollowUpQuestions
                formData={formData}
                updateFormData={updateFormData}
              />
              
              <div className="mt-8 pt-6 border-t">
                <button
                  onClick={handleFollowUpSubmit}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Get My Vehicle Valuation
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Debug info only visible in development mode */}
        {SHOW_ALL_COMPONENTS && (
          <div className="fixed bottom-4 right-4 bg-yellow-100 text-black p-3 rounded-lg text-xs z-50 opacity-80">
            <div className="space-y-1">
              <div>Debug Mode: ON</div>
              <div>Component: ValuationPage</div>
              <div>VIN: {safeVin || 'None'}</div>
              <div>Premium: {isPremium ? 'Yes' : 'No'}</div>
              <div>Vehicle Loaded: {vehicle ? 'Yes' : 'No'}</div>
              <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
