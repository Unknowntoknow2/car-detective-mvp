
import React, { useState } from 'react';
import { VINLookupForm } from './vin/VINLookupForm';
import { validateVIN } from '@/utils/validation/vin-validation';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const handleVinChange = (newVin: string) => {
    setVin(newVin);
    if (error) {
      // Clear error when user starts typing again
      setError(null);
    }
  };

  const handleSubmit = (vinToSubmit: string) => {
    // Using validateVIN which returns {isValid, error}
    const validation = validateVIN(vinToSubmit);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid VIN format. Please check and try again.');
      return;
    }
    
    // Store VIN in localStorage for follow-up steps
    localStorage.setItem('current_vin', vinToSubmit);
    
    // Call the submit handler first
    onSubmit(vinToSubmit);
    
    // Then navigate to the follow-up questions page
    navigate(`/valuation-followup?vin=${vinToSubmit}`);
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
