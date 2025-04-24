import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ManualEntryFormData, AccidentDetails } from './types/manualEntry';
import { VehicleBasicInfo } from './form-parts/VehicleBasicInfo';
import { AccidentDetailsForm } from './form-parts/AccidentDetailsForm';
import { VehicleConditionSlider } from './form-parts/VehicleConditionSlider';

interface ManualEntryFormProps {
  onSubmit?: (data: ManualEntryFormData) => Promise<void>;
  isLoading?: boolean;
  submitButtonText?: string;
  isPremium?: boolean;
}

export const ManualEntryForm: React.FC<ManualEntryFormProps> = ({ 
  onSubmit, 
  isLoading: externalLoading,
  submitButtonText = 'Get Vehicle Valuation',
  isPremium = false
}) => {
  const navigate = useNavigate();
  const { 
    makes, 
    getModelsByMake,
    getYearOptions,
    isLoading: isDataLoading,
    error: dataLoadError 
  } = useVehicleData();
  const { calculateValuation, isLoading: isValuationLoading } = useManualValuation();

  const [selectedMakeId, setSelectedMakeId] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number | ''>('');
  const [mileage, setMileage] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');
  const [fuelType, setFuelType] = useState<string>('');
  const [conditionValue, setConditionValue] = useState(75);
  const [accident, setAccident] = useState<string>('no');
  const [accidentDetails, setAccidentDetails] = useState<AccidentDetails>({
    count: '',
    severity: '',
    area: ''
  });

  const getConditionLabel = (value: number): string => {
    if (value <= 25) return 'poor';
    if (value <= 50) return 'fair';
    if (value <= 75) return 'good';
    return 'excellent';
  };

  const handleSubmit = async () => {
    if (!selectedMakeId) {
      toast.error('Please select a make');
      return;
    }
    if (!selectedModel) {
      toast.error('Please select a model');
      return;
    }
    if (!selectedYear) {
      toast.error('Please select a year');
      return;
    }
    
    const parsedMileage = parseInt(mileage, 10);
    if (isNaN(parsedMileage) || parsedMileage <= 0) {
      toast.error('Please enter a valid positive mileage greater than zero');
      return;
    }

    if (zipCode && zipCode.length !== 5) {
      toast.error('Please enter a valid ZIP code');
      return;
    }

    const selectedMake = makes.find(m => m.id === selectedMakeId);
    if (!selectedMake) {
      toast.error('Invalid make selected');
      return;
    }

    const formData: ManualEntryFormData = {
      make: selectedMake.make_name,
      model: selectedModel,
      year: selectedYear as number,
      mileage: parsedMileage,
      fuelType,
      condition: getConditionLabel(conditionValue),
      zipCode,
      accident: isPremium ? accident : undefined,
      accidentDetails: isPremium && accident === 'yes' ? accidentDetails : undefined
    };

    if (onSubmit) {
      await onSubmit(formData);
      return;
    }

    const result = await calculateValuation({
      make: selectedMake.make_name,
      model: selectedModel,
      year: selectedYear as number,
      mileage: parsedMileage,
      condition,
      fuelType: fuelType || 'Gasoline'
    });

    if (result) {
      navigate(`/valuation`);
    }
  };

  if (dataLoadError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-lg text-red-600">Failed to load vehicle data</p>
        <Button onClick={() => window.location.reload()}>Retry Loading</Button>
      </div>
    );
  }

  const isFormLoading = externalLoading || isDataLoading || isValuationLoading;

  return (
    <div className="space-y-6">
      <VehicleBasicInfo
        selectedMakeId={selectedMakeId}
        setSelectedMakeId={setSelectedMakeId}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        mileage={mileage}
        setMileage={setMileage}
        zipCode={zipCode}
        setZipCode={setZipCode}
        fuelType={fuelType}
        setFuelType={setFuelType}
        isDisabled={isFormLoading}
      />

      <VehicleConditionSlider
        value={conditionValue}
        onChange={setConditionValue}
        disabled={isFormLoading}
      />

      {isPremium && (
        <>
          <Select 
            onValueChange={setAccident}
            disabled={isFormLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any Accidents?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
            </SelectContent>
          </Select>

          {accident === "yes" && (
            <AccidentDetailsForm
              accidentDetails={accidentDetails}
              setAccidentDetails={setAccidentDetails}
              disabled={isFormLoading}
            />
          )}
        </>
      )}

      <Button 
        onClick={handleSubmit} 
        disabled={isFormLoading}
        className="w-full"
      >
        {isFormLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          submitButtonText
        )}
      </Button>
    </div>
  );
};
