
import React, { useState } from 'react';
import { VINLookupForm } from './vin/VINLookupForm';
import { validateVIN } from '@/utils/validation/vin-validation';
import { useNavigate } from 'react-router-dom';
import { fetchVehicleByVin } from '@/services/vehicleLookupService';
import { toast } from 'sonner';

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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVinChange = (newVin: string) => {
    setVin(newVin);
    if (error) {
      // Clear error when user starts typing again
      setError(null);
    }
  };

  const handleSubmit = async (vinToSubmit: string) => {
    // Using validateVIN which returns {isValid, error}
    const validation = validateVIN(vinToSubmit);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid VIN format. Please check and try again.');
      return;
    }
    
    setLoading(true);
    
    try {
      // Call the VIN lookup service
      const result = await fetchVehicleByVin(vinToSubmit);
      
      // Store VIN in localStorage for follow-up steps
      localStorage.setItem('current_vin', vinToSubmit);
      
      // Call the parent's onSubmit handler
      onSubmit(vinToSubmit);
      
      // If there's a results handler, call it with the result
      if (onResultsReady) {
        onResultsReady(result);
      }
      
      // Navigate to the follow-up questions page
      navigate(`/valuation-followup?vin=${vinToSubmit}`);
    } catch (error) {
      console.error('VIN lookup error:', error);
      setError(error.message || 'Failed to lookup VIN. Please try again.');
      toast.error(error.message || 'Failed to lookup VIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <VINLookupForm
      onSubmit={handleSubmit}
      isLoading={isLoading || loading}
      value={vin}
      onChange={handleVinChange}
      error={error}
      submitButtonText="Lookup VIN"
    />
  );
};

export default VinLookup;
