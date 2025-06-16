
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UnifiedPlateLookup } from './plate/UnifiedPlateLookup';

export interface PlateLookupProps {
  tier?: 'free' | 'premium';
  onVehicleFound?: (vehicle: any) => void;
}

export const PlateLookup: React.FC<PlateLookupProps> = ({ 
  tier = 'free',
  onVehicleFound
}) => {
  const navigate = useNavigate();

  const handleVehicleFound = (vehicle: any) => {
    console.log("Vehicle found from plate lookup:", vehicle);
    
    // Call the parent callback if provided
    if (onVehicleFound) {
      onVehicleFound(vehicle);
    } else {
      // Default navigation behavior
      if (vehicle.vin) {
        navigate(`/valuation/${vehicle.vin}`);
      }
    }
  };

  return (
    <UnifiedPlateLookup onVehicleFound={handleVehicleFound} />
  );
};

export default PlateLookup;
