
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

const FUEL_TYPES = ["Gasoline", "Diesel", "Hybrid", "Electric"];

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Make Selection */}
        <Select 
          onValueChange={setSelectedMakeId}
          disabled={isFormLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Make" />
          </SelectTrigger>
          <SelectContent>
            {makes.map(make => (
              <SelectItem key={make.id} value={make.id}>
                <div className="flex items-center">
                  {make.logo_url && (
                    <img 
                      src={make.logo_url} 
                      alt={`${make.make_name} logo`} 
                      className="h-6 w-6 mr-2"
                    />
                  )}
                  {make.make_name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Model Selection */}
        <Select 
          onValueChange={setSelectedModel}
          disabled={!selectedMakeId || isFormLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Model" />
          </SelectTrigger>
          <SelectContent>
            {getModelsByMake(selectedMakeId).map(model => (
              <SelectItem key={model.id} value={model.model_name}>
                {model.model_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Year Selection */}
        <Select 
          onValueChange={(value) => setSelectedYear(Number(value))}
          disabled={isFormLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {getYearOptions().map(year => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Mileage Input */}
        <Input 
          type="number" 
          placeholder="Enter Mileage" 
          value={mileage}
          onChange={(e) => setMileage(e.target.value)}
          disabled={isFormLoading}
        />

        {/* ZIP Code Input */}
        <Input 
          placeholder="ZIP Code" 
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          maxLength={5}
          disabled={isFormLoading}
        />

        {/* Fuel Type Selection */}
        <Select 
          onValueChange={setFuelType}
          disabled={isFormLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Fuel Type" />
          </SelectTrigger>
          <SelectContent>
            {FUEL_TYPES.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Accident Selection */}
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

        {/* Accident Details */}
        {accident === "yes" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 col-span-2">
            <Input 
              placeholder="How many?" 
              value={accidentDetails.count}
              onChange={e => setAccidentDetails({ ...accidentDetails, count: e.target.value })}
              disabled={isFormLoading}
            />
            <Select 
              onValueChange={(value) => setAccidentDetails({ ...accidentDetails, severity: value })}
              disabled={isFormLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minor">Minor</SelectItem>
                <SelectItem value="major">Major</SelectItem>
              </SelectContent>
            </Select>
            <Select 
              onValueChange={(value) => setAccidentDetails({ ...accidentDetails, area: value })}
              disabled={isFormLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="front">Front</SelectItem>
                <SelectItem value="rear">Rear</SelectItem>
                <SelectItem value="left">Left Side</SelectItem>
                <SelectItem value="right">Right Side</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Submit Button */}
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
