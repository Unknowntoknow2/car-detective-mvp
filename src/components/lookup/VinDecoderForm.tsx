
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useValuation } from "@/hooks/useValuation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { isValidVIN } from "@/utils/validation/vin-validation";
import { Loader2 } from "lucide-react";
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
      
      // Call the unified-decode edge function directly
      const { data, error } = await supabase.functions.invoke('unified-decode', {
        body: { vin }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Create a valuation with the decoded data
      const vehicleData = {
        vin,
        make: data?.make || 'Unknown',
        model: data?.model || 'Unknown',
        year: data?.year || new Date().getFullYear(),
        bodyType: data?.bodyType,
        fuelType: data?.fuelType,
        transmission: data?.transmission
      };
      
      // Create valuation in database
      const { data: valuationData, error: valuationError } = await supabase
        .from('valuations')
        .insert({
          vin,
          make: vehicleData.make,
          model: vehicleData.model,
          year: vehicleData.year,
          fuel_type: vehicleData.fuelType,
          transmission: vehicleData.transmission,
          is_vin_lookup: true,
          estimated_value: Math.floor(15000 + Math.random() * 10000), // Placeholder until real valuation
          confidence_score: 85,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();
      
      if (valuationError) {
        throw new Error(valuationError.message);
      }
      
      // Navigate to result page
      navigate(`/valuation/${valuationData.id}`);
    } catch (err) {
      console.error("Error in VIN lookup:", err);
      toast.error(err instanceof Error ? err.message : "Failed to lookup VIN");
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
