
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { US_STATES } from "@/lib/constants";
import { usePlateLookup } from "@/hooks/usePlateLookup";

interface UnifiedPlateLookupProps {
  onVehicleFound: (vehicle: any) => void;
  tier?: "free" | "premium";
  showPremiumFeatures?: boolean;
}

export function UnifiedPlateLookup({ 
  onVehicleFound, 
  tier = "free",
  showPremiumFeatures = false
}: UnifiedPlateLookupProps) {
  const [plateNumber, setPlateNumber] = useState("");
  const [selectedState, setSelectedState] = useState("");
  
  const { lookupVehicle, isLoading, error } = usePlateLookup();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!plateNumber || !selectedState) {
      return;
    }

    try {
      const result = await lookupVehicle(plateNumber, selectedState);
      if (result) {
        onVehicleFound(result);
      }
    } catch (err) {
    }
  };

  const handleStateChange = (value: string) => {
    setSelectedState(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>License Plate Lookup</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plate">License Plate Number</Label>
            <Input
              id="plate"
              type="text"
              placeholder="Enter plate number"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
              className="uppercase"
              maxLength={8}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select value={selectedState} onValueChange={handleStateChange} required>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((state: { value: string; label: string }) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !plateNumber || !selectedState}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Looking up..." : "Look Up Vehicle"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
