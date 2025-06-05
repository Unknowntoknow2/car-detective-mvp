
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface PlateDecoderFormProps {
  onManualEntryClick?: () => void;
}

const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  // Add more states as needed
];

const PlateDecoderForm: React.FC<PlateDecoderFormProps> = ({
  onManualEntryClick,
}) => {
  const [plate, setPlate] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate || !state || !zipCode) return;

    setIsLoading(true);
    try {
      // Handle plate lookup logic here
      console.log("Looking up plate:", { plate, state, zipCode });
    } catch (error) {
      console.error("Plate lookup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="plate">License Plate</Label>
            <Input
              id="plate"
              type="text"
              placeholder="Enter license plate"
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select value={state} onValueChange={setState}>
              <SelectTrigger id="state">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((stateOption) => (
                  <SelectItem key={stateOption.value} value={stateOption.value}>
                    {stateOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            type="text"
            placeholder="Enter ZIP code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            required
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Looking Up Plate...
            </>
          ) : (
            "Lookup License Plate"
          )}
        </Button>
      </form>

      {onManualEntryClick && (
        <div className="text-center">
          <Button variant="outline" onClick={onManualEntryClick}>
            Enter Vehicle Details Manually
          </Button>
        </div>
      )}
    </div>
  );
};

export default PlateDecoderForm;
