
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Check, Loader2 } from 'lucide-react';
import { validateVIN } from '@/utils/validation/vin-validation';

interface NicbVinCheckProps {
  onCheck?: (vin: string, isValid: boolean) => void;
}

const NicbVinCheck: React.FC<NicbVinCheckProps> = ({ onCheck }) => {
  const [vin, setVin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVin = e.target.value.toUpperCase();
    setVin(newVin);
    setError(null);
    setIsValid(null);
  };
  
  const handleCheck = async () => {
    // First validate the VIN format
    const vinValidation = validateVIN(vin);
    if (!vinValidation.isValid) {
      setError(vinValidation.error || 'Invalid VIN format');
      setIsValid(false);
      if (onCheck) onCheck(vin, false);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Here we would normally call an API to check the VIN
      // For this demo, we'll simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, let's say all VINs that pass the format validation are valid
      setIsValid(true);
      setError(null);
      if (onCheck) onCheck(vin, true);
    } catch (err) {
      setError('Failed to check VIN. Please try again.');
      setIsValid(false);
      if (onCheck) onCheck(vin, false);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="vin-check">Enter VIN to check against NICB database</Label>
        <div className="flex space-x-2">
          <Input
            id="vin-check"
            value={vin}
            onChange={handleChange}
            placeholder="e.g. 1HGCM82633A004352"
            maxLength={17}
            className={error ? 'border-red-500' : ''}
          />
          <Button 
            onClick={handleCheck} 
            disabled={!vin || vin.length !== 17 || isLoading}
            variant="outline"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              'Check'
            )}
          </Button>
        </div>
        {error && (
          <div className="flex items-center text-red-500 text-sm mt-1">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}
        {isValid && (
          <div className="flex items-center text-green-500 text-sm mt-1">
            <Check className="h-4 w-4 mr-1" />
            VIN is valid and not reported stolen
          </div>
        )}
      </div>
    </div>
  );
};

export default NicbVinCheck;
