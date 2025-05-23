
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { usStates } from '@/data/states';
import { fetchVehicleByPlate } from '@/services/vehicleLookupService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export interface PlateLookupProps {
  onSubmit: (plate: string, state: string) => void;
  isLoading?: boolean;
  onResultsReady?: (result: any) => void;
}

export const PlateLookup: React.FC<PlateLookupProps> = ({ 
  onSubmit, 
  isLoading = false,
  onResultsReady
}) => {
  const [plate, setPlate] = useState('');
  const [state, setState] = useState('CA');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!plate) {
      setError('Please enter a license plate');
      return;
    }
    
    if (!state) {
      setError('Please select a state');
      return;
    }
    
    setLoading(true);
    
    try {
      // Call the plate lookup service
      const result = await fetchVehicleByPlate(plate, state);
      
      // Store data in localStorage for follow-up steps
      localStorage.setItem('current_plate', plate);
      localStorage.setItem('current_state', state);
      
      // Call the parent's onSubmit handler
      onSubmit(plate, state);
      
      // If there's a results handler, call it with the result
      if (onResultsReady) {
        onResultsReady(result);
      }
      
      // Navigate to the follow-up questions page
      navigate(`/valuation-followup?plate=${plate}&state=${state}`);
    } catch (error: any) {
      console.error('Plate lookup error:', error);
      setError(error.message || 'Failed to lookup license plate. Please try again.');
      toast.error(error.message || 'Failed to lookup license plate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="plate">License Plate</Label>
        <Input
          id="plate"
          value={plate}
          onChange={(e) => {
            setPlate(e.target.value.toUpperCase());
            if (error) setError(null);
          }}
          placeholder="Enter plate number"
          className="uppercase"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="state">State</Label>
        <Select 
          value={state} 
          onValueChange={(value: string) => {
            setState(value);
            if (error) setError(null);
          }}
        >
          <SelectTrigger id="state">
            <SelectValue placeholder="Select state" />
          </SelectTrigger>
          <SelectContent>
            {usStates.map((state) => (
              <SelectItem key={state.value} value={state.value}>
                {state.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      
      <Button type="submit" className="w-full" disabled={isLoading || loading}>
        {(isLoading || loading) ? (
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
