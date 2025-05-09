import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { states } from '@/components/premium/lookup/shared/states-data'; // Changed from US_STATES to states

export const EnhancedPlateForm = () => {
  const [plateNumber, setPlateNumber] = React.useState('');
  const [stateCode, setStateCode] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Looking up plate:', plateNumber, 'in state:', stateCode);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>License Plate Lookup</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plate">License Plate</Label>
              <Input
                id="plate"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                placeholder="Enter plate number"
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select onValueChange={setStateCode} value={stateCode}>
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
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !plateNumber || !stateCode}
          >
            {isLoading ? 'Looking up...' : 'Lookup Plate'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnhancedPlateForm;
