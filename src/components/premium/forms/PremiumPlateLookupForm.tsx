
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Car } from 'lucide-react';

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

interface PremiumPlateLookupFormProps {
  plate?: string;
  setPlate?: (plate: string) => void;
  stateCode?: string;
  setStateCode?: (state: string) => void;
  onSubmit?: () => void;
}

export default function PremiumPlateLookupForm({ 
  plate: externalPlate, 
  setPlate: externalSetPlate,
  stateCode: externalStateCode,
  setStateCode: externalSetStateCode,
  onSubmit: externalOnSubmit 
}: PremiumPlateLookupFormProps) {
  const [internalPlate, setInternalPlate] = useState('');
  const [internalState, setInternalState] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Use external state if provided, otherwise use internal state
  const plate = externalPlate !== undefined ? externalPlate : internalPlate;
  const setPlate = externalSetPlate || setInternalPlate;
  const state = externalStateCode !== undefined ? externalStateCode : internalState;
  const setState = externalSetStateCode || setInternalState;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!plate || !state) {
      toast({
        title: "Missing Information",
        description: "Please enter both license plate and state",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // If external onSubmit is provided, use it
      if (externalOnSubmit) {
        externalOnSubmit();
        return;
      }

      // Mock license plate lookup for premium service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Plate Lookup Successful",
        description: `Processing vehicle data for ${plate} from ${state}`,
      });
      
      // Navigate to premium valuation results or next step
      console.log('Premium plate lookup:', { plate, state });
    } catch (error) {
      console.error('Premium plate lookup error:', error);
      toast({
        title: "Lookup Error",
        description: "An error occurred while processing your license plate",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Premium License Plate Lookup
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter your license plate number and state for advanced vehicle identification and premium analysis.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plate">License Plate Number</Label>
              <Input
                id="plate"
                type="text"
                placeholder="ABC1234"
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                className="font-mono text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {US_STATES.map((usState) => (
                    <SelectItem key={usState.code} value={usState.code}>
                      {usState.name} ({usState.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">Premium Plate Lookup Includes:</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Enhanced vehicle identification</li>
              <li>• Registration history analysis</li>
              <li>• Multi-source data verification</li>
              <li>• Ownership timeline insights</li>
              <li>• Premium market comparisons</li>
            </ul>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !plate || !state}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Plate...
              </>
            ) : (
              'Get Premium Valuation'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
