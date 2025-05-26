
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
      setError(null);
    }
  };

  const handleSubmit = async (vinToSubmit: string) => {
    console.log('VIN Lookup: Form submitted with VIN:', vinToSubmit);
    
    const validation = validateVIN(vinToSubmit);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid VIN format. Please check and try again.');
      toast.error('Invalid VIN format');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Starting VIN lookup for:', vinToSubmit);
      
      // Call the VIN lookup service
      const result = await fetchVehicleByVin(vinToSubmit);
      
      console.log('VIN lookup successful:', result);
      
      // Store VIN in localStorage for follow-up steps
      localStorage.setItem('current_vin', vinToSubmit);
      localStorage.setItem('latest_valuation_id', result.valuationId || '');
      
      // Call the parent's onSubmit handler
      onSubmit(vinToSubmit);
      
      // If there's a results handler, call it with the result
      if (onResultsReady) {
        onResultsReady(result);
      }
      
      // Navigate to the VIN-specific valuation page using the correct route
      navigate(`/valuation/vin/${vinToSubmit}`);
      
      toast.success('VIN lookup completed successfully');
    } catch (error: any) {
      console.error('VIN lookup error:', error);
      const errorMessage = error.message || 'Failed to lookup VIN. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      
      // If we have a partial result or stored valuation ID, still try to navigate
      const storedId = localStorage.getItem('latest_valuation_id');
      if (storedId && storedId !== '') {
        console.log('Attempting navigation with stored valuation ID:', storedId);
        navigate(`/valuation/vin/${vinToSubmit}`);
      }
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
