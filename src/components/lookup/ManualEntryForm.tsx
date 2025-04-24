
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

export const ManualEntryForm: React.FC = () => {
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

  const handleSubmit = async () => {
    // Validate inputs
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

    // Find make name from ID
    const selectedMake = makes.find(m => m.id === selectedMakeId);
    
    if (!selectedMake) {
      toast.error('Invalid make selected');
      return;
    }

    // Perform valuation
    const result = await calculateValuation({
      make: selectedMake.make_name,
      model: selectedModel,
      year: selectedYear as number,
      mileage: parsedMileage,
      condition: 'good', // Default condition, could be expanded later
      fuelType: 'Gasoline' // Default fuel type, could be expanded later
    });

    if (result) {
      navigate(`/valuation/${result.id}`);
    }
  };

  // Handle data loading error
  if (dataLoadError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-lg text-red-600">Failed to load vehicle data</p>
        <Button onClick={() => window.location.reload()}>
          Retry Loading
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Make Selection */}
      <Select 
        onValueChange={setSelectedMakeId}
        disabled={isDataLoading}
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
        disabled={!selectedMakeId || isDataLoading}
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
        disabled={isDataLoading}
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
        disabled={isDataLoading}
      />

      {/* Submit Button */}
      <Button 
        onClick={handleSubmit} 
        disabled={isDataLoading || isValuationLoading}
        className="col-span-full"
      >
        {(isDataLoading || isValuationLoading) ? (
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
