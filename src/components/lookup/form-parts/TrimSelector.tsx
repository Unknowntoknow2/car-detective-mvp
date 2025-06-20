
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { VehicleTrim } from '@/types/vehicle';

interface TrimSelectorProps {
  trims: VehicleTrim[];
  selectedTrim?: string;
  onTrimChange: (trim: string) => void;
  isLoading?: boolean;
}

export function TrimSelector({ trims, selectedTrim, onTrimChange, isLoading }: TrimSelectorProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>Trim Level</Label>
        <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!trims || trims.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="trim">Trim Level</Label>
      <Select value={selectedTrim} onValueChange={onTrimChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select trim level" />
        </SelectTrigger>
        <SelectContent>
          {trims.map((trim) => (
            <SelectItem key={trim.id} value={trim.name}>
              {trim.name}
              {trim.msrp && (
                <span className="text-gray-500 ml-2">
                  (MSRP: ${trim.msrp.toLocaleString()})
                </span>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
