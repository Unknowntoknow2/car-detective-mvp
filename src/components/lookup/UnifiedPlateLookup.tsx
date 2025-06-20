
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePlateLookup } from "@/hooks/usePlateLookup";
import { toast } from "sonner";

interface UnifiedPlateLookupProps {
  tier: "free" | "premium";
  onVehicleFound: (data: any) => void;
  showPremiumFeatures?: boolean;
}

export function UnifiedPlateLookup({
  tier,
  onVehicleFound,
  showPremiumFeatures = false
}: UnifiedPlateLookupProps) {
  const [plate, setPlate] = useState("");
  const [state, setState] = useState("");
  
  const { mutate: lookupPlate, isPending } = usePlateLookup({
    onSuccess: (data) => {
      toast.success("Vehicle found!");
      onVehicleFound(data);
    },
    onError: (error) => {
      toast.error("Vehicle not found or lookup failed");
      console.error("Plate lookup error:", error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!plate || !state) {
      toast.error("Please enter both license plate and state");
      return;
    }

    lookupPlate({ plate: plate.toUpperCase(), state });
  };

  // US states for the dropdown
  const states = [
    { code: "AL", name: "Alabama" },
    { code: "AK", name: "Alaska" },
    { code: "CA", name: "California" },
    { code: "FL", name: "Florida" },
    { code: "NY", name: "New York" },
    { code: "TX", name: "Texas" },
    // Add more states as needed
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>License Plate Lookup</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="plate">License Plate</Label>
            <Input
              id="plate"
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              placeholder="Enter license plate"
              maxLength={8}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select value={state} onValueChange={setState} required>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {states.map((s) => (
                  <SelectItem key={s.code} value={s.code}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isPending}
          >
            {isPending ? "Looking up..." : "Lookup Vehicle"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
