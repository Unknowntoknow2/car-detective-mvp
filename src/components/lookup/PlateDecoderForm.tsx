
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { states } from '@/data/states';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useValuationFallback } from '@/hooks/useValuationFallback';
import ManualEntryForm from './ManualEntryForm';
import { plateSchema, validateForm } from '@/components/form/validation';
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
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { fallbackState, setFallbackForPlate, shouldShowManualEntry } = useValuationFallback();
  
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const validation = validateForm(plateSchema, { plate, state, zipCode });
    
    if (!validation.success) {
      console.log('PLATE LOOKUP: Validation failed', validation.errors);
      setValidationErrors(validation.errors || {});
      return;
    }
    
    // Clear validation errors
    setValidationErrors({});
    
    // If onSubmit handler provided, use it
    if (onSubmit) {
      onSubmit(plate, state);
      return;
    }
    
    try {
      setIsLoading(true);
      console.log('PLATE LOOKUP: Looking up plate', plate, 'in state', state);
      
      // Simulate API call with random success/failure
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const success = Math.random() > 0.5; // Simulate 50% failure rate for testing
      
      if (!success) {
        console.error('PLATE LOOKUP: Lookup failed');
        setFallbackForPlate();
      } else {
        console.log('PLATE LOOKUP: Lookup successful');
        toast.success('Vehicle found!');
        // In a real app, you'd store the result and update the UI
      }
    } catch (error) {
      console.error('PLATE LOOKUP: Error during lookup:', error);
      setFallbackForPlate();
    } finally {
      setIsLoading(false);
    }
  }, [plate, state, zipCode, onSubmit, setFallbackForPlate]);
  
  const handleManualSubmit = useCallback((data: any) => {
    console.log('PLATE LOOKUP: Fallback to manual entry with data:', data);
    toast.success('Vehicle information submitted manually');
  }, []);
  
  // If lookup failed and in fallback mode, show manual entry
  if (shouldShowManualEntry) {
    return (
      <div className="space-y-4">
        <div className="p-4 border border-amber-200 bg-amber-50 rounded-md flex items-center gap-2 text-amber-700">
          <AlertTriangle className="h-5 w-5" />
          <div>
            <p className="font-medium">Plate lookup failed</p>
            <p className="text-sm">Please enter your vehicle details manually</p>
          </div>
        </div>
        
        <ManualEntryForm onSubmit={handleManualSubmit} />
      </div>
    );
  }
  
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
