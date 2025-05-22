
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { states } from '@/data/states';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useValuation } from '@/hooks/useValuation';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PlateDecoderFormProps {
  onSubmit?: (plate: string, state: string) => void;
  onManualEntryClick?: () => void;
}

const PlateDecoderForm: React.FC<PlateDecoderFormProps> = ({
  onSubmit,
  onManualEntryClick
}) => {
  const [plate, setPlate] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { decodePlate } = useValuation();
  const navigate = useNavigate();
  
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const errors: Record<string, string> = {};
    
    if (!plate.trim()) {
      errors.plate = 'License plate is required';
    }
    
    if (!state) {
      errors.state = 'State is required';
    }
    
    if (!zipCode.trim() || !/^\d{5}$/.test(zipCode)) {
      errors.zipCode = 'Valid 5-digit ZIP code is required';
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    // Clear validation errors
    setValidationErrors({});
    setIsLoading(true);
    
    try {
      // If onSubmit handler provided, use it
      if (onSubmit) {
        onSubmit(plate, state);
        return;
      }
      
      // Call the unified-decode edge function
      const { data, error } = await supabase.functions.invoke('unified-decode', {
        body: { plate, state }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Create a valuation with the decoded data
      const vehicleData = {
        plate,
        state,
        make: data?.make || 'Unknown',
        model: data?.model || 'Unknown',
        year: data?.year || new Date().getFullYear(),
        color: data?.color,
        bodyType: data?.bodyType,
        fuelType: data?.fuelType,
        transmission: data?.transmission
      };
      
      // Create valuation in database
      const { data: valuationData, error: valuationError } = await supabase
        .from('valuations')
        .insert({
          plate,
          state,
          make: vehicleData.make,
          model: vehicleData.model,
          year: vehicleData.year,
          color: vehicleData.color,
          fuel_type: vehicleData.fuelType,
          transmission: vehicleData.transmission,
          is_vin_lookup: false,
          estimated_value: Math.floor(12000 + Math.random() * 8000), // Placeholder until real valuation
          confidence_score: 75,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          zip_code: zipCode
        })
        .select()
        .single();
      
      if (valuationError) {
        throw new Error(valuationError.message);
      }
      
      // Navigate to result page
      navigate(`/valuation/${valuationData.id}`);
    } catch (error) {
      console.error('Error during plate lookup:', error);
      toast.error('Failed to lookup license plate. Please try again or use manual entry.');
    } finally {
      setIsLoading(false);
    }
  }, [plate, state, zipCode, onSubmit, decodePlate, navigate]);
  
  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">License Plate Lookup</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plate">License Plate</Label>
              <Input
                id="plate"
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                placeholder="Enter plate number"
                className={validationErrors.plate ? 'border-red-500' : ''}
              />
              {validationErrors.plate && (
                <p className="text-sm text-red-500">{validationErrors.plate}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger 
                  id="state"
                  className={validationErrors.state ? 'border-red-500' : ''}
                >
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.state && (
                <p className="text-sm text-red-500">{validationErrors.state}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input
              id="zipCode"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Enter ZIP code"
              className={validationErrors.zipCode ? 'border-red-500' : ''}
            />
            {validationErrors.zipCode && (
              <p className="text-sm text-red-500">{validationErrors.zipCode}</p>
            )}
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Looking up plate...
              </>
            ) : (
              'Lookup License Plate'
            )}
          </Button>
        </form>
        
        {onManualEntryClick && (
          <div className="mt-4 text-center">
            <Button 
              variant="link" 
              onClick={onManualEntryClick}
              className="text-sm"
            >
              Enter Details Manually
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlateDecoderForm;
