import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ManualEntryFormData, ConditionLevel } from '@/components/lookup/types/manualEntry';
import { AutoCompleteVehicleSelector } from '@/components/lookup/form-parts/AutoCompleteVehicleSelector';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ArrowRight } from 'lucide-react';
import { ZipCodeInput } from '@/components/lookup/form-parts/ZipCodeInput';

export interface ManualLookupProps {
  onSubmit: (data: ManualEntryFormData) => void;
  isLoading?: boolean;
  submitButtonText?: string;
  isPremium?: boolean;
}

export const ManualLookup: React.FC<ManualLookupProps> = ({ 
  onSubmit,
  isLoading = false,
  submitButtonText = "Submit",
  isPremium = false
}) => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [mileage, setMileage] = useState<string>('');
  const [condition, setCondition] = useState<ConditionLevel>(ConditionLevel.Good);
  const [zipCode, setZipCode] = useState('');
  const [fuelType, setFuelType] = useState('Gasoline');
  const [transmission, setTransmission] = useState('Automatic');
  const [isFormValid, setIsFormValid] = useState(false);

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setYear(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!make || !model || !year || !zipCode) {
      return;
    }
    
    const formData: ManualEntryFormData = {
      make,
      model,
      year,
      mileage: parseInt(mileage) || 0,
      condition,
      zipCode,
      fuelType,
      transmission
    };
    
    onSubmit(formData);
  };

  // Validate form
  React.useEffect(() => {
    const isValid = Boolean(
      make && 
      model && 
      year > 1900 && 
      zipCode.length === 5
    );
    setIsFormValid(isValid);
  }, [make, model, year, zipCode]);

  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Manual Vehicle Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <AutoCompleteVehicleSelector
              selectedMake={make}
              setSelectedMake={setMake}
              selectedModel={model}
              setSelectedModel={setModel}
              disabled={isLoading}
              required={true}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={year}
                  onChange={handleYearChange}
                  min={1900}
                  max={new Date().getFullYear() + 1}
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mileage">Mileage</Label>
                <Input
                  id="mileage"
                  type="number"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  placeholder="e.g. 45000"
                  min={0}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select 
                  value={condition} 
                  onValueChange={(value) => setCondition(value as ConditionLevel)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="condition">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ConditionLevel.Excellent}>Excellent</SelectItem>
                    <SelectItem value={ConditionLevel.VeryGood}>Very Good</SelectItem>
                    <SelectItem value={ConditionLevel.Good}>Good</SelectItem>
                    <SelectItem value={ConditionLevel.Fair}>Fair</SelectItem>
                    <SelectItem value={ConditionLevel.Poor}>Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type</Label>
                <Select 
                  value={fuelType} 
                  onValueChange={setFuelType}
                  disabled={isLoading}
                >
                  <SelectTrigger id="fuelType">
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gasoline">Gasoline</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                    <SelectItem value="Flex Fuel">Flex Fuel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transmission">Transmission</Label>
                <Select 
                  value={transmission} 
                  onValueChange={setTransmission}
                  disabled={isLoading}
                >
                  <SelectTrigger id="transmission">
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="CVT">CVT</SelectItem>
                    <SelectItem value="Semi-Automatic">Semi-Automatic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <ZipCodeInput
                  zipCode={zipCode}
                  setZipCode={setZipCode}
                  isDisabled={isLoading}
                />
              </div>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full mt-6" 
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
              </>
            ) : (
              <>
                {submitButtonText} <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ManualLookup;
