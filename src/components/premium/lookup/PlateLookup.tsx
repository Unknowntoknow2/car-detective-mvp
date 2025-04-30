
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2, CheckCircle2, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  // Simple plate validation
  const validatePlate = (plate: string): boolean => {
    // Basic validation - most states have 5-8 characters
    return plate.length >= 2 && plate.length <= 8;
  };
  
  const isValid = validatePlate(plateValue) && !!stateValue;
  
  const handlePlateChange = (value: string) => {
    // Convert to uppercase and remove spaces
    const formattedValue = value.toUpperCase().replace(/\s/g, '');
    onPlateChange?.(formattedValue);
    
    // Validate as user types
    if (formattedValue && !validatePlate(formattedValue)) {
      setError("License plate format is invalid");
    } else {
      setError(null);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/30">
            Alternative
          </Badge>
          <p className="text-sm text-slate-500">Simple & Convenient</p>
        </div>
        
        <div className="relative">
          <Input 
            value={plateValue}
            onChange={(e) => handlePlateChange(e.target.value)}
            placeholder={isMobile ? "Enter License Plate" : "Enter License Plate (e.g., ABC123)"}
            className={`text-base md:text-lg font-mono tracking-wide uppercase h-10 md:h-12 ${
              error ? 'border-red-500 focus-visible:ring-red-500' : 
              isValid && plateValue ? 'border-green-500 focus-visible:ring-green-500' : ''
            }`}
          />
          {isValid && plateValue && stateValue && !isLoading && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
          )}
        </div>
        
        <div className="pt-1">
          <Select
            value={stateValue}
            onValueChange={(value) => {
              onStateChange?.(value);
              // Clear any error when state is selected
              if (error && validatePlate(plateValue)) {
                setError(null);
              }
            }}
          >
            <SelectTrigger className={`w-full h-10 md:h-12 ${
              !stateValue ? '' : 'border-green-500 focus-visible:ring-green-500'
            }`}>
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {US_STATES.map((state) => (
                <SelectItem key={state.value} value={state.value} className="py-2 md:py-3">
                  {isMobile ? `${state.value}` : `${state.label} (${state.value})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {error ? (
          <div className="flex items-start gap-2 text-xs text-red-500">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="flex items-start gap-2 text-xs text-slate-500">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>
              {isMobile ? 
                "Enter plate and state for US vehicles." : 
                "Enter your license plate and state. This works best for vehicles registered in the United States."}
            </p>
          </div>
        )}
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={onLookup}
          disabled={isLoading || !isValid}
          className="w-full md:w-auto px-4 md:px-6 h-10 md:h-11"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isMobile ? "Looking up..." : "Looking up plate..."}
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Look up Vehicle
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
