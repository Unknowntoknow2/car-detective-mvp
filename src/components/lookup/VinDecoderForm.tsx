import React, { useState } from "react";
import { useValuation } from "@/hooks/useValuation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { isValidVIN } from "@/utils/validation/vin-validation";
import { Loader2 } from "lucide-react";

export interface VinDecoderFormProps {
  onSubmit?: (vin: string) => void;
}

const VinDecoderForm: React.FC<VinDecoderFormProps> = ({ onSubmit }) => {
  const [vin, setVin] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const { decodeVin, isLoading } = useValuation();

  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVin(e.target.value.toUpperCase());
    setValidationError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate VIN
    if (!vin.trim()) {
      setValidationError("VIN is required");
      return;
    }
    
    if (!isValidVIN(vin)) {
      setValidationError("Please enter a valid 17-character VIN");
      return;
    }
    
    // Clear validation error
    setValidationError(null);
    
    // Use the provided onSubmit handler if available
    if (onSubmit) {
      onSubmit(vin);
      return;
    }
    
    // Otherwise use our hook
    await decodeVin(vin);
  };

  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">VIN Lookup</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vin">Vehicle Identification Number (VIN)</Label>
            <Input
              id="vin"
              value={vin}
              onChange={handleVinChange}
              placeholder="Enter 17-character VIN"
              className={validationError ? "border-red-500" : ""}
            />
            {validationError && (
              <p className="text-sm text-red-500">{validationError}</p>
            )}
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Looking up VIN...
              </>
            ) : (
              "Lookup VIN"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VinDecoderForm;
