
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface VinLookupProps {
  onSubmit: (vin: string) => void;
  isLoading?: boolean;
}

const VinLookup: React.FC<VinLookupProps> = ({ onSubmit, isLoading = false }) => {
  const [vin, setVin] = useState("");
  const [error, setError] = useState<string | null>(null);

  const validateVin = (vinValue: string) => {
    if (!vinValue) return "VIN is required";
    if (vinValue.length !== 17) return "VIN must be exactly 17 characters";
    if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vinValue)) {
      return "VIN contains invalid characters";
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateVin(vin);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    onSubmit(vin);
  };

  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setVin(value);
    if (error) setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="vin">Vehicle Identification Number (VIN)</Label>
        <Input
          id="vin"
          type="text"
          placeholder="Enter 17-character VIN"
          value={vin}
          onChange={handleVinChange}
          maxLength={17}
          disabled={isLoading}
          className={error ? "border-red-500" : ""}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
      
      <Button type="submit" disabled={isLoading || !vin} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Looking Up VIN...
          </>
        ) : (
          "Lookup VIN"
        )}
      </Button>
    </form>
  );
};

export default VinLookup;
