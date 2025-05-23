import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { states } from '@/lib/states';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export function EnhancedPlateLookup() {
  const [plateNumber, setPlateNumber] = useState('');
  const [state, setState] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!plateNumber.trim()) {
      setError('Please enter a license plate number');
      return;
    }
    
    if (!state) {
      setError('Please select a state');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      // In a real app, this would make an API call to look up the plate
      // For now, simulate a successful lookup with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to results page (in a real app, this would include the lookup ID)
      navigate('/results?source=premium');
      
      toast({
        title: "Vehicle found!",
        description: "We've found your vehicle based on the plate information.",
      });
    } catch (err) {
      console.error('Error looking up plate:', err);
      setError('Failed to look up license plate. Please try again.');
      
      toast({
        title: "Lookup failed",
        description: "We couldn't find a vehicle with that plate number. Please check and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">License Plate Lookup</h2>
        <p className="text-muted-foreground">
          Enter your license plate number and select the state to get a detailed valuation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="plateNumber" className="text-sm font-medium text-slate-700">
              License Plate Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="plateNumber"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
              placeholder="Enter plate number"
              className="h-10"
              maxLength={10}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state" className="text-sm font-medium text-slate-700">
              State <span className="text-red-500">*</span>
            </Label>
            <Select
              value={state}
              onValueChange={setState}
              disabled={isLoading}
            >
              <SelectTrigger id="state" className="h-10">
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

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </form>

      <div className="text-sm text-muted-foreground">
        <p>
          Note: Premium plate lookup provides enhanced vehicle details including
          trim level, factory options, and more accurate valuation.
        </p>
      </div>
    </div>
  );
}
