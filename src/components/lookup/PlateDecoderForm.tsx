
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { usePlateLookup } from '@/hooks/usePlateLookup';
import { PlateLookupInfo } from '@/types/lookup';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// List of US state codes
const US_STATES = [
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
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'District of Columbia' },
];

export const PlateDecoderForm = () => {
  const [plate, setPlate] = useState('');
  const [state, setState] = useState('');
  const { vehicleInfo, isLoading, error, lookupVehicle } = usePlateLookup();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (plate && state) {
      await lookupVehicle(plate, state);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">License Plate Lookup</CardTitle>
          <CardDescription>
            Enter a license plate and state to get vehicle information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="plate" className="text-sm font-medium">
                License Plate
              </label>
              <Input
                id="plate"
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                placeholder="e.g. ABC123"
                maxLength={8}
                className="uppercase"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="state" className="text-sm font-medium">
                State
              </label>
              <Select value={state} onValueChange={setState} required>
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label} ({state.value})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || !plate || !state}>
              {isLoading ? 'Looking up...' : 'Lookup Plate'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {vehicleInfo && <PlateInfoCard vehicleInfo={vehicleInfo} />}
    </div>
  );
};

interface PlateInfoCardProps {
  vehicleInfo: PlateLookupInfo;
}

const PlateInfoCard = ({ vehicleInfo }: PlateInfoCardProps) => {
  // Helper function to display field value with "Unknown" fallback
  const displayField = (value: string | number | null | undefined) => {
    if (value === undefined || value === null) return "Unknown";
    if (typeof value === 'string' && (
      value.trim() === '' || 
      value === 'N/A' || 
      value === 'Not Applicable' || 
      value === 'Not Available'
    )) {
      return "Unknown";
    }
    return value;
  };

  return (
    <Card className="mt-6 border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl">Vehicle Information</CardTitle>
        <CardDescription>Details for plate: {vehicleInfo.plate}, state: {vehicleInfo.state}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Make</p>
            <p className="text-lg font-semibold">{displayField(vehicleInfo.make)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Model</p>
            <p className="text-lg font-semibold">{displayField(vehicleInfo.model)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Year</p>
            <p className="text-lg font-semibold">{displayField(vehicleInfo.year)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Color</p>
            <p className="text-lg font-semibold">{displayField(vehicleInfo.color)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
