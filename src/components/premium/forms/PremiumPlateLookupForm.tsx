import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Car } from 'lucide-react';
import { toast } from 'sonner';

interface PremiumPlateLookupFormProps {
  plate?: string;
  setPlate?: (plate: string) => void;
  stateCode?: string;
  setStateCode?: (stateCode: string) => void;
  onSubmit?: () => void;
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

export default function PremiumPlateLookupForm({ 
  plate: externalPlate, 
  setPlate: externalSetPlate, 
  stateCode: externalStateCode, 
  setStateCode: externalSetStateCode, 
  onSubmit: externalOnSubmit 
}: PremiumPlateLookupFormProps) {
  const [internalPlate, setInternalPlate] = useState('');
  const [internalStateCode, setInternalStateCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Use external state if provided, otherwise use internal state
  const plate = externalPlate !== undefined ? externalPlate : internalPlate;
  const setPlate = externalSetPlate || setInternalPlate;
  const stateCode = externalStateCode !== undefined ? externalStateCode : internalStateCode;
  const setStateCode = externalSetStateCode || setInternalStateCode;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!plate || !stateCode) {
      toast.error('Please enter both license plate and state');
      return;
    }

    setIsLoading(true);
    
    try {
      // If external onSubmit is provided, use it
      if (externalOnSubmit) {
        externalOnSubmit();
        return;
      }

      // Otherwise, use internal logic
      toast.success('Processing premium plate lookup...');
      console.log('Premium plate lookup:', { plate, stateCode });
      
    } catch (error) {
      console.error('Premium plate lookup error:', error);
      toast.error('An error occurred while processing your plate lookup');
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
          Enter your license plate and state for comprehensive vehicle analysis with CARFAX data, auction comparisons, and AI-powered insights.
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
              <Select value={stateCode} onValueChange={setStateCode}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((state) => (
                    <SelectItem key={state.code} value={state.code}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Premium Features Include:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• CARFAX vehicle history report</li>
              <li>• Real-time auction data analysis</li>
              <li>• AI-powered condition assessment</li>
              <li>• Market trend predictions</li>
              <li>• Comprehensive valuation breakdown</li>
            </ul>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !plate || !stateCode}
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
