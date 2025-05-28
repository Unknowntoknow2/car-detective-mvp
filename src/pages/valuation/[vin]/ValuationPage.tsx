
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { VehicleLookupForm } from '@/components/valuation/VehicleLookupForm';
import { toast } from 'sonner';
import { DecodedVehicleInfo } from '@/types/vehicle';

export default function ValuationPage() {
  const { vin } = useParams<{ vin: string }>();
  const navigate = useNavigate();
  const [vehicleInfo, setVehicleInfo] = useState<DecodedVehicleInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'lookup' | 'results'>('lookup');

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
      
      setIsLoading(true);
    }
  }, [vin, navigate]);

  const handleVehicleFound = (vehicle: DecodedVehicleInfo) => {
    console.log('✅ Vehicle found:', vehicle);
    
    // Validate that this is real vehicle data
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
    setCurrentStep('results');
    
    // Show success message with vehicle details
    toast.success(`Vehicle identified: ${vehicle.year} ${vehicle.make} ${vehicle.model}`);
  };

  const handleVehicleError = (error: string) => {
    console.error('❌ Vehicle lookup error:', error);
    setIsLoading(false);
    toast.error(error);
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

        {currentStep === 'results' && vehicleInfo && (
          <div className="space-y-6">
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Vehicle Information</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <span className="font-medium">Make:</span> {vehicleInfo.make}
                </div>
                <div>
                  <span className="font-medium">Model:</span> {vehicleInfo.model}
                </div>
                <div>
                  <span className="font-medium">Year:</span> {vehicleInfo.year}
                </div>
                <div>
                  <span className="font-medium">VIN:</span> {vehicleInfo.vin}
                </div>
                <div>
                  <span className="font-medium">Estimated Value:</span> ${vehicleInfo.estimatedValue?.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
