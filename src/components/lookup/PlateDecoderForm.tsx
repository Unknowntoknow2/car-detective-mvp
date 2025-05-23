
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usStates } from '@/data/states';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useValuation } from '@/hooks/useValuation';
import { toast } from 'sonner';

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
      
      // If no onSubmit handler, use the decodePlate hook
      const result = await decodePlate(plate, state);
      
      if (result.success) {
        toast.success('Vehicle found successfully!');
        // Navigation will be handled by the hook
      } else {
        throw new Error(result.error || 'Failed to lookup license plate');
      }
    } catch (error) {
      console.error('Error during plate lookup:', error);
      toast.error('Failed to lookup license plate. Please try again or use manual entry.');
      setValidationErrors({
        general: error instanceof Error ? error.message : 'Failed to lookup license plate'
      });
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
                aria-invalid={!!validationErrors.plate}
                aria-describedby={validationErrors.plate ? "plate-error" : undefined}
              />
              {validationErrors.plate && (
                <p id="plate-error" className="text-sm text-red-500">{validationErrors.plate}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select value={state} onValueChange={(value: string) => setState(value)}>
                <SelectTrigger 
                  id="state"
                  className={validationErrors.state ? 'border-red-500' : ''}
                  aria-invalid={!!validationErrors.state}
                  aria-describedby={validationErrors.state ? "state-error" : undefined}
                >
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {usStates.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.state && (
                <p id="state-error" className="text-sm text-red-500">{validationErrors.state}</p>
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
              aria-invalid={!!validationErrors.zipCode}
              aria-describedby={validationErrors.zipCode ? "zip-error" : undefined}
            />
            {validationErrors.zipCode && (
              <p id="zip-error" className="text-sm text-red-500">{validationErrors.zipCode}</p>
            )}
          </div>
          
          {validationErrors.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{validationErrors.general}</p>
            </div>
          )}
          
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            data-testid="plate-lookup-button"
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
