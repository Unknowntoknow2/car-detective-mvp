
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { isValidVIN } from '@/utils/validation/vin-validation';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';

interface EnhancedVinLookupProps {
  onVehicleFound?: (vehicle: any) => void;
  onError?: (vin: string, error: string) => void;
  showManualFallback?: boolean;
}

export function EnhancedVinLookup({ 
  onVehicleFound, 
  onError, 
  showManualFallback = false 
}: EnhancedVinLookupProps) {
  const { vin: urlVin } = useParams();
  const [vin, setVin] = useState(urlVin || '');
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Auto-submit if VIN is in URL
  useEffect(() => {
    if (urlVin && isValidVIN(urlVin) && retryCount === 0) {
      console.log(`🚀 Auto-submitting URL VIN: ${urlVin}`);
      handleSubmitInternal(urlVin);
    }
  }, [urlVin, retryCount]);

  const handleVinChange = (value: string) => {
    const upperVin = value.toUpperCase();
    setVin(upperVin);
    setValidationError(null);
    setRetryCount(0);

    if (upperVin && !isValidVIN(upperVin)) {
      setValidationError('Invalid VIN format');
    }
  };

  const validateVehicleData = (data: any, inputVin: string): boolean => {
    // Check if VIN matches exactly
    if (data.vin !== inputVin) {
      console.error(`❌ VIN mismatch: expected ${inputVin}, got ${data.vin}`);
      return false;
    }
    
    // Check for minimum required fields
    if (!data.make || !data.model) {
      console.error(`❌ Missing required vehicle data:`, data);
      return false;
    }
    
    return true;
  };

  const handleSubmitInternal = async (vinToSubmit: string) => {
    console.log(`🔍 Decoding VIN: ${vinToSubmit} (attempt ${retryCount + 1})`);
    
    setIsLoading(true);
    setValidationError(null);

    try {
      const { data, error } = await supabase.functions.invoke('unified-decode', {
        body: { vin: vinToSubmit }
      });

      if (error) {
        console.error('❌ Decode function error:', error);
        const errorMessage = 'Service temporarily unavailable. Please try again or use manual entry.';
        
        if (onError) {
          onError(vinToSubmit, errorMessage);
        } else {
          toast.error(errorMessage);
        }
        return;
      }

      console.log('📦 Decode response:', data);

      if (data.success && data.decoded) {
        // Validate the decoded data
        if (!validateVehicleData(data.decoded, vinToSubmit)) {
          const errorMessage = 'Invalid vehicle data received. Please try again or use manual entry.';
          
          if (onError) {
            onError(vinToSubmit, errorMessage);
          } else {
            toast.error(errorMessage);
          }
          return;
        }
        
        console.log('✅ VIN decoded successfully:', data);
        
        // Show success message with source info
        const sourceMessage = data.source === 'cache' ? 'from cache' : 
                            data.source === 'nhtsa' ? 'from NHTSA' : 
                            data.source === 'fallback' ? 'using fallback method' : '';
        
        toast.success(`VIN decoded successfully ${sourceMessage}: ${data.decoded.year || ''} ${data.decoded.make} ${data.decoded.model}`.trim());
        
        if (onVehicleFound) {
          onVehicleFound({
            vin: data.decoded.vin,
            make: data.decoded.make,
            model: data.decoded.model,
            year: data.decoded.year,
            trim: data.decoded.trim,
            engine: data.decoded.engine,
            transmission: data.decoded.transmission,
            drivetrain: data.decoded.drivetrain,
            bodyType: data.decoded.bodyType,
            fuelType: data.decoded.fuelType,
            doors: data.decoded.doors,
            engineCylinders: data.decoded.engineCylinders,
            source: data.source
          });
        }
      } else {
        console.error('❌ Decode failed:', data);
        const errorMessage = data.error || 'Unable to decode VIN. Please try again or use manual entry.';
        
        if (onError) {
          onError(vinToSubmit, errorMessage);
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      console.error('❌ VIN lookup error:', error);
      const errorMessage = 'Network error. Please check your connection and try again.';
      
      if (onError) {
        onError(vinToSubmit, errorMessage);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vin) {
      setValidationError('VIN is required');
      return;
    }

    if (!isValidVIN(vin)) {
      setValidationError('Invalid VIN format');
      return;
    }

    await handleSubmitInternal(vin);
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    const vinToUse = vin || urlVin || '';
    if (vinToUse) {
      handleSubmitInternal(vinToUse);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            value={vin}
            onChange={(e) => handleVinChange(e.target.value)}
            placeholder="Enter 17-character VIN"
            className={`font-mono text-lg ${validationError ? 'border-destructive' : ''}`}
            disabled={isLoading}
            maxLength={17}
          />
          {validationError && (
            <div className="flex items-center gap-1.5 text-destructive text-sm">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{validationError}</span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            type="submit" 
            disabled={!vin || !!validationError || isLoading} 
            className="flex-1"
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
          
          {retryCount > 0 && !isLoading && (
            <Button 
              type="button"
              variant="outline"
              onClick={handleRetry}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
