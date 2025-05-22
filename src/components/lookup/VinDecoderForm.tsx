
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useValuation } from "@/hooks/useValuation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { isValidVIN } from "@/utils/validation/vin-validation";
import { Loader2, AlertTriangle } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export interface VinDecoderFormProps {
  onSubmit?: (vin: string) => void;
}

const VinDecoderForm: React.FC<VinDecoderFormProps> = ({ onSubmit }) => {
  const [vin, setVin] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { decodeVin } = useValuation();
  const navigate = useNavigate();

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
    setIsLoading(true);
    
    try {
      // Use the provided onSubmit handler if available
      if (onSubmit) {
        onSubmit(vin);
        return;
      }
      
      // If no onSubmit handler, use the useValuation hook
      const result = await decodeVin(vin);
      
      if (result.success) {
        toast.success("Vehicle found successfully!");
        // Navigation will be handled by the hook
      } else {
        throw new Error(result.error || "Failed to lookup VIN");
      }
    } catch (err) {
      console.error("Error in VIN lookup:", err);
      toast.error(err instanceof Error ? err.message : "Failed to lookup VIN");
      setValidationError(err instanceof Error ? err.message : "Failed to lookup VIN");
    } finally {
      setIsLoading(false);
    }
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
              aria-invalid={!!validationError}
              aria-describedby={validationError ? "vin-error" : undefined}
            />
            {validationError && (
              <p id="vin-error" className="text-sm text-red-500">{validationError}</p>
            )}
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
            data-testid="vin-lookup-button"
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
