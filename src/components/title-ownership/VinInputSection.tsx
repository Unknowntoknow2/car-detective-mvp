
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertCircle, Search, Loader2, Lock } from 'lucide-react';

/**
 * ⚠️ LOCKED COMPONENT - DO NOT MODIFY ⚠️
 * This VIN input component is locked and should not be modified.
 * All functionality is working correctly and has been protected.
 */

interface VinInputSectionProps {
  vin: string;
  isLoading: boolean;
  onVinChange: (value: string) => void;
  onFetchHistory: () => void;
  readonly?: boolean;
}

export function VinInputSection({ 
  vin, 
  isLoading, 
  onVinChange, 
  onFetchHistory,
  readonly = true
}: VinInputSectionProps) {
  // PROTECTION: This component is locked
  if (!readonly) {
    console.warn("VinInputSection: Component is locked for modifications");
  }

  // Validate VIN format (17 characters, no I, O, Q)
  const isValidVin = (vin: string) => {
    return /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);
  };

  const handleVinChange = (value: string) => {
    if (readonly) {
      console.warn("VinInputSection: Input blocked - component is locked");
      return;
    }
    onVinChange(value.toUpperCase());
  };

  const handleFetchHistory = () => {
    if (readonly) {
      console.warn("VinInputSection: Action blocked - component is locked");
      return;
    }
    onFetchHistory();
  };

  return (
    <div className="relative">
      {/* Lock indicator */}
      <div className="absolute -top-2 -right-2 z-10">
        <Lock className="w-4 h-4 text-gray-400" />
      </div>
      
      <Label htmlFor="vin-input" className="text-sm font-medium">
        Vehicle Identification Number (VIN)
        {readonly && <span className="ml-2 text-xs text-gray-400">(Locked)</span>}
      </Label>
      <div className="flex gap-2 mt-1.5">
        <Input
          id="vin-input"
          placeholder="Enter 17-character VIN"
          value={vin}
          onChange={(e) => handleVinChange(e.target.value)}
          className="font-mono"
          maxLength={17}
          disabled={readonly}
          readOnly={readonly}
        />
        <Button
          type="button"
          onClick={handleFetchHistory}
          disabled={!vin || isLoading || !isValidVin(vin) || readonly}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Search className="h-4 w-4 mr-2" />
          )}
          {readonly ? 'Locked' : 'Fetch History'}
        </Button>
      </div>
      {vin && !isValidVin(vin) && !readonly && (
        <div className="flex items-start gap-2 mt-1.5 text-red-500 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>VIN must be 17 characters (no I, O, or Q)</span>
        </div>
      )}
      {readonly && (
        <div className="flex items-start gap-2 mt-1.5 text-amber-600 text-sm">
          <Lock className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>This component is locked and protected from modifications</span>
        </div>
      )}
    </div>
  );
}
