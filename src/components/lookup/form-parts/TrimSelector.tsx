
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VehicleTrim } from '@/types/vehicle';
import { Loader2 } from 'lucide-react';

interface TrimSelectorProps {
  trims: VehicleTrim[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export const TrimSelector: React.FC<TrimSelectorProps> = ({
  trims,
  value,
  onChange,
  disabled = false,
  isLoading = false
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="trim">Trim Level (Optional)</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
        disabled={disabled || isLoading}
      >
        <SelectTrigger id="trim">
          <SelectValue placeholder="Select trim">
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading trims...
              </div>
            ) : value ? (
              trims.find(trim => trim.id === value)?.trim_name || value
            ) : (
              "Select trim (optional)"
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">No specific trim</SelectItem>
          {trims.map((trim) => (
            <SelectItem key={trim.id} value={trim.id}>
              {trim.trim_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TrimSelector;
