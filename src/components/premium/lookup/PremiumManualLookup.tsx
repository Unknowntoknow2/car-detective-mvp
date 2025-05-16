
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowRight } from 'lucide-react';
import { VehicleDetailsInputs } from '@/components/lookup/form-parts/VehicleDetailsInputs';
import { ConditionAndFuelInputs } from '@/components/lookup/form-parts/ConditionAndFuelInputs';
import { ZipCodeInput } from '@/components/lookup/form-parts/ZipCodeInput';
import { toast } from 'sonner';
import { ManualEntryFormData, ConditionLevel } from '@/components/lookup/types/manualEntry';

interface ManualLookupProps {
  onSubmit: (data: ManualEntryFormData) => void;
  isLoading?: boolean;
  onCancel?: () => void;
  initialData?: Partial<ManualEntryFormData>;
  submitButtonText?: string;
}

export function ManualLookup({
  onSubmit,
  isLoading = false,
  onCancel,
  initialData,
  submitButtonText = "Continue"
}: ManualLookupProps) {
  // States for form fields
  const [make, setMake] = useState(initialData?.make || '');
  const [model, setModel] = useState(initialData?.model || '');
  const [year, setYear] = useState<number>(initialData?.year ? Number(initialData.year) : new Date().getFullYear());
  const [mileage, setMileage] = useState<number>(initialData?.mileage ? Number(initialData.mileage) : 0);
  const [condition, setCondition] = useState<ConditionLevel>(
    (initialData?.condition as ConditionLevel) || ConditionLevel.Good
  );
  const [zipCode, setZipCode] = useState(initialData?.zipCode || '');
  const [fuelType, setFuelType] = useState(initialData?.fuelType || 'Gasoline');
  const [transmission, setTransmission] = useState(initialData?.transmission || 'Automatic');
  const [trim, setTrim] = useState(initialData?.trim || '');
  const [color, setColor] = useState(initialData?.color || '');
  
  // Add validation state to enable/disable the Continue button
  const [isValid, setIsValid] = useState(false);
  
  // Validate form whenever key fields change
  useEffect(() => {
    const isValidForm = Boolean(
      make.trim() !== '' && 
      model.trim() !== '' && 
      year > 1900 && 
      zipCode.length === 5
    );
    setIsValid(isValidForm);
  }, [make, model, year, zipCode]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!make) {
      toast.error('Make is required');
      return;
    }
    
    if (!model) {
      toast.error('Model is required');
      return;
    }
    
    if (!zipCode) {
      toast.error('ZIP code is required');
      return;
    }
    
    // Create form data object
    const formData: ManualEntryFormData = {
      make,
      model,
      year,
      mileage,
      condition,
      zipCode,
      fuelType,
      transmission,
      trim,
      color
    };
    
    onSubmit(formData);
  };

  return (
    <Card className="shadow-sm border-2">
      <CardHeader>
        <CardTitle>Vehicle Details</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <VehicleDetailsInputs
            make={make}
            setMake={setMake}
            model={model}
            setModel={setModel}
            year={year}
            setYear={(val: number) => setYear(val)}
            mileage={mileage}
            setMileage={(val: number) => setMileage(val)}
            trim={trim}
            setTrim={setTrim}
            color={color}
            setColor={setColor}
          />
          
          <ConditionAndFuelInputs
            condition={condition}
            setCondition={(val: ConditionLevel) => setCondition(val)}
            fuelType={fuelType}
            setFuelType={setFuelType}
            transmission={transmission}
            setTransmission={setTransmission}
          />
          
          <ZipCodeInput
            zipCode={zipCode}
            setZipCode={setZipCode}
          />
        </CardContent>
        <CardFooter className="flex justify-between gap-4">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            className="flex-1 flex items-center justify-center"
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
}

export default ManualLookup;
