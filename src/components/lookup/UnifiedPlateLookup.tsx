
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingButton } from "@/components/common/UnifiedLoadingSystem";
import { useUnifiedLookup } from "@/hooks/useUnifiedLookup";
import { US_STATES } from "@/lib/constants";

interface UnifiedPlateLookupProps {
  tier: "free" | "premium";
  onVehicleFound: (vehicle: any) => void;
  showPremiumFeatures?: boolean;
}

export function UnifiedPlateLookup({ tier, onVehicleFound, showPremiumFeatures = false }: UnifiedPlateLookupProps) {
  const [plate, setPlate] = useState('');
  const [state, setState] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const { isLoading, lookupByPlate } = useUnifiedLookup({ tier });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!plate.trim()) {
      setError('Please enter a license plate number');
      return;
    }
    
    if (!state) {
      setError('Please select a state');
      return;
    }
    
    setError(null);
    
    try {
      const result = await lookupByPlate(plate.trim().toUpperCase(), state);
      if (result && result.success && result.vehicle) {
        onVehicleFound(result.vehicle);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lookup failed');
    }
  };

  return (
    <div className="space-y-4">
      {showPremiumFeatures && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">
            Premium plate lookup includes enhanced accuracy and additional vehicle details.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="plate">License Plate Number</Label>
          <Input
            id="plate"
            type="text"
            value={plate}
            onChange={(e) => setPlate(e.target.value.toUpperCase())}
            placeholder="Enter license plate"
            className={error && !plate ? 'border-red-500' : ''}
          />
        </div>

        <div>
          <Label htmlFor="state">State</Label>
          <Select value={state} onValueChange={setState}>
            <SelectTrigger className={error && !state ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((stateOption) => (
                <SelectItem key={stateOption.value} value={stateOption.value}>
                  {stateOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <LoadingButton
          type="submit"
          isLoading={isLoading}
          loadingText="Looking up vehicle..."
          className="w-full"
          disabled={!plate || !state}
        >
          {tier === "premium" ? "Get Premium Report" : "Look up Vehicle"}
        </LoadingButton>
      </form>
    </div>
  );
}
