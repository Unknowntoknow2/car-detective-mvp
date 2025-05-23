
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useVehicleData } from '@/hooks/useVehicleData';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { BasicVehicleInfo } from './form-parts/BasicVehicleInfo';

export function PremiumManualLookup() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [vehicle, setVehicle] = useState({
    makeId: '',
    model: '',
    year: '',
    mileage: '',
    zipCode: ''
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    const newErrors: Record<string, string> = {};
    
    if (!vehicle.makeId) {
      newErrors.make = 'Make is required';
    }
    
    if (!vehicle.model) {
      newErrors.model = 'Model is required';
    }
    
    if (!vehicle.year) {
      newErrors.year = 'Year is required';
    }
    
    if (!vehicle.mileage) {
      newErrors.mileage = 'Mileage is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Added: ${vehicle.year} ${vehicle.makeId} ${vehicle.model}`);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting vehicle data:', error);
      toast.error('Failed to add vehicle');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Manual Entry</h2>
        <p className="text-muted-foreground">
          Enter your vehicle details manually to get a premium valuation.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Enter Vehicle Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <BasicVehicleInfo
              selectedMakeId={vehicle.makeId}
              setSelectedMakeId={(id) => setVehicle(prev => ({ ...prev, makeId: id }))}
              selectedModel={vehicle.model}
              setSelectedModel={(model) => setVehicle(prev => ({ ...prev, model }))}
              selectedYear={vehicle.year}
              setSelectedYear={(year) => setVehicle(prev => ({ ...prev, year: String(year) }))}
              mileage={vehicle.mileage}
              setMileage={(mileage) => setVehicle(prev => ({ ...prev, mileage }))}
              zipCode={vehicle.zipCode}
              setZipCode={(zipCode) => setVehicle(prev => ({ ...prev, zipCode }))}
              isDisabled={isLoading}
              errors={errors}
            />
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Continue with this vehicle"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {isSubmitted && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Vehicle Added</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
              <div>
                <p className="text-sm text-gray-500">Year</p>
                <p className="font-medium">{vehicle.year}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Make</p>
                <p className="font-medium">{vehicle.makeId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Model</p>
                <p className="font-medium">{vehicle.model}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mileage</p>
                <p className="font-medium">{vehicle.mileage}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <Button variant="default" className="w-full" onClick={() => window.location.href = "/premium/form"}>
                Continue to full valuation form
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
