
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface EnhancedVinLookupProps {
  onLookupComplete?: (data: any) => void;
}

export function EnhancedVinLookup({ onLookupComplete }: EnhancedVinLookupProps) {
  const [vin, setVin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vin || vin.length !== 17) {
      setError("VIN must be exactly 17 characters");
      return;
    }

    setError(null);
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockData = {
        vin,
        make: "Honda",
        model: "Civic",
        year: 2020,
        trim: "EX"
      };
      
      onLookupComplete?.(mockData);
    } catch (error) {
      console.error("VIN lookup error:", error);
      setError("Failed to lookup VIN. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setVin(value);
    setError(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>VIN Lookup</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="vin">Vehicle Identification Number (VIN)</Label>
            <Input
              id="vin"
              value={vin}
              onChange={handleVinChange}
              placeholder="Enter 17-character VIN"
              maxLength={17}
              className={error ? "border-red-500" : ""}
            />
            {error && (
              <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              VIN must be exactly 17 characters
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={vin.length !== 17 || isLoading}
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
}
