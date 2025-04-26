
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, AlertCircle, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface PlateLookupProps {
  plateValue?: string;
  stateValue?: string;
  onPlateChange?: (value: string) => void;
  onStateChange?: (value: string) => void;
  onLookup?: () => void;
  isLoading?: boolean;
}

export function PlateLookup({ 
  plateValue = "", 
  stateValue = "", 
  onPlateChange, 
  onStateChange, 
  onLookup, 
  isLoading = false 
}: PlateLookupProps) {
  const states = [
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
    { value: "HI", label: "Hawaii" },
    { value: "ID", label: "Idaho" },
    { value: "IL", label: "Illinois" },
    { value: "IN", label: "Indiana" },
    { value: "IA", label: "Iowa" },
    { value: "KS", label: "Kansas" },
    { value: "KY", label: "Kentucky" },
    { value: "LA", label: "Louisiana" },
    { value: "ME", label: "Maine" },
    { value: "MD", label: "Maryland" },
    { value: "MA", label: "Massachusetts" },
    { value: "MI", label: "Michigan" },
    { value: "MN", label: "Minnesota" },
    { value: "MS", label: "Mississippi" },
    { value: "MO", label: "Missouri" },
    { value: "MT", label: "Montana" },
    { value: "NE", label: "Nebraska" },
    { value: "NV", label: "Nevada" },
    { value: "NH", label: "New Hampshire" },
    { value: "NJ", label: "New Jersey" },
    { value: "NM", label: "New Mexico" },
    { value: "NY", label: "New York" },
    { value: "NC", label: "North Carolina" },
    { value: "ND", label: "North Dakota" },
    { value: "OH", label: "Ohio" },
    { value: "OK", label: "Oklahoma" },
    { value: "OR", label: "Oregon" },
    { value: "PA", label: "Pennsylvania" },
    { value: "RI", label: "Rhode Island" },
    { value: "SC", label: "South Carolina" },
    { value: "SD", label: "South Dakota" },
    { value: "TN", label: "Tennessee" },
    { value: "TX", label: "Texas" },
    { value: "UT", label: "Utah" },
    { value: "VT", label: "Vermont" },
    { value: "VA", label: "Virginia" },
    { value: "WA", label: "Washington" },
    { value: "WV", label: "West Virginia" },
    { value: "WI", label: "Wisconsin" },
    { value: "WY", label: "Wyoming" },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/30">
          <Search className="h-3.5 w-3.5 mr-1" />
          License Plate
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-slate-700">License Plate</Label>
          <Input 
            value={plateValue}
            onChange={(e) => onPlateChange?.(e.target.value)}
            placeholder="Enter plate number" 
            className="text-lg font-mono tracking-wide border-slate-300 h-12" 
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-slate-700">State</Label>
          <Select value={stateValue} onValueChange={onStateChange}>
            <SelectTrigger className="border-slate-300 h-12">
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {states.map((state) => (
                <SelectItem key={state.value} value={state.value}>
                  {state.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex items-start gap-2 text-xs text-slate-500">
        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <p>
          Enter the full license plate number exactly as it appears on the vehicle. Special characters and spaces should be included.
        </p>
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
              Looking up Plate...
            </>
          ) : (
            "Look up Vehicle"
          )}
        </Button>
      </div>
    </div>
  );
}
