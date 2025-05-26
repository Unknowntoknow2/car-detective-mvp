
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useValuation } from '@/hooks/useValuation';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { usStates } from '@/data/states';

interface PlateDecoderFormProps {
  onManualEntryClick: () => void;
}

const PlateDecoderForm: React.FC<PlateDecoderFormProps> = ({ onManualEntryClick }) => {
  const [plate, setPlate] = useState('');
  const [state, setState] = useState('');
  const { decodePlate, isLoading } = useValuation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!plate || !state) {
      toast.error('Please enter both license plate and state');
      return;
    }

    try {
      console.log('Starting plate lookup for:', plate, state);
      const result = await decodePlate(plate, state);
      
      if (result && result.success && result.data) {
        console.log('Plate lookup successful:', result.data);
        
        // Store data for follow-up steps
        localStorage.setItem('current_plate', plate);
        localStorage.setItem('current_state', state);
        
        // Navigate to valuation follow-up
        navigate(`/valuation-followup?plate=${plate}&state=${state}`);
        toast.success('Vehicle information found successfully');
      } else {
        const errorMessage = result?.error || 'Failed to lookup license plate';
        console.error('Plate lookup failed:', errorMessage);
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error('Plate lookup error:', error);
      toast.error('An unexpected error occurred during plate lookup');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>License Plate Lookup</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plate">License Plate</Label>
            <Input
              id="plate"
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              placeholder="Enter license plate"
              className="uppercase"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select value={state} onValueChange={setState} required>
              <SelectTrigger id="state">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {usStates.map((stateOption) => (
                  <SelectItem key={stateOption.value} value={stateOption.value}>
                    {stateOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Looking up...' : 'Get Vehicle Details'}
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            className="w-full"
            onClick={onManualEntryClick}
          >
            Manual Entry Instead
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PlateDecoderForm;
