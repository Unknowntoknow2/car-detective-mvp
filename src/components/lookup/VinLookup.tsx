
import React, { useState } from 'react';
import { VINLookupForm } from './vin/VINLookupForm';
import { isValidVIN } from '@/utils/validation/vin-validation';

interface VinLookupProps {
  onSubmit: (vin: string) => void;
  isLoading?: boolean;
  onResultsReady?: (result: any) => void;
}

const VinLookup: React.FC<VinLookupProps> = ({ 
  onSubmit, 
  isLoading = false,
  onResultsReady
}) => {
  const [vin, setVin] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleVinChange = (newVin: string) => {
    setVin(newVin);
    if (error) {
      // Clear error when user starts typing again
      setError(null);
    }
  };

  const handleSubmit = (vinToSubmit: string) => {
    // isValidVIN returns a boolean, not an object with isValid and message
    if (!isValidVIN(vinToSubmit)) {
      setError('Invalid VIN format. Please check and try again.');
      return;
    }
    
    onSubmit(vinToSubmit);
  };

  return (
    <VINLookupForm
      onSubmit={handleSubmit}
      isLoading={isLoading}
      value={vin}
      onChange={handleVinChange}
      error={error}
      submitButtonText="Lookup VIN"
    />
  );
};

export default VinLookup;
