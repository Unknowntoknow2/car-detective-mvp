
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { states } from '@/data/us-states';

interface PlateDecoderFormProps {
  onSubmit?: (plate: string, state: string) => void;
  onManualEntryClick?: () => void;
}

export default function PlateDecoderForm({ onSubmit, onManualEntryClick }: PlateDecoderFormProps) {
  const [plate, setPlate] = useState('');
  const [state, setState] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!plate || !state) {
      return;
    }
    
    if (onSubmit) {
      onSubmit(plate, state);
      return;
    }
    
    // Default handling if no onSubmit provided
    setIsLoading(true);
    // Simulate processing
    setTimeout(() => {
      setIsLoading(false);
      if (onManualEntryClick) {
        onManualEntryClick();
      }
    }, 1500);
  };

  return (
    <Card className="p-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="plate">License Plate</Label>
          <Input
            id="plate"
            value={plate}
            onChange={(e) => setPlate(e.target.value.toUpperCase())}
            placeholder="Enter license plate"
            className="uppercase"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Select
            value={state}
            onValueChange={setState}
          >
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
        
        <Button type="submit" className="w-full" disabled={isLoading || !plate || !state}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Looking up...
            </>
          ) : (
            'Lookup Vehicle'
          )}
        </Button>
      </form>
    </Card>
  );
}
