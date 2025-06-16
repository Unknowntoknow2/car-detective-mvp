
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VINLookupForm } from '../vin-core/VINLookupForm';

interface EnhancedVinLookupProps {
  onVehicleFound?: (data: any) => void;
  onSubmit?: () => void;
  isLoading?: boolean;
}

export const EnhancedVinLookup: React.FC<EnhancedVinLookupProps> = ({ 
  onVehicleFound,
  onSubmit,
  isLoading: externalLoading = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (vin: string) => {
    if (onSubmit) {
      onSubmit();
      return;
    }

    setIsLoading(true);
    
    try {
      // Mock lookup - replace with actual service
      const mockData = {
        vin,
        make: 'Toyota',
        model: 'Camry',
        year: 2020
      };

      if (onVehicleFound) {
        onVehicleFound(mockData);
      } else {
        navigate(`/valuation/${vin}`);
      }
    } catch (error) {
      console.error('VIN lookup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <VINLookupForm onSubmit={handleSubmit} isLoading={isLoading || externalLoading} />
    </div>
  );
};

export default EnhancedVinLookup;
