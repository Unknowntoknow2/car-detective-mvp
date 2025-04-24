
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ManualEntryFormData } from './types/manualEntry';
import { VehicleBasicInfo } from './form-parts/VehicleBasicInfo';
import { VehicleConditionSlider } from './form-parts/VehicleConditionSlider';
import { VehicleFeatureSelect } from './form-parts/VehicleFeatureSelect';
import { PremiumFields } from './form-parts/PremiumFields';
import { ValuationFormActions } from './form-parts/ValuationFormActions';
import { useVehicleData } from '@/hooks/useVehicleData';
import { useManualValuation } from '@/hooks/useManualValuation';

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
  const { makes, getModelsByMake, isLoading: isDataLoading, error: dataLoadError } = useVehicleData();
  const { calculateValuation, isLoading: isValuationLoading } = useManualValuation();

  const [selectedMakeId, setSelectedMakeId] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number | ''>('');
  const [mileage, setMileage] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');
  const [fuelType, setFuelType] = useState<string>('');
  const [condition, setCondition] = useState<string>('good');
  const [conditionValue, setConditionValue] = useState(75);
  const [accident, setAccident] = useState<string>('no');
  const [accidentDetails, setAccidentDetails] = useState({
    count: '',
    severity: '',
    area: ''
  });
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const handleSubmit = async () => {
    if (!selectedMakeId || !selectedModel || !selectedYear) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const parsedMileage = parseInt(mileage, 10);
    if (isNaN(parsedMileage) || parsedMileage <= 0) {
      toast.error('Please enter a valid mileage');
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
      accidentDetails: isPremium && accident === 'yes' ? accidentDetails : undefined,
      selectedFeatures
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
      condition: getConditionLabel(conditionValue),
      fuelType: fuelType || 'Gasoline'
    });

    if (result) {
      navigate(`/valuation`);
    }
  };

  const getConditionLabel = (value: number): string => {
    if (value <= 25) return 'poor';
    if (value <= 50) return 'fair';
    if (value <= 75) return 'good';
    return 'excellent';
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
        condition={condition}
        setCondition={setCondition}
        isDisabled={isFormLoading}
      />

      <VehicleConditionSlider
        value={conditionValue}
        onChange={setConditionValue}
        disabled={isFormLoading}
      />

      <VehicleFeatureSelect
        selectedFeatures={selectedFeatures}
        onFeaturesChange={setSelectedFeatures}
        disabled={isFormLoading}
      />

      {isPremium && (
        <PremiumFields
          accident={accident}
          setAccident={setAccident}
          accidentDetails={accidentDetails}
          setAccidentDetails={setAccidentDetails}
          isDisabled={isFormLoading}
        />
      )}

      <ValuationFormActions
        isLoading={isFormLoading}
        submitButtonText={submitButtonText}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
