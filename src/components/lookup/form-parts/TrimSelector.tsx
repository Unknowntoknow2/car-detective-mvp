
import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchTrimOptions } from '@/services/vehicleLookupService';
import { Loader2 } from 'lucide-react';

interface TrimSelectorProps {
  make?: string;
  model?: string;
  year?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const TrimSelector: React.FC<TrimSelectorProps> = ({
  make,
  model,
  year,
  value,
  onChange,
  disabled = false
}) => {
  const [trimOptions, setTrimOptions] = useState<string[]>(['Standard']);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadTrimOptions() {
      // Only load trim options if we have all the required data
      if (make && model && year) {
        setLoading(true);
        try {
          const options = await fetchTrimOptions(make, model, year);
          setTrimOptions(options);
        } catch (error) {
          console.error('Error loading trim options:', error);
          // Fallback to defaults
          setTrimOptions(['Standard', 'Deluxe', 'Premium', 'Sport']);
        } finally {
          setLoading(false);
        }
      }
    }

    loadTrimOptions();
  }, [make, model, year]);

  return (
    <div className="space-y-2">
      <Label htmlFor="trim">Trim Level</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
        disabled={disabled || loading}
      >
        <SelectTrigger id="trim">
          <SelectValue placeholder="Select trim">
            {loading ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading trims...
              </div>
            ) : value}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {trimOptions.map((trim) => (
            <SelectItem key={trim} value={trim}>
              {trim}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TrimSelector;
