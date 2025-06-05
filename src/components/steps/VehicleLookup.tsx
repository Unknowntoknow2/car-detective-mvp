
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Search, Car } from "lucide-react";

interface VehicleLookupProps {
  onVehicleFound?: (vehicle: any) => void;
  isLoading?: boolean;
}

export function VehicleLookup({ onVehicleFound, isLoading = false }: VehicleLookupProps) {
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
    // Simulate vehicle lookup
    if (onVehicleFound) {
      onVehicleFound({
        vin,
        make: "Toyota",
        model: "Camry",
        year: 2020,
        trim: "LE"
      });
    }
  };

  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setVin(value);
    if (error) setError(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Vehicle Lookup
        </CardTitle>
      </CardHeader>
      <CardContent>
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
              <>
                <Search className="mr-2 h-4 w-4" />
                Lookup Vehicle
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
