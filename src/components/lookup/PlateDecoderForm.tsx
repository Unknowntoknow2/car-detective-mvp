
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usePlateLookup } from '@/hooks/usePlateLookup';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { CarDetectiveValidator } from '@/utils/validation/CarDetectiveValidator';
import { validateStatePlate } from '@/utils/validation/plate-validation-helpers';

interface PlateDecoderFormProps {
  onManualEntryClick?: () => void;
  onSubmit?: (plate: string, state: string) => void;
}

export default function PlateDecoderForm({ onManualEntryClick, onSubmit }: PlateDecoderFormProps) {
  const [plate, setPlate] = useState('');
  const [state, setState] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ plate?: string, state?: string }>({});
  const [touched, setTouched] = useState<{ plate: boolean, state: boolean }>({ plate: false, state: false });
  const { lookupVehicle, isLoading, error } = usePlateLookup();
  const navigate = useNavigate();

  const validatePlate = () => {
    const errors: { plate?: string, state?: string } = {};
    
    if (!plate) {
      errors.plate = 'License plate is required';
    }
    
    if (!state) {
      errors.state = 'State is required';
    } else if (state.length !== 2) {
      errors.state = 'State must be a 2-letter code';
    }
    
    if (plate && state && state.length === 2) {
      const result = validateStatePlate(plate, state);
      if (!result.valid) {
        errors.plate = result.error;
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePlate()) {
      return;
    }

    // If onSubmit prop is provided, use it
    if (onSubmit) {
      onSubmit(plate, state);
      return;
    }

    try {
      // Lookup license plate
      const result = await lookupVehicle(plate, state);
      
      if (!result) {
        toast.error('Unable to find vehicle by plate');
        return;
      }
      
      // Create a valuation entry
      const { data: valuationData, error: insertError } = await supabase
        .from('valuations')
        .insert({
          plate,
          state,
          make: result.make,
          model: result.model,
          year: result.year,
          mileage: result.mileage || 50000, // Default mileage
          user_id: '00000000-0000-0000-0000-000000000000', // Anonymous user
          is_vin_lookup: false,
          condition_score: 70,
          estimated_value: result.estimatedValue || 24500,
          confidence_score: 80
        })
        .select()
        .single();
      
      if (insertError) {
        console.error('Error saving valuation:', insertError);
        toast.error('Failed to save valuation data');
        return;
      }
      
      // Save the valuation ID to localStorage
      localStorage.setItem('latest_valuation_id', valuationData.id);
      
      // Navigate to the results page
      navigate(`/result?valuationId=${valuationData.id}`);
      
    } catch (err) {
      console.error('Error in plate lookup:', err);
      toast.error('Failed to process plate information');
    }
  };

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setPlate(value);
    setTouched({ ...touched, plate: true });
    if (touched.plate) validatePlate();
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setState(value);
    setTouched({ ...touched, state: true });
    if (touched.state) validatePlate();
  };

  const handlePlateBlur = () => {
    setTouched({ ...touched, plate: true });
    validatePlate();
  };

  const handleStateBlur = () => {
    setTouched({ ...touched, state: true });
    validatePlate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-1">
          <label htmlFor="plate" className="text-sm font-medium block">
            License Plate
          </label>
          <Input
            id="plate"
            value={plate}
            onChange={(e) => {
              setPlate(e.target.value.toUpperCase());
              setTouched({ ...touched, plate: true });
              if (touched.plate) validatePlate();
            }}
            onBlur={() => {
              setTouched({ ...touched, plate: true });
              validatePlate();
            }}
            placeholder="License Plate"
            className={`w-full ${validationErrors.plate && touched.plate ? 'border-red-500' : ''}`}
          />
          {validationErrors.plate && touched.plate && (
            <div className="flex items-center gap-1.5 text-sm text-red-500">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{validationErrors.plate}</span>
            </div>
          )}
        </div>
        <div className="space-y-1">
          <label htmlFor="state" className="text-sm font-medium block">
            State
          </label>
          <Input
            id="state"
            value={state}
            onChange={(e) => {
              setState(e.target.value.toUpperCase());
              setTouched({ ...touched, state: true });
              if (touched.state) validatePlate();
            }}
            onBlur={() => {
              setTouched({ ...touched, state: true });
              validatePlate();
            }}
            placeholder="State (e.g., CA)"
            maxLength={2}
            className={`w-full ${validationErrors.state && touched.state ? 'border-red-500' : ''}`}
          />
          {validationErrors.state && touched.state && (
            <div className="flex items-center gap-1.5 text-sm text-red-500">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{validationErrors.state}</span>
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-2">
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || !plate || !state}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Looking up...
            </>
          ) : (
            'Lookup Plate'
          )}
        </Button>
        
        {onManualEntryClick && (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onManualEntryClick}
          >
            Manual Entry
          </Button>
        )}
      </div>
    </form>
  );
}
