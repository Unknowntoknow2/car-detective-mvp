
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, CheckCircle, Search, AlertTriangle } from 'lucide-react';
import { validateVIN, formatVinInput } from '@/utils/validation/vin-validation';
import { decodeVin } from '@/services/vinService';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UnifiedVinLookupProps {
  onSubmit?: (vin: string) => void;
  showHeader?: boolean;
  className?: string;
}

export const UnifiedVinLookup: React.FC<UnifiedVinLookupProps> = ({
  onSubmit,
  showHeader = false,
  className
}) => {
  const navigate = useNavigate();
  const { vin: urlVin } = useParams();
  
  const [vin, setVin] = useState(urlVin || '');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState<any>(null);
  const [apiWarning, setApiWarning] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('UNIFIED VIN LOOKUP: Form submitted with VIN:', vin);
    
    if (!vin.trim()) {
      setError('Please enter a VIN');
      return;
    }

    const validation = validateVIN(vin);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid VIN format');
      toast.error(validation.error || 'Invalid VIN format');
      return;
    }

    setError(null);
    setApiWarning(null);
    setIsLoading(true);
    setLookupResult(null);

    try {
      console.log('UNIFIED VIN LOOKUP: Calling NHTSA API for VIN decode...');
      const result = await decodeVin(vin);
      
      if (result.success && result.data) {
        console.log('UNIFIED VIN LOOKUP: VIN decode success:', result.data);
        setLookupResult(result.data);
        
        // Store in localStorage for persistence
        localStorage.setItem('current_vin', vin);
        localStorage.setItem('current_vehicle_data', JSON.stringify(result.data));
        
        // Check if this was a fallback response (lower confidence score)
        if (result.data.confidenceScore < 70) {
          setApiWarning('NHTSA database temporarily unavailable. Vehicle details may be limited.');
        }
        
        toast.success(`Vehicle found: ${result.data.year} ${result.data.make} ${result.data.model}`);
        
        // If onSubmit is provided, use it (for embedded usage)
        if (onSubmit) {
          onSubmit(vin);
          return;
        }

        // Navigate to the valuation page with the VIN for follow-up questions
        console.log('UNIFIED VIN LOOKUP: Navigating to valuation page with VIN for details');
        navigate(`/valuation/${vin}`, { replace: true });
      } else {
        console.log('UNIFIED VIN LOOKUP: VIN decode failed:', result.error);
        const errorMessage = result.error || 'Vehicle not found in database';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error('UNIFIED VIN LOOKUP: Unexpected error:', error);
      const errorMessage = error.message || 'Failed to connect to vehicle database';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatVinInput(e.target.value);
    setVin(formatted);
    setError(null);
    setLookupResult(null);
    setApiWarning(null);
  };

  return (
    <div className={className}>
      {showHeader && (
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Get Your Car's Value</h1>
          <p className="text-xl text-gray-600">Enter your VIN for an instant, accurate valuation using NHTSA database</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            VIN Lookup (NHTSA Database)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                id="vin-input"
                type="text"
                placeholder="Enter VIN (17 characters)"
                value={vin}
                onChange={handleVinChange}
                maxLength={17}
                className={`font-mono text-center tracking-wider ${error ? 'border-red-500' : lookupResult ? 'border-green-500' : ''}`}
                disabled={isLoading}
              />
              
              {apiWarning && (
                <Alert className="mt-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {apiWarning}
                  </AlertDescription>
                </Alert>
              )}
              
              {error && (
                <div className="flex items-center mt-2 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {error}
                </div>
              )}
              {lookupResult && (
                <div className="flex items-center mt-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Found: {lookupResult.year} {lookupResult.make} {lookupResult.model}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Find your VIN on your dashboard, driver's side door, or vehicle registration
              </p>
              <p className="text-xs text-muted-foreground">
                {vin.length}/17 characters • VIN format: letters and numbers only (no I, O, Q)
              </p>
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading || vin.length !== 17}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Querying NHTSA Database...
                </>
              ) : (
                'Lookup Vehicle'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
