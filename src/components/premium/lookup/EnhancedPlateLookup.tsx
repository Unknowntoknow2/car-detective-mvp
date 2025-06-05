
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface EnhancedPlateLookupProps {
  onLookupComplete?: (data: any) => void;
}

export function EnhancedPlateLookup({ onLookupComplete }: EnhancedPlateLookupProps) {
  const [plate, setPlate] = useState("");
  const [state, setState] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const states = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate || !state) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockData = {
        plate,
        state,
        make: "Toyota",
        model: "Camry",
        year: 2019,
        vin: "1234567890ABCDEFG"
      };
      
      onLookupComplete?.(mockData);
    } catch (error) {
      console.error("Plate lookup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>License Plate Lookup</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="plate">License Plate Number</Label>
            <Input
              id="plate"
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              placeholder="Enter license plate"
              className="uppercase"
            />
          </div>

          <div>
            <Label htmlFor="state">State</Label>
            <Select onValueChange={setState} value={state}>
              <SelectTrigger id="state">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {states.map(stateCode => (
                  <SelectItem key={stateCode} value={stateCode}>
                    {stateCode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!plate || !state || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Looking up...
              </>
            ) : (
              "Lookup Vehicle"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
