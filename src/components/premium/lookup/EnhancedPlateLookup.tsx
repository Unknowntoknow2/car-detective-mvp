
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { FormValidationError } from '@/components/premium/common/FormValidationError';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BasicVehicleInfo } from './form-parts/BasicVehicleInfo';
import { usStates } from '@/data/states';

export function EnhancedPlateLookup() {
  const [plateNumber, setPlateNumber] = useState('');
  const [state, setState] = useState('');
  const [plateNumberTouched, setPlateNumberTouched] = useState(false);
  const [stateTouched, setStateTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVehicleFound, setIsVehicleFound] = useState(false);
  const [vehicleData, setVehicleData] = useState<any>(null);
  const [errors, setErrors] = useState<{plateNumber?: string, state?: string, api?: string}>({});
  
  // Vehicle form state
  const [formData, setFormData] = useState({
    makeId: '',
    model: '',
    year: '',
    mileage: '',
    zipCode: ''
  });

  // Simple validation
  const validatePlateNumber = (value: string) => {
    if (!value) return 'License plate number is required';
    if (value.length < 2) return 'License plate number is too short';
    return null;
  };
  
  const validateState = (value: string) => {
    if (!value) return 'State is required';
    return null;
  };
  
  const plateNumberValidationError = plateNumberTouched ? validatePlateNumber(plateNumber) : null;
  const stateValidationError = stateTouched ? validateState(state) : null;
  
  const isFormValid = !plateNumberValidationError && !stateValidationError && plateNumber && state;
  
  const handlePlateNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPlateNumber = e.target.value.toUpperCase();
    setPlateNumber(newPlateNumber);
    if (!plateNumberTouched && newPlateNumber) {
      setPlateNumberTouched(true);
    }
    
    // Reset vehicle found state when plate changes
    if (isVehicleFound) {
      setIsVehicleFound(false);
    }
  };
  
  const handleStateChange = (value: string) => {
    setState(value);
    if (!stateTouched) {
      setStateTouched(true);
    }
    
    // Reset vehicle found state when state changes
    if (isVehicleFound) {
      setIsVehicleFound(false);
    }
  };
  
  const handlePlateSubmit = async () => {
    if (!isFormValid) {
      setErrors({
        plateNumber: plateNumberValidationError,
        state: stateValidationError
      });
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // Simulate API call to lookup plate
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, always "find" a vehicle
      setIsVehicleFound(true);
      setVehicleData({
        make: 'Honda',
        model: 'Accord',
        year: '2019',
        trim: 'EX',
        engine: '1.5L Turbo 4-Cylinder'
      });
      
      // Pre-populate form with found data
      setFormData({
        makeId: 'honda',
        model: 'Accord',
        year: '2019',
        mileage: '',
        zipCode: ''
      });
    } catch (error) {
      console.error('Error fetching plate data:', error);
      setErrors({
        api: 'Failed to retrieve vehicle data. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle valuation request
    console.log('Submitting valuation with data:', {
      plateNumber,
      state,
      ...formData
    });
  };
  
  const handleYearChange = (year: string | number) => {
    setFormData(prev => ({
      ...prev,
      year: String(year)
    }));
  };
  
  return (
    <form onSubmit={handleFormSubmit}>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium mb-2">Enter your License Plate Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="plateNumber">License Plate Number</Label>
              <Input
                id="plateNumber"
                value={plateNumber}
                onChange={handlePlateNumberChange}
                placeholder="Enter plate number"
                className={plateNumberValidationError ? 'border-red-500' : ''}
              />
              {plateNumberValidationError && (
                <FormValidationError error={plateNumberValidationError} />
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select value={state} onValueChange={handleStateChange}>
                <SelectTrigger id="state" className={stateValidationError ? 'border-red-500' : ''}>
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
              {stateValidationError && (
                <FormValidationError error={stateValidationError} />
              )}
            </div>
          </div>
          
          {errors.api && (
            <div className="mt-2">
              <FormValidationError error={errors.api} />
            </div>
          )}
          
          <div className="mt-4">
            <Button 
              type="button"
              onClick={handlePlateSubmit}
              disabled={!isFormValid || isLoading}
              className="w-full"
            >
              {isLoading ? 'Looking up Plate...' : 'Lookup Plate'}
            </Button>
          </div>
        </div>
        
        {isVehicleFound && (
          <Card className="p-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Vehicle Found</h3>
              <p className="text-sm text-muted-foreground">
                {vehicleData.year} {vehicleData.make} {vehicleData.model} {vehicleData.trim}
              </p>
            </div>
            
            <div className="space-y-6">
              <BasicVehicleInfo
                selectedMakeId={formData.makeId}
                setSelectedMakeId={(makeId) => setFormData(prev => ({ ...prev, makeId }))}
                selectedModel={formData.model}
                setSelectedModel={(model) => setFormData(prev => ({ ...prev, model }))}
                selectedYear={formData.year}
                setSelectedYear={handleYearChange}
                mileage={formData.mileage}
                setMileage={(mileage) => setFormData(prev => ({ ...prev, mileage }))}
                zipCode={formData.zipCode}
                setZipCode={(zipCode) => setFormData(prev => ({ ...prev, zipCode }))}
                isDisabled={false}
              />
              
              <Button type="submit" className="w-full">
                Get Valuation
              </Button>
            </div>
          </Card>
        )}
      </div>
    </form>
  );
}

export default EnhancedPlateLookup;
