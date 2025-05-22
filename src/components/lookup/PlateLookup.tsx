
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { states } from '@/data/states';

export interface PlateLookupProps {
  onSubmit: (plate: string, state: string) => void;
  isLoading?: boolean; // Add the isLoading prop
}

export const PlateLookup: React.FC<PlateLookupProps> = ({ onSubmit, isLoading = false }) => {
  const [plate, setPlate] = useState('');
  const [state, setState] = useState('CA');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(plate, state);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="plate">License Plate</Label>
        <Input
          id="plate"
          value={plate}
          onChange={(e) => setPlate(e.target.value.toUpperCase())}
          placeholder="Enter plate number"
          className="uppercase"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="state">State</Label>
        <Select value={state} onValueChange={setState}>
          <SelectTrigger id="state">
            <SelectValue placeholder="Select state" />
          </SelectTrigger>
          <SelectContent>
            {states.map((state) => (
              <SelectItem key={state.value} value={state.value}>
                {state.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
          </>
        ) : (
          'Lookup Plate'
        )}
      </Button>
    </form>
  );
};

export default PlateLookup;
