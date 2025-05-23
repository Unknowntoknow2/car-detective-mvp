
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { BasicVehicleInfo } from '@/components/premium/lookup/form-parts/BasicVehicleInfo';

export function EnhancedPlateLookup() {
  const [plateNumber, setPlateNumber] = useState('');
  const [stateCode, setStateCode] = useState('');
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

  const states = [
    { value: 'CA', label: 'California' },
    { value: 'NY', label: 'New York' },
    { value: 'TX', label: 'Texas' },
    { value: 'FL', label: 'Florida' },
    { value: 'IL', label: 'Illinois' }
  ];

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlateNumber(e.target.value.toUpperCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    const newErrors: Record<string, string> = {};
    
    if (!plateNumber) {
      newErrors.plate = 'License plate is required';
    }
    
    if (!stateCode) {
      newErrors.state = 'State is required';
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
      
      // Mock response
      setVehicle({
        makeId: '2',
        model: 'Camry',
        year: '2020',
        mileage: '30000',
        zipCode: ''
      });
      
      toast.success('Vehicle information retrieved successfully');
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error looking up plate:', error);
      setErrors({ plate: 'Failed to lookup plate. Please try again.' });
      toast.error('Error looking up license plate');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">License Plate Lookup</h2>
        <p className="text-muted-foreground">
          Enter your license plate information to retrieve vehicle details.
        </p>
      </div>
      
      {!isSubmitted ? (
        <Card>
          <CardHeader>
            <CardTitle>Enter License Plate</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="plate">License Plate</Label>
                <Input
                  id="plate"
                  value={plateNumber}
                  onChange={handlePlateChange}
                  placeholder="Enter plate number"
                  className={errors.plate ? 'border-red-300' : ''}
                />
                {errors.plate && (
                  <p className="text-sm text-red-500">{errors.plate}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select
                  value={stateCode}
                  onValueChange={setStateCode}
                >
                  <SelectTrigger 
                    id="state"
                    className={errors.state ? 'border-red-300' : ''}
                  >
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
                {errors.state && (
                  <p className="text-sm text-red-500">{errors.state}</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading || !plateNumber || !stateCode}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Looking up plate...
                  </>
                ) : (
                  'Lookup Plate'
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
