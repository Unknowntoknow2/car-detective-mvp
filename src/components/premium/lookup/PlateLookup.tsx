
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  { value: 'DC', label: 'District of Columbia' }
];

interface PlateLookupProps {
  plateValue?: string;
  stateValue?: string;
  isLoading?: boolean;
  onPlateChange?: (value: string) => void;
  onStateChange?: (value: string) => void;
  onLookup?: () => void;
}

export function PlateLookup({ 
  plateValue = "", 
  stateValue = "", 
  isLoading = false, 
  onPlateChange, 
  onStateChange, 
  onLookup 
}: PlateLookupProps) {
  const [error, setError] = useState<string | null>(null);

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only letters and numbers, convert to uppercase
    const formattedValue = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (onPlateChange) onPlateChange(formattedValue);
    if (error) setError(null);
  };

  const handleStateChange = (value: string) => {
    if (onStateChange) onStateChange(value);
    if (error) setError(null);
  };

  const handleSubmit = () => {
    if (!plateValue) {
      setError("Please enter a license plate number");
      return;
    }
    if (!stateValue) {
      setError("Please select a state");
      return;
    }
    if (onLookup) onLookup();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">
            Quick Lookup
          </Badge>
          <p className="text-sm text-slate-500">Simple & Fast</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="plate" className="block text-sm font-medium text-slate-700 mb-1">
              License Plate
            </label>
            <Input 
              id="plate"
              value={plateValue}
              onChange={handlePlateChange}
              placeholder="Enter plate number" 
              className="text-lg tracking-wide h-12 uppercase" 
              maxLength={8}
            />
          </div>
          
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-slate-700 mb-1">
              State
            </label>
            <Select value={stateValue} onValueChange={handleStateChange}>
              <SelectTrigger id="state" className="h-12">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {error && (
          <div className="flex items-start gap-2 text-red-600 text-sm mt-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
        
        <div className="flex items-start gap-2 text-xs text-slate-500 mt-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <p>
            For privacy and security reasons, only limited vehicle information is available with
            license plate lookup. For complete details, use VIN lookup.
          </p>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit}
          disabled={isLoading || !plateValue || !stateValue}
          className="px-6"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Looking up plate...
            </>
          ) : (
            "Look up Vehicle"
          )}
        </Button>
      </div>
    </div>
  );
}
