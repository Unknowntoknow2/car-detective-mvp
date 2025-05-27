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
    
    // Show success message with vehicle details
    toast.success(`Vehicle identified: ${vehicle.year} ${vehicle.make} ${vehicle.model}`);
  };

  const handleVehicleError = (error: string) => {
    console.error('❌ Vehicle lookup error:', error);
    setIsLoading(false);
    toast.error(error);
  };

  return (
    <Container className="max-w-4xl py-10">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Vehicle Valuation</h1>
          <p className="text-muted-foreground">
            Enter your VIN to get an accurate vehicle valuation
          </p>
          {vin && (
            <p className="text-sm text-blue-600 font-mono">
              VIN: {vin}
            </p>
          )}
        </div>

        {!vehicleInfo ? (
          <VehicleLookupForm 
            onVehicleFound={handleVehicleFound}
            showHeader={!vin}
          />
        ) : (
          <div className="space-y-6">
            {/* Vehicle Information Display */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-800 mb-4">
                Vehicle Identified
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-green-700">Year:</span>
                  <span className="ml-2">{vehicleInfo.year}</span>
                </div>
                <div>
                  <span className="font-medium text-green-700">Make:</span>
                  <span className="ml-2">{vehicleInfo.make}</span>
                </div>
                <div>
                  <span className="font-medium text-green-700">Model:</span>
                  <span className="ml-2">{vehicleInfo.model}</span>
                </div>
                {vehicleInfo.trim && (
                  <div>
                    <span className="font-medium text-green-700">Trim:</span>
                    <span className="ml-2">{vehicleInfo.trim}</span>
                  </div>
                )}
                <div className="md:col-span-2">
                  <span className="font-medium text-green-700">VIN:</span>
                  <span className="ml-2 font-mono">{vehicleInfo.vin}</span>
                </div>
              </div>
            </div>

            {/* Continue to valuation form or next steps */}
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Vehicle successfully identified. Continue with valuation details.
              </p>
              {/* Future: Add valuation form component here */}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
