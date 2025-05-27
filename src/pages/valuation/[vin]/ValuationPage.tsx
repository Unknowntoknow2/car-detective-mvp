
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { EnhancedFollowUpForm } from '@/components/valuation/enhanced-followup/EnhancedFollowUpForm';
import { EnhancedVehicleCard } from '@/components/valuation/enhanced-followup/EnhancedVehicleCard';
import { ValuationResult } from '@/components/valuation/ValuationResult';
import { CarFinderQaherHeader } from '@/components/common/CarFinderQaherHeader';
import { fetchVehicleByVin } from '@/services/vehicleLookupService';
import { useValuationResult } from '@/hooks/useValuationResult';
import { toast } from 'sonner';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { Loader2 } from 'lucide-react';

export default function ValuationPage() {
  const { vin } = useParams<{ vin: string }>();
  const navigate = useNavigate();
  const [vehicleInfo, setVehicleInfo] = useState<DecodedVehicleInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<'lookup' | 'followup' | 'results'>('lookup');
  const [error, setError] = useState<string | null>(null);

  // Get valuation result data
  const { data: valuationData } = useValuationResult(vin || '');

  useEffect(() => {
    const loadVehicleData = async () => {
      if (!vin) {
        setError('Invalid VIN provided');
        setIsLoading(false);
        return;
      }

      // Basic VIN validation
      if (vin.length !== 17) {
        setError('Invalid VIN format. VIN must be 17 characters.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log(`🔍 Loading vehicle data for VIN: ${vin}`);
        const vehicle = await fetchVehicleByVin(vin);
        
        if (!vehicle.make || !vehicle.model || !vehicle.year) {
          throw new Error('Incomplete vehicle data received');
        }
        
        setVehicleInfo(vehicle);
        setCurrentStep('followup');
        console.log('✅ Vehicle data loaded:', vehicle);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load vehicle data';
        console.error('❌ Vehicle lookup error:', errorMessage);
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadVehicleData();
  }, [vin]);

  const handleFollowUpComplete = () => {
    setCurrentStep('results');
    toast.success('Assessment completed! Displaying valuation results...');
  };

  if (isLoading) {
    return (
      <Container className="max-w-6xl py-10">
        <CarFinderQaherHeader />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading vehicle information...</p>
            <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full">
              <span className="text-sm font-mono">VIN: {vin}</span>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (error || !vehicleInfo) {
    return (
      <Container className="max-w-6xl py-10">
        <CarFinderQaherHeader />
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-600">Vehicle Lookup Failed</h1>
          <p className="text-muted-foreground">{error || 'Vehicle information not found'}</p>
          <div className="inline-flex items-center px-3 py-1 bg-red-50 text-red-600 rounded-full">
            <span className="text-sm font-mono">VIN: {vin}</span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90"
          >
            Try Another VIN Lookup
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="max-w-6xl py-10">
      <div className="space-y-8">
        <CarFinderQaherHeader />

        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Vehicle Valuation Assessment</h1>
            <p className="text-muted-foreground">
              Complete your vehicle assessment for an accurate market valuation
            </p>
            <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full">
              <span className="text-sm font-mono">VIN: {vin}</span>
            </div>
          </div>

          {/* Enhanced Vehicle Information Display */}
          <EnhancedVehicleCard vehicle={vehicleInfo} />

          {currentStep === 'followup' && (
            <EnhancedFollowUpForm
              vin={vehicleInfo.vin || vin || ''}
              onComplete={handleFollowUpComplete}
            />
          )}

          {currentStep === 'results' && valuationData && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <h2 className="text-xl font-semibold text-green-800 mb-2">
                  Valuation Complete!
                </h2>
                <p className="text-green-700">
                  Your comprehensive vehicle assessment has been processed using real market data.
                </p>
              </div>
              
              <ValuationResult 
                valuationId={valuationData.id}
                data={{
                  ...valuationData,
                  make: vehicleInfo.make || '',
                  model: vehicleInfo.model || '',
                  year: vehicleInfo.year || new Date().getFullYear(),
                  mileage: valuationData.mileage || 0,
                  condition: valuationData.condition || 'Good',
                  estimatedValue: valuationData.estimatedValue || 0,
                  confidenceScore: valuationData.confidenceScore || 75
                }}
                isPremium={false}
              />
            </div>
          )}

          {currentStep === 'results' && !valuationData && (
            <div className="text-center space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-blue-800 mb-2">
                  Generating Your Valuation
                </h2>
                <p className="text-blue-700">
                  Processing your vehicle assessment data to provide the most accurate valuation...
                </p>
                <div className="mt-4">
                  <div className="animate-pulse flex space-x-1 justify-center">
                    <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                    <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                    <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
