
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
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/30">
            Alternative
          </Badge>
          <p className="text-sm text-slate-500">Simple & Convenient</p>
        </div>
        
        <Input 
          value={plateValue}
          onChange={(e) => onPlateChange?.(e.target.value.toUpperCase())}
          placeholder="Enter License Plate (e.g., ABC123)" 
          className="text-lg font-mono tracking-wide uppercase h-12" 
        />
        
        <div className="pt-1">
          <Select
            value={stateValue}
            onValueChange={(value) => onStateChange?.(value)}
          >
            <SelectTrigger className="w-full h-12">
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((state) => (
                <SelectItem key={state.value} value={state.value} className="py-3">
                  {state.label} ({state.value})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-start gap-2 text-xs text-slate-500">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <p>
            Enter your license plate and state. This works best for vehicles registered in the United States.
          </p>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={onLookup}
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
