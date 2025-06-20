
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePlateLookup } from '@/hooks/usePlateLookup';
import { toast } from 'sonner';

interface UnifiedPlateLookupProps {
  onVehicleFound?: (vehicle: any) => void;
  tier?: 'free' | 'premium';
  showPremiumFeatures?: boolean;
}

const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' }
];

export const UnifiedPlateLookup: React.FC<UnifiedPlateLookupProps> = ({ 
  onVehicleFound,
  tier = 'free',
  showPremiumFeatures = false
}) => {
  const [plate, setPlate] = useState('');
  const [state, setState] = useState('');
  const { lookupVehicle, isLoading, error } = usePlateLookup({ tier });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!plate.trim()) {
      toast.error('Please enter a license plate number');
      return;
    }
    
    if (!state) {
      toast.error('Please select a state');
      return;
    }
    
    const result = await lookupVehicle(plate.trim().toUpperCase(), state);
    
    if (result && onVehicleFound) {
      onVehicleFound(result);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>License Plate Lookup {tier === 'premium' && '(Premium)'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="plate">License Plate Number</Label>
            <Input
              id="plate"
              type="text"
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              placeholder="Enter plate number"
              className={error ? 'border-red-500' : ''}
            />
          </div>
          
          <div>
            <Label htmlFor="state">State</Label>
            <Select value={state} onValueChange={setState}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((s) => (
                  <SelectItem key={s.code} value={s.code}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <Button 
            type="submit" 
            disabled={!plate || !state || isLoading}
            className="w-full"
          >
            {isLoading ? 'Looking up...' : 'Look up Vehicle'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UnifiedPlateLookup;
