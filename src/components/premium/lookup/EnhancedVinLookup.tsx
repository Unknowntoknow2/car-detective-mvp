
import React, { useState } from 'react';
import { VinInput } from '@/components/premium/lookup/vin/VinInput';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { validateVin } from '@/utils/validation';
import { BasicVehicleInfo } from './form-parts/BasicVehicleInfo';

export function EnhancedVinLookup() {
  const [vin, setVin] = useState('');
  const [vinTouched, setVinTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVehicleFound, setIsVehicleFound] = useState(false);
  const [vehicleData, setVehicleData] = useState<any>(null);
  const [errors, setErrors] = useState<{vin?: string, api?: string}>({});
  
  // Vehicle form state
  const [formData, setFormData] = useState({
    makeId: '',
    model: '',
    year: '',
    mileage: '',
    zipCode: ''
  });

  const vinValidationError = vinTouched ? validateVin(vin) : null;
  const isVinValid = vin.length === 17 && !vinValidationError;
  
  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVin = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setVin(newVin);
    if (!vinTouched && newVin) {
      setVinTouched(true);
    }
    
    // Reset vehicle found state when VIN changes
    if (isVehicleFound) {
      setIsVehicleFound(false);
    }
  };
  
  const handleVinSubmit = async () => {
    if (!isVinValid) {
      setErrors({
        vin: 'Please enter a valid 17-character VIN'
      });
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // Simulate API call to lookup VIN
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, always "find" a vehicle
      setIsVehicleFound(true);
      setVehicleData({
        make: 'Toyota',
        model: 'Camry',
        year: '2020',
        trim: 'LE',
        engine: '2.5L 4-Cylinder'
      });
      
      // Pre-populate form with found data
      setFormData({
        makeId: 'toyota',
        model: 'Camry',
        year: '2020',
        mileage: '',
        zipCode: ''
      });
    } catch (error) {
      console.error('Error fetching VIN data:', error);
      setErrors({
        api: 'Failed to retrieve vehicle data. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleVinSubmit();
    }
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle valuation request
    console.log('Submitting valuation with data:', {
      vin,
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
          <h2 className="text-lg font-medium mb-2">Enter your Vehicle Identification Number</h2>
          <VinInput
            value={vin}
            onChange={handleVinChange}
            validationError={vinValidationError}
            externalError={errors.vin || errors.api}
            touched={vinTouched}
            isValid={isVinValid}
            isLoading={isLoading}
            onKeyPress={handleKeyPress}
          />
          <div className="mt-4">
            <Button 
              type="button"
              onClick={handleVinSubmit}
              disabled={!vin || isLoading}
              className="w-full"
            >
              {isLoading ? 'Looking up VIN...' : 'Lookup VIN'}
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

export default EnhancedVinLookup;
