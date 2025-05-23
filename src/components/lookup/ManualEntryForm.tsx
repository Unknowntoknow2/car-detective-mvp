
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { ArrowRight, Loader2 } from 'lucide-react';
import { VehicleDetailsInputs } from './form-parts/VehicleDetailsInputs';
import { ConditionAndFuelInputs } from './form-parts/ConditionAndFuelInputs';
import { ZipCodeInput } from './form-parts/ZipCodeInput';
import { ManualEntryFormData, ConditionLevel } from './types/manualEntry';

export interface ManualEntryFormProps {
  onSubmit: (data: ManualEntryFormData) => void;
  isLoading?: boolean;
  submitButtonText?: string;
  isPremium?: boolean;
}

export const ManualEntryForm: React.FC<ManualEntryFormProps> = ({
  onSubmit,
  isLoading = false,
  submitButtonText = "Get Valuation",
  isPremium = false
}) => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number | ''>(new Date().getFullYear());
  const [mileage, setMileage] = useState<number>(0);
  const [condition, setCondition] = useState<ConditionLevel>(ConditionLevel.Good);
  const [zipCode, setZipCode] = useState('');
  const [fuelType, setFuelType] = useState('Gasoline');
  const [transmission, setTransmission] = useState('Automatic');
  const [trim, setTrim] = useState('');
  const [color, setColor] = useState('');
  const [isValid, setIsValid] = useState(false);
  
  // Validate form fields
  useEffect(() => {
    const isValidForm = Boolean(
      make.trim() !== '' && 
      model.trim() !== '' && 
      zipCode.length === 5
    );
    setIsValid(isValidForm);
  }, [make, model, zipCode]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!make.trim()) {
      toast({
        title: "Please enter the vehicle make",
        variant: "destructive"
      });
      return;
    }
    
    if (!model.trim()) {
      toast({
        title: "Please enter the vehicle model",
        variant: "destructive"
      });
      return;
    }
    
    if (!zipCode || zipCode.length !== 5) {
      toast({
        title: "Please enter a valid ZIP code",
        variant: "destructive"
      });
      return;
    }
    
    const formattedData: ManualEntryFormData = {
      make,
      model,
      year: typeof year === 'number' ? year : new Date().getFullYear(),
      mileage: mileage || 0,
      condition,
      zipCode,
      fuelType,
      transmission,
      trim: trim || undefined,
      color: color || undefined
    };
    
    onSubmit(formattedData);
  };
  
  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-4">
            <VehicleDetailsInputs 
              make={make}
              setMake={setMake}
              model={model}
              setModel={setModel}
              year={year}
              setYear={setYear}
              mileage={mileage}
              setMileage={setMileage}
              trim={trim}
              setTrim={setTrim}
              color={isPremium ? color : ''}
              setColor={isPremium ? setColor : undefined}
            />
          </div>
          
          <div className="space-y-4">
            <ConditionAndFuelInputs 
              condition={condition}
              setCondition={setCondition}
              fuelType={fuelType}
              setFuelType={setFuelType}
              transmission={transmission}
              setTransmission={setTransmission}
            />
          </div>
          
          <div className="space-y-4">
            <ZipCodeInput 
              zipCode={zipCode}
              setZipCode={setZipCode}
            />
          </div>
        </CardContent>
        
        <CardFooter className="border-t p-6 bg-gray-50">
          <Button 
            type="submit"
            className="w-full" 
            disabled={isLoading || !isValid}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {submitButtonText} <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ManualEntryForm;
