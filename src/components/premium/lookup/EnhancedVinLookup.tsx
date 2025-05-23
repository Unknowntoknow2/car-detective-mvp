
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { BasicVehicleInfo } from '@/components/premium/lookup/form-parts/BasicVehicleInfo';

export function EnhancedVinLookup() {
  const [vin, setVin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [vehicle, setVehicle] = useState({
    makeId: '',
    model: '',
    year: '',
    mileage: '',
    zipCode: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVin(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate VIN
    if (!vin || vin.length !== 17) {
      setErrors({ vin: 'Please enter a valid 17-character VIN' });
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response
      setVehicle({
        makeId: '1',
        model: 'Accord',
        year: '2019',
        mileage: '45000',
        zipCode: ''
      });
      
      toast.success('Vehicle information retrieved successfully');
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error looking up VIN:', error);
      setErrors({ vin: 'Failed to lookup VIN. Please try again.' });
      toast.error('Error looking up VIN');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">VIN Lookup</h2>
        <p className="text-muted-foreground">
          Enter your Vehicle Identification Number (VIN) to retrieve vehicle details.
        </p>
      </div>
      
      {!isSubmitted ? (
        <Card>
          <CardHeader>
            <CardTitle>Enter VIN</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vin">Vehicle Identification Number (VIN)</Label>
                <Input
                  id="vin"
                  value={vin}
                  onChange={handleVinChange}
                  placeholder="e.g. 1HGCM82633A123456"
                  className={errors.vin ? 'border-red-300' : ''}
                  maxLength={17}
                />
                {errors.vin && (
                  <p className="text-sm text-red-500">{errors.vin}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  The VIN is a 17-character code that can be found on your vehicle registration, insurance card, or on the driver's side dashboard.
                </p>
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading || vin.length !== 17}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Looking up VIN...
                  </>
                ) : (
                  'Lookup VIN'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent>
            <BasicVehicleInfo
              selectedMakeId={vehicle.makeId}
              setSelectedMakeId={(id) => setVehicle(prev => ({ ...prev, makeId: id }))}
              selectedModel={vehicle.model}
              setSelectedModel={(model) => setVehicle(prev => ({ ...prev, model }))}
              selectedYear={vehicle.year}
              setSelectedYear={(year) => setVehicle(prev => ({ ...prev, year }))}
              mileage={vehicle.mileage}
              setMileage={(mileage) => setVehicle(prev => ({ ...prev, mileage }))}
              zipCode={vehicle.zipCode}
              setZipCode={(zipCode) => setVehicle(prev => ({ ...prev, zipCode }))}
              errors={errors}
            />
            
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={() => setIsSubmitted(false)}
                variant="outline" 
                className="mr-2"
              >
                Back
              </Button>
              <Button>
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
