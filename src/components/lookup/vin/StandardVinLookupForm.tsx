
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { VinInfoMessage } from '@/components/validation/VinInfoMessage';
import { validateVIN } from '@/utils/validation/vin-validation';

interface VINLookupFormProps {
  onSubmit: (vin: string) => void;
  error?: string | null;
}

export const VINLookupForm: React.FC<VINLookupFormProps> = ({ onSubmit, error }) => {
  const [vin, setVin] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset previous results and errors
    setError(null);
    setResult(null);
    
    // Validate VIN
    const validation = validateVIN(vin);
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid VIN');
      return;
    }
    
    // Call the onSubmit handler
    onSubmit(vin);
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="vin" className="block text-sm font-medium mb-1">
            Vehicle Identification Number (VIN)
          </label>
          <Input
            id="vin"
            value={vin}
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            placeholder="Enter 17-character VIN"
            maxLength={17}
            className="font-mono"
          />
          <div className="mt-2">
            <VinInfoMessage />
          </div>
        </div>
        
        {validationError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Looking up...' : 'Lookup Vehicle'}
        </Button>
      </form>
      
      {result && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Vehicle Information</h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Make</dt>
                <dd>{result.make}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Model</dt>
                <dd>{result.model}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Year</dt>
                <dd>{result.year}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
