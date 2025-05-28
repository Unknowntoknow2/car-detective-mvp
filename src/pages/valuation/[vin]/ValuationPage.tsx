import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { VehicleLookupForm } from '@/components/valuation/VehicleLookupForm';
import { EnhancedFollowUpForm } from '@/components/valuation/enhanced-followup/EnhancedFollowUpForm';
import { EnhancedVehicleCard } from '@/components/valuation/enhanced-followup/EnhancedVehicleCard';
import { toast } from 'sonner';
import { DecodedVehicleInfo } from '@/types/vehicle';

export default function ValuationPage() {
  const { vin } = useParams<{ vin: string }>();
  const navigate = useNavigate();
  const [vehicleInfo, setVehicleInfo] = useState<DecodedVehicleInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'lookup' | 'followup' | 'results'>('lookup');

  useEffect(() => {
    // If VIN is provided in URL, validate it and attempt decode
    if (vin) {
      console.log(`🔍 ValuationPage loaded with VIN: ${vin}`);
      
      // Basic VIN validation
      if (vin.length !== 17) {
        toast.error('Invalid VIN format. VIN must be 17 characters.');
        navigate('/valuation');
        return;
      }
      
      // The VehicleLookupForm will handle the actual decode attempt
      setIsLoading(true);
    }
  }, [vin, navigate]);

  const handleVehicleFound = (vehicle: DecodedVehicleInfo) => {
    console.log('✅ Vehicle found:', vehicle);
    
    // Validate that this is real vehicle data, not demo data
    if (!vehicle.vin || !vehicle.make || !vehicle.model || !vehicle.year) {
      console.error('❌ Invalid vehicle data received:', vehicle);
      toast.error('Invalid vehicle data. Please try again or use manual entry.');
      return;
    }
    
    // If we have a VIN in the URL, ensure it matches
    if (vin && vehicle.vin !== vin) {
      console.error(`❌ VIN mismatch: URL has ${vin}, decoded has ${vehicle.vin}`);
      toast.error('VIN mismatch detected. Please try again.');
      return;
    }
    
    setVehicleInfo(vehicle);
    setIsLoading(false);
    setCurrentStep('followup');
    
    // Show success message with vehicle details
    toast.success(`Vehicle identified: ${vehicle.year} ${vehicle.make} ${vehicle.model}`);
  };

  const handleVehicleError = (error: string) => {
    console.error('❌ Vehicle lookup error:', error);
    setIsLoading(false);
    toast.error(error);
  };

  const handleFollowUpComplete = () => {
    setCurrentStep('results');
    toast.success('Assessment completed! Generating valuation...');
    // TODO: Navigate to results or trigger valuation calculation
  };

  return (
    <Container className="max-w-6xl py-10">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Vehicle Valuation</h1>
          <p className="text-muted-foreground">
            Get an accurate, professional vehicle valuation in minutes
          </p>
          {vin && (
            <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full">
              <span className="text-sm font-mono">VIN: {vin}</span>
            </div>
          )}
        </div>

        {currentStep === 'lookup' && (
          <VehicleLookupForm 
            onVehicleFound={handleVehicleFound}
            showHeader={!vin}
          />
        )}

        {currentStep === 'followup' && vehicleInfo && (
          <div className="space-y-6">
            {/* Enhanced Vehicle Information Display */}
            <EnhancedVehicleCard vehicle={vehicleInfo} />

            {/* Enhanced Follow-up Form - keeping it exactly as it is */}
            <EnhancedFollowUpForm
              vin={vehicleInfo.vin || vin || ''}
              onComplete={handleFollowUpComplete}
            />
          </div>
        )}

        {currentStep === 'results' && (
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
    </Container>
  );
}
