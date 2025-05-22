
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { VINLookupForm } from './vin/VINLookupForm';
import { useNavigate } from 'react-router-dom';
import { validateVIN } from '@/utils/validation/vin-validation';
import { toast } from 'sonner';

const VinDecoderForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (vin: string) => {
    // First validate VIN
    const validation = validateVIN(vin);
    if (!validation.isValid) {
      toast.error(validation.error || 'Invalid VIN');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, we would call an API here
      // For now, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store VIN in localStorage for follow-up steps
      localStorage.setItem('current_vin', vin);
      
      // Navigate to valuation follow-up page
      navigate(`/valuation-followup?vin=${vin}`);
    } catch (error) {
      console.error('Error decoding VIN:', error);
      toast.error('Failed to decode VIN. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <VINLookupForm 
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitButtonText="Decode VIN"
        />
      </CardContent>
    </Card>
  );
};

export default VinDecoderForm;
