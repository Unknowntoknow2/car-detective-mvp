
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { EnhancedFollowUpForm } from '@/components/valuation/enhanced-followup/EnhancedFollowUpForm';
import { EnhancedVehicleCard } from '@/components/valuation/enhanced-followup/EnhancedVehicleCard';
import { lookupPlate } from '@/services/plateService';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export function PlateFollowupFlow() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [vehicleInfo, setVehicleInfo] = useState<DecodedVehicleInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const plate = searchParams.get('plate');
  const state = searchParams.get('state');

  useEffect(() => {
    const loadVehicleData = async () => {
      if (!plate || !state) {
        setError('Missing plate or state information');
        setIsLoading(false);
        return;
      }

      try {
        console.log('🔍 Loading vehicle data for plate followup:', plate, state);
        const result = await lookupPlate(plate, state);
        setVehicleInfo(result);
        console.log('✅ Vehicle data loaded for followup:', result);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load vehicle data';
        console.error('❌ Failed to load vehicle data:', errorMessage);
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadVehicleData();
  }, [plate, state]);

  const handleFollowUpComplete = () => {
    toast.success('Assessment completed! Generating valuation...');
    // Navigate to results or trigger valuation calculation
    navigate('/valuation-results');
  };

  if (isLoading) {
    return (
      <Container className="max-w-6xl py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading vehicle information...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error || !vehicleInfo) {
    return (
      <Container className="max-w-6xl py-10">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-600">Error Loading Vehicle Data</h1>
          <p className="text-muted-foreground">{error || 'Vehicle information not found'}</p>
          <button
            onClick={() => navigate('/plate-lookup')}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90"
          >
            Try Another Plate Lookup
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="max-w-6xl py-10">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Vehicle Assessment</h1>
          <p className="text-muted-foreground">
            Complete your vehicle assessment for an accurate valuation
          </p>
          <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full">
            <span className="text-sm">Plate: {plate} ({state})</span>
          </div>
        </div>

        <EnhancedVehicleCard vehicle={vehicleInfo} />

        <EnhancedFollowUpForm
          vin={vehicleInfo.vin || ''}
          onComplete={handleFollowUpComplete}
        />
      </div>
    </Container>
  );
}

export default PlateFollowupFlow;
