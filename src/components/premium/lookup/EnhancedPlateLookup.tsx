
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { US_STATES, State } from '@/lib/states';
import { Search, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function EnhancedPlateLookup() {
  const [plate, setPlate] = useState('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!plate.trim()) {
      setError('Please enter a license plate number');
      return;
    }
    
    if (!selectedState) {
      setError('Please select a state');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      // In a real application, this would be an API call
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response
      const mockResult = {
        success: true,
        vehicle: {
          year: 2020,
          make: 'Toyota',
          model: 'Camry',
          trim: 'SE',
          engine: '2.5L 4-cylinder',
          transmission: 'Automatic',
          bodyType: 'Sedan',
          color: 'Silver'
        }
      };
      
      setResult(mockResult);
      toast.success('Vehicle found!');
    } catch (error) {
      console.error('Error looking up license plate:', error);
      setError('Failed to look up license plate. Please try again.');
      toast.error('Failed to look up license plate');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleStateChange = (state: string) => {
    setSelectedState(state);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">License Plate Lookup</h2>
        <p className="text-muted-foreground">
          Enter a license plate number and select the state to find vehicle details.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2 col-span-2">
            <label htmlFor="plate" className="block text-sm font-medium">
              License Plate Number
            </label>
            <Input
              id="plate"
              placeholder="Enter license plate (e.g., ABC123)"
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              className="w-full"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="state" className="block text-sm font-medium">
              State
            </label>
            <Select
              value={selectedState}
              onValueChange={handleStateChange}
              disabled={isLoading}
            >
              <SelectTrigger id="state">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((state: State) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        <Button 
          type="submit" 
          className="w-full md:w-auto"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Search
            </>
          )}
        </Button>
      </form>
      
      {result && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Vehicle Found</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
              <div>
                <p className="text-sm text-gray-500">Year</p>
                <p className="font-medium">{result.vehicle.year}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Make</p>
                <p className="font-medium">{result.vehicle.make}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Model</p>
                <p className="font-medium">{result.vehicle.model}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Trim</p>
                <p className="font-medium">{result.vehicle.trim}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Engine</p>
                <p className="font-medium">{result.vehicle.engine}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Transmission</p>
                <p className="font-medium">{result.vehicle.transmission}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Body Type</p>
                <p className="font-medium">{result.vehicle.bodyType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Color</p>
                <p className="font-medium">{result.vehicle.color}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <Button variant="default" className="w-full">
                Continue with this vehicle
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
