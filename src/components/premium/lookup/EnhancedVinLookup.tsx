
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { VinSubmitButton } from './VinSubmitButton';
import { toast } from 'sonner';
import { Loader2, AlertCircle, Search, CheckCircle2 } from 'lucide-react';

export function EnhancedVinLookup() {
  const [vin, setVin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic VIN validation (17 characters)
    if (!vin.trim() || vin.trim().length !== 17) {
      setError('Please enter a valid 17-character VIN');
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
          year: 2019,
          make: 'Honda',
          model: 'Accord',
          trim: 'EX-L',
          engine: '1.5L Turbo',
          transmission: 'CVT',
          bodyType: 'Sedan',
          color: 'Black'
        }
      };
      
      setResult(mockResult);
      toast.success('Vehicle found!');
    } catch (error) {
      console.error('Error looking up VIN:', error);
      setError('Failed to look up VIN. Please try again.');
      toast.error('Failed to look up VIN');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">VIN Lookup</h2>
        <p className="text-muted-foreground">
          Enter your Vehicle Identification Number (VIN) to get a detailed valuation.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="vin" className="block text-sm font-medium">
            Vehicle Identification Number (VIN)
          </label>
          <div className="flex">
            <Input
              id="vin"
              placeholder="Enter VIN (e.g., 1HGBH41JXMN109186)"
              value={vin}
              onChange={(e) => setVin(e.target.value)}
              className="flex-1 rounded-r-none"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              className="rounded-l-none"
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
          </div>
          <p className="text-xs text-muted-foreground">
            Your VIN is a 17-character code that can be found on your vehicle registration, insurance card, or driver's side door jamb.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}
      </form>
      
      {result && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center mb-4 text-green-700">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <h3 className="text-lg font-medium">Vehicle Found</h3>
            </div>
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
