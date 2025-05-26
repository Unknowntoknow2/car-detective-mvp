
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';
import { validateVIN } from '@/utils/validation/vin-validation';
import { decodeVin, retryDecode } from '@/services/vehicleDecodeService';
import { VehicleDecodeResponse } from '@/types/vehicle-decode';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface EnhancedVinLookupProps {
  onVehicleFound?: (vehicle: any) => void;
  showManualFallback?: boolean;
}

export function EnhancedVinLookup({ onVehicleFound, showManualFallback = true }: EnhancedVinLookupProps) {
  const [vin, setVin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VehicleDecodeResponse | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const navigate = useNavigate();

  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVin = e.target.value.toUpperCase();
    setVin(newVin);
    setError(null);
    setResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await performDecode(false);
  };

  const handleRetry = async () => {
    await performDecode(true);
  };

  const performDecode = async (isRetry: boolean = false) => {
    const validation = validateVIN(vin);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid VIN format');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = isRetry 
        ? await retryDecode(vin, retryCount)
        : await decodeVin(vin);
      
      setResult(response);
      
      if (response.success && response.decoded) {
        toast.success(`Vehicle decoded successfully via ${response.source.toUpperCase()}`);
        
        if (onVehicleFound) {
          onVehicleFound(response.decoded);
        } else {
          // Navigate to valuation page
          navigate(`/valuation/${vin}`);
        }
      } else {
        setError(response.error || 'Unable to decode VIN');
        setRetryCount(prev => prev + 1);
        
        if (response.error?.includes('timeout') || response.error?.includes('temporarily')) {
          toast.error('Decode timeout - try again or use manual entry');
        } else {
          toast.error(response.error || 'Decode failed');
        }
      }
    } catch (error) {
      console.error('Decode error:', error);
      setError('An unexpected error occurred. Please try again.');
      toast.error('Decode failed - please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualEntry = () => {
    // Navigate to manual entry with VIN prefilled
    navigate('/valuation', { state: { prefillVin: vin } });
  };

  const isValidVin = vin.length === 17 && validateVIN(vin).isValid;
  const showRetryButton = result && !result.success && !isLoading;
  const showManualFallbackButton = showManualFallback && error && retryCount >= 1;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter VIN (17 characters)"
              value={vin}
              onChange={handleVinChange}
              maxLength={17}
              className={`text-lg font-mono tracking-wide h-12 pr-10 ${
                error ? 'border-red-500 focus-visible:ring-red-500' : 
                (isValidVin && !isLoading) ? 'border-green-500 focus-visible:ring-green-500' : ''
              }`}
            />
            {isValidVin && !isLoading && !error && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
            )}
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && result.success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                ✅ Vehicle decoded successfully via {result.source.toUpperCase()}!
                {result.decoded && (
                  <div className="mt-2 font-medium">
                    {result.decoded.year} {result.decoded.make} {result.decoded.model}
                    {result.decoded.trim && ` ${result.decoded.trim}`}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <div className="flex flex-col gap-3">
          <Button 
            type="submit" 
            disabled={!isValidVin || isLoading}
            className="w-full h-12"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Decoding VIN...
              </>
            ) : (
              'Decode VIN'
            )}
          </Button>

          {showRetryButton && (
            <Button 
              type="button"
              variant="outline"
              onClick={handleRetry}
              className="w-full"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Retry Decode
            </Button>
          )}

          {showManualFallbackButton && (
            <div className="space-y-2">
              <div className="text-center text-sm text-muted-foreground">
                Having trouble? Try manual entry instead
              </div>
              <Button 
                type="button"
                variant="secondary"
                onClick={handleManualEntry}
                className="w-full"
              >
                Use Manual Entry
              </Button>
            </div>
          )}
        </div>
      </form>
      
      <div className="text-xs text-muted-foreground text-center">
        💡 Find your VIN on your dashboard, registration, or insurance card
      </div>
    </div>
  );
}
