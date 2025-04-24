import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useVehicleData } from '@/hooks/useVehicleData';
import { useManualValuation } from '@/hooks/useManualValuation';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ManualEntryFormData, AccidentDetails } from './types/manualEntry';
import { VehicleBasicInfo } from './form-parts/VehicleBasicInfo';
import { AccidentDetailsForm } from './form-parts/AccidentDetailsForm';

interface ManualEntryFormProps {
  onSubmit?: (data: ManualEntryFormData) => Promise<void>;
  isLoading?: boolean;
}

export const ManualEntryForm: React.FC<ManualEntryFormProps> = ({ onSubmit, isLoading: externalLoading }) => {
  const navigate = useNavigate();
  const { 
    makes, 
    models, 
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
  const [accident, setAccident] = useState<string>('no');
  const [accidentDetails, setAccidentDetails] = useState<AccidentDetails>({
    count: '',
    severity: '',
    area: ''
  });

  const handleSubmit = async () => {
    // Validation
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
    if (isNaN(parsedMileage) || parsedMileage < 0) {
      toast.error('Please enter a valid mileage');
      return;
    }

    if (zipCode && zipCode.length !== 5) {
      toast.error('Please enter a valid ZIP code');
      return;
    }

    // Find make name from ID
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
      condition: 'good',
      zipCode,
      accident,
      accidentDetails: accident === 'yes' ? accidentDetails : undefined
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
      condition: 'good',
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
      <div className="text-sm text-yellow-700 bg-yellow-100 p-4 rounded">
        You may optionally enter known accident information if you don't have a CARFAX report. 
        Premium users will receive verified data directly from CARFAX.
      </div>

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
          'Get Vehicle Valuation'
        )}
      </Button>
    </div>
  );
};
