
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { CarFinderQaherHeader } from '@/components/common/CarFinderQaherHeader';
import { CarFinderQaherCard } from '@/components/valuation/CarFinderQaherCard';
import { UnifiedFollowUpForm } from '@/components/followup/UnifiedFollowUpForm';
import { decodeVin } from '@/services/vinService';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { SHOW_ALL_COMPONENTS } from '@/lib/constants';
import { toast } from 'sonner';
import { PremiumBadge } from '@/components/premium/insights/PremiumBadge';

export default function ValuationPage() {
  const { vin: vinParam } = useParams<{ vin: string }>();
  const [searchParams] = useSearchParams();
  const [vehicle, setVehicle] = useState<DecodedVehicleInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);

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
        setShowFollowUp(true);
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

  const handleFollowUpSubmit = (formData: FollowUpAnswers) => {
    console.log('✅ ValuationPage: Follow-up submitted:', formData, 'Premium:', isPremium);
    toast.success('Valuation completed successfully!');
    // Handle final valuation here
  };

  const handleFollowUpSave = (formData: FollowUpAnswers) => {
    console.log('📝 ValuationPage: Follow-up saved:', formData);
    // Handle saving progress here
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
            
            {showFollowUp && safeVin.length === 17 && (
              <div className="mt-8">
                <UnifiedFollowUpForm 
                  vin={safeVin}
                  initialData={{ vin: safeVin }}
                  onSubmit={handleFollowUpSubmit}
                  onSave={handleFollowUpSave}
                />
              </div>
            )}
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
              <div>Show Follow-up: {showFollowUp ? 'Yes' : 'No'}</div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
