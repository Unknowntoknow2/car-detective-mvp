
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Loader2, Search } from 'lucide-react';

interface PlateLookupTabProps {
  plateValue: string;
  plateState: string;
  isLoading: boolean;
  vehicle: any;
  onPlateChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onLookup: () => void;
}

export function PlateLookupTab({
  plateValue,
  plateState,
  isLoading,
  vehicle,
  onPlateChange,
  onStateChange,
  onLookup
}: PlateLookupTabProps) {
  // US states for dropdown
  const states = [
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    // ...more states
  ];
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="license-plate">License Plate</Label>
            <Input
              id="license-plate"
              value={plateValue}
              onChange={(e) => onPlateChange(e.target.value.toUpperCase())}
              placeholder="Enter license plate"
              disabled={isLoading}
              className="font-mono text-lg tracking-wider"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select
              value={plateState}
              onValueChange={onStateChange}
              disabled={isLoading}
            >
              <SelectTrigger id="state">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={onLookup} 
            disabled={!plateValue || !plateState || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Looking up...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Lookup License Plate
              </>
            )}
          </Button>
          
          {vehicle && (
            <div className="mt-4 p-4 bg-primary/5 rounded-md">
              <p className="font-medium">Found: {vehicle.year} {vehicle.make} {vehicle.model}</p>
              {vehicle.trim && <p className="text-sm text-muted-foreground">Trim: {vehicle.trim}</p>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
