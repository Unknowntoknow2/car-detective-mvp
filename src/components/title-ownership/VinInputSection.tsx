
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertCircle, Loader2, Search } from "lucide-react";

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
  readonly = false
}: VinInputSectionProps) {
  // Validate VIN format (17 characters, no I, O, Q)
  const isValidVin = (vin: string) => {
    return /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);
  };

  const handleVinChange = (value: string) => {
    onVinChange(value.toUpperCase());
  };

  const handleFetchHistory = () => {
    onFetchHistory();
  };

  return (
    <div>
      <Label htmlFor="vin-input" className="text-sm font-medium">
        Vehicle Identification Number (VIN)
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
        />
        <Button
          type="button"
          onClick={handleFetchHistory}
          disabled={!vin || isLoading || !isValidVin(vin) || readonly}
        >
          {isLoading
            ? <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            : <Search className="h-4 w-4 mr-2" />}
          Fetch History
        </Button>
      </div>
      {vin && !isValidVin(vin) && (
        <div className="flex items-start gap-2 mt-1.5 text-red-500 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>VIN must be 17 characters (no I, O, or Q)</span>
        </div>
      )}
    </div>
  );
}
