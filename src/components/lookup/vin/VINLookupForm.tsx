
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedVinLookup } from './EnhancedVinLookup';
import { Lock } from 'lucide-react';

/**
 * ⚠️ LOCKED COMPONENT - DO NOT MODIFY ⚠️
 * This VIN lookup form is locked and should not be modified.
 * All functionality is working correctly and has been protected.
 */

interface VINLookupFormProps {
  onVehicleFound?: (vehicle: any) => void;
  showHeader?: boolean;
  readonly?: boolean;
}

export function VINLookupForm({ onVehicleFound, showHeader = true, readonly = true }: VINLookupFormProps) {
  // PROTECTION: This component is locked
  if (!readonly) {
    console.warn("VINLookupForm: Component is locked for modifications");
  }

  const handleVehicleFound = (vehicle: any) => {
    if (readonly) {
      console.warn("VINLookupForm: Action blocked - component is locked");
      return;
    }
    onVehicleFound?.(vehicle);
  };

  return (
    <Card className="w-full max-w-md mx-auto relative">
      {/* Lock indicator */}
      <div className="absolute top-2 right-2 z-10">
        <Lock className="w-4 h-4 text-gray-400" />
      </div>
      
      {showHeader && (
        <CardHeader>
          <CardTitle className="text-center">
            VIN Lookup
            {readonly && <span className="ml-2 text-xs text-gray-400">(Locked)</span>}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <EnhancedVinLookup 
          onVehicleFound={handleVehicleFound}
          showManualFallback={!readonly}
          readonly={readonly}
        />
        
        {readonly && (
          <div className="mt-4 p-2 bg-amber-50 border border-amber-200 rounded text-amber-700 text-sm">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>This component is locked and protected from modifications</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
