
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VinInput } from "./VinInput";
import { validateVin } from "@/utils/validation/vin-validation";
import { Loader2 } from "lucide-react";

interface VinLookupProps {
  onSubmit: (vin: string) => void;
  isLoading?: boolean;
  submitButtonText?: string;
}

export function VinLookup({
  onSubmit,
  isLoading = false,
  submitButtonText = "Lookup VIN",
}: VinLookupProps) {
  const [vin, setVin] = useState("");
  const [touched, setTouched] = useState(false);
  const [externalError, setExternalError] = useState<string | null>(null);

  const validation = validateVin(vin);
  const isValid = validation.isValid && vin.length === 17;

  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "");
    setVin(value);
    setTouched(true);
    setExternalError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    
    if (!isValid) {
      return;
    }

    onSubmit(vin);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isValid) {
      handleSubmit(e as any);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>VIN Lookup</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <VinInput
            value={vin}
            onChange={handleVinChange}
            validationError={touched && !validation.isValid ? validation.message : null}
            externalError={externalError}
            touched={touched}
            isValid={isValid}
            isLoading={isLoading}
            onKeyPress={handleKeyPress}
          />

          <Button
            type="submit"
            disabled={!isValid || isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Looking up VIN...
              </>
            ) : (
              submitButtonText
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default VinLookup;
