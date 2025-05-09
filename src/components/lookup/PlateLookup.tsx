
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PlateLookupProps {
  onSubmit?: (plate: string, state: string) => void;
  isLoading?: boolean;
}

export function PlateLookup({ onSubmit, isLoading = false }: PlateLookupProps) {
  const [plate, setPlate] = useState('');
  const [state, setState] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!plate) {
      setError('Please enter a license plate');
      return;
    }
    
    if (!state) {
      setError('Please select a state');
      return;
    }
    
    setError(null);
    
    if (onSubmit) {
      onSubmit(plate, state);
    } else {
      toast.info(`Looking up plate ${plate} from ${state}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="plate" className="text-sm font-medium block">
          License Plate
        </label>
        <Input
          id="plate"
          value={plate}
          onChange={(e) => setPlate(e.target.value.toUpperCase())}
          placeholder="Enter license plate"
          className="uppercase"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="state" className="text-sm font-medium block">
          State
        </label>
        <Select value={state} onValueChange={setState}>
          <SelectTrigger id="state">
            <SelectValue placeholder="Select state" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AL">Alabama</SelectItem>
            <SelectItem value="AK">Alaska</SelectItem>
            <SelectItem value="AZ">Arizona</SelectItem>
            <SelectItem value="AR">Arkansas</SelectItem>
            <SelectItem value="CA">California</SelectItem>
            <SelectItem value="CO">Colorado</SelectItem>
            <SelectItem value="CT">Connecticut</SelectItem>
            {/* Add more states as needed */}
          </SelectContent>
        </Select>
      </div>
      
      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Looking up plate...
          </>
        ) : (
          'Get Vehicle Details'
        )}
      </Button>
    </form>
  );
}
