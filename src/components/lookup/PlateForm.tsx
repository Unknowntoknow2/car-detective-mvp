
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PlateFormProps {
  onSubmit: (plate: string, state: string) => void;
  isLoading?: boolean;
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
  // Add more states as needed
];

export const PlateForm: React.FC<PlateFormProps> = ({ onSubmit, isLoading = false }) => {
  const [plate, setPlate] = useState('');
  const [state, setState] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!plate.trim()) {
      setError('Please enter a license plate number');
      return;
    }
    
    if (!state) {
      setError('Please select a state');
      return;
    }
    
    setError(null);
    onSubmit(plate.trim().toUpperCase(), state);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="plate">License Plate Number</Label>
        <Input
          id="plate"
          type="text"
          value={plate}
          onChange={(e) => setPlate(e.target.value)}
          placeholder="Enter plate number"
          className={error ? 'border-red-500' : ''}
        />
      </div>
      
      <div>
        <Label htmlFor="state">State</Label>
        <Select value={state} onValueChange={setState}>
          <SelectTrigger>
            <SelectValue placeholder="Select state" />
          </SelectTrigger>
          <SelectContent>
            {US_STATES.map((s) => (
              <SelectItem key={s.code} value={s.code}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      <Button 
        type="submit" 
        disabled={!plate || !state || isLoading}
        className="w-full"
      >
        {isLoading ? 'Looking up...' : 'Look up Vehicle'}
      </Button>
    </form>
  );
};

export default PlateForm;
