
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, ArrowRight } from 'lucide-react';
import { VehicleDetailsInputs } from '@/components/lookup/form-parts/VehicleDetailsInputs';
import { ConditionAndFuelInputs } from '@/components/lookup/form-parts/ConditionAndFuelInputs';
import { ZipCodeInput } from '@/components/lookup/form-parts/ZipCodeInput';
import { AccidentDetailsForm } from '@/components/lookup/form-parts/AccidentDetailsForm';
import { toast } from 'sonner';
import { 
  ManualEntryFormData, 
  ConditionLevel, 
  AccidentDetails 
} from '@/components/lookup/types/manualEntry';

interface PremiumManualEntryFormProps {
  onSubmit: (data: ManualEntryFormData) => void;
  isLoading?: boolean;
  onCancel?: () => void;
  initialData?: Partial<ManualEntryFormData>;
  submitButtonText?: string;
}

export function PremiumManualEntryForm({
  onSubmit,
  isLoading = false,
  onCancel,
  initialData,
  submitButtonText = "Continue"
}: PremiumManualEntryFormProps) {
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
  const [bodyType, setBodyType] = useState(initialData?.bodyType || '');
  const [vin, setVin] = useState(initialData?.vin || '');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(initialData?.selectedFeatures || []);
  const [hasAccident, setHasAccident] = useState<boolean>(initialData?.accidentDetails?.hasAccident || false);
  const [accidentDetails, setAccidentDetails] = useState<AccidentDetails>(
    initialData?.accidentDetails || { hasAccident: false }
  );
  
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
      color,
      bodyType,
      vin,
      selectedFeatures,
      accidentDetails: {
        ...accidentDetails,
        hasAccident
      }
    };
    
    onSubmit(formData);
  };

  const handleAccidentDetailsChange = (details: AccidentDetails) => {
    setAccidentDetails(details);
    setHasAccident(details.hasAccident || false);
  };

  return (
    <Card className="shadow-sm border-2">
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Vehicle Information</h3>
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
            
            {vin && (
              <div className="flex items-center p-2 bg-gray-50 rounded">
                <span className="text-sm">VIN: {vin}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Vehicle Condition</h3>
            <ConditionAndFuelInputs
              condition={condition}
              setCondition={(val: ConditionLevel) => setCondition(val)}
              fuelType={fuelType}
              setFuelType={setFuelType}
              transmission={transmission}
              setTransmission={setTransmission}
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Accident History</h3>
            <AccidentDetailsForm
              value={accidentDetails}
              onChange={handleAccidentDetailsChange}
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Location</h3>
            <ZipCodeInput
              zipCode={zipCode}
              setZipCode={setZipCode}
            />
          </div>
        </div>
        
        <div className="p-6 bg-gray-50 flex justify-between gap-4 border-t">
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
        </div>
      </form>
    </Card>
  );
}

export default PremiumManualEntryForm;
