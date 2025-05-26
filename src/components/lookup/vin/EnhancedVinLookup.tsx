
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { isValidVIN } from '@/utils/validation/vin-validation';
import { toast } from 'sonner';

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
  const [vin, setVin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleVinChange = (value: string) => {
    const upperVin = value.toUpperCase();
    setVin(upperVin);
    setValidationError(null);

    if (upperVin && !isValidVIN(upperVin)) {
      setValidationError('Invalid VIN format');
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

    setIsLoading(true);
    setValidationError(null);

    try {
      console.log(`🔍 Decoding VIN: ${vin}`);
      
      const { data, error } = await supabase.functions.invoke('unified-decode', {
        body: { vin }
      });

      if (error) {
        console.error('❌ Decode function error:', error);
        const errorMessage = 'Service temporarily unavailable. Please try again or use manual entry.';
        
        if (onError) {
          onError(vin, errorMessage);
        } else {
          toast.error(errorMessage);
        }
        return;
      }

      if (data.success && data.decoded) {
        console.log('✅ VIN decoded successfully:', data);
        toast.success('VIN decoded successfully');
        
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
            source: data.source
          });
        }
      } else {
        console.error('❌ Decode failed:', data);
        const errorMessage = data.error || 'Unable to decode VIN. Please try again or use manual entry.';
        
        if (onError) {
          onError(vin, errorMessage);
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      console.error('❌ VIN lookup error:', error);
      const errorMessage = 'Network error. Please check your connection and try again.';
      
      if (onError) {
        onError(vin, errorMessage);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          value={vin}
          onChange={(e) => handleVinChange(e.target.value)}
          placeholder="Enter 17-character VIN"
          className={`font-mono ${validationError ? 'border-destructive' : ''}`}
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
      
      <Button 
        type="submit" 
        disabled={!vin || !!validationError || isLoading} 
        className="w-full"
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
    </form>
  );
}
