
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { CarFinderQaherHeader } from '@/components/common/CarFinderQaherHeader';
import { FoundCarCard } from '@/components/lookup/found/FoundCarCard';
import { UnifiedFollowUpForm } from '@/components/followup/UnifiedFollowUpForm';
import { decodeVin } from '@/services/vinService';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { SHOW_ALL_COMPONENTS } from '@/lib/constants';
import { toast } from 'sonner';

export default function ValuationPage() {
  const { vin: vinParam } = useParams<{ vin: string }>();
  const [vehicle, setVehicle] = useState<DecodedVehicleInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);

  // Ensure VIN is defined before proceeding
  const vin = vinParam || '';

  useEffect(() => {
    if (vin && vin.length === 17) {
      console.log('🔍 ValuationPage: Loading vehicle data for VIN:', vin);
      loadVehicleData(vin);
    }
  }, [vin]);

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

  const handleFollowUpComplete = (formData: FollowUpAnswers) => {
    console.log('✅ ValuationPage: Follow-up completed:', formData);
    toast.success('Valuation completed successfully!');
    // Handle final valuation here
  };

  if (!vin) {
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

  return (
    <Container className="max-w-6xl py-10">
      <CarFinderQaherHeader />
      
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vehicle details...</p>
        </div>
      )}
      
      {vehicle && (
        <div className="space-y-8">
          <FoundCarCard vehicle={vehicle} readonly={false} />
          
          {showFollowUp && (
            <div className="mt-8">
              <UnifiedFollowUpForm 
                vin={vin}
                onComplete={handleFollowUpComplete}
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
            <div>VIN: {vin || 'None'}</div>
            <div>Vehicle Loaded: {vehicle ? 'Yes' : 'No'}</div>
            <div>Show Follow-up: {showFollowUp ? 'Yes' : 'No'}</div>
          </div>
        </div>
      )}
    </Container>
  );
}
