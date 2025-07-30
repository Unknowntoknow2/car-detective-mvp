import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DecodedVehicle } from '@/types/DecodedVehicle';
import { VehicleData, VehicleCondition, TitleStatus, DataGap } from '@/types/ValuationTypes';
import valuationEngine from '@/services/valuationEngine';

interface DataCollectionFormProps {
  decodedVin: DecodedVehicle[];
  vin: string;
  onComplete: (valuation: any) => void;
}

export function DataCollectionForm({ decodedVin, vin, onComplete }: DataCollectionFormProps) {
  const [vehicleData, setVehicleData] = useState<Partial<VehicleData>>({});
  const [dataGaps, setDataGaps] = useState<DataGap[]>([]);
  const [currentGapIndex, setCurrentGapIndex] = useState(0);
  const [isCollecting, setIsCollecting] = useState(true);
  const [isGeneratingValuation, setIsGeneratingValuation] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Extract basic vehicle data from decoded VIN
    const extractedData = extractVehicleDataFromVin(decodedVin);
    extractedData.vin = vin; // Set the VIN from props
    setVehicleData(extractedData);

    // Identify data gaps that need user input
    const gaps = identifyDataGaps(extractedData);
    setDataGaps(gaps);

    if (gaps.length === 0) {
      setIsCollecting(false);
    }
  }, [decodedVin, vin]);

  const extractVehicleDataFromVin = (decoded: DecodedVehicle[]): Partial<VehicleData> => {
    const data: Partial<VehicleData> = {};

    decoded.forEach(item => {
      switch (item.Variable) {
        case 'Make':
          data.make = item.Value || '';
          break;
        case 'Model':
          data.model = item.Value || '';
          break;
        case 'Model Year':
          data.year = parseInt(item.Value || '0');
          break;
        case 'Trim':
          data.trim = item.Value || undefined;
          break;
        case 'Body Class':
          // Could be used to enhance model info
          break;
        case 'Engine Number of Cylinders':
          data.engineSize = item.Value || undefined;
          break;
        case 'Fuel Type - Primary':
          data.fuelType = item.Value || undefined;
          break;
        case 'Drive Type':
          data.drivetrain = item.Value || undefined;
          break;
        case 'Transmission Style':
          data.transmission = item.Value || undefined;
          break;
        default:
          break;
      }
    });

    // Extract VIN from props
    data.vin = vin;

    return data;
  };

  const identifyDataGaps = (data: Partial<VehicleData>): DataGap[] => {
    const gaps: DataGap[] = [];

    // Critical data gaps that significantly impact valuation
    if (!data.mileage) {
      gaps.push({
        field: 'mileage',
        required: true,
        prompt: 'What is the current mileage of your vehicle?',
        validationRules: [
          { type: 'required', message: 'Mileage is required for accurate valuation' },
          { type: 'min', value: 0, message: 'Mileage cannot be negative' },
          { type: 'max', value: 999999, message: 'Please enter a valid mileage' }
        ]
      });
    }

    if (!data.zipCode) {
      gaps.push({
        field: 'zipCode',
        required: true,
        prompt: 'What is your ZIP code? (This helps us find local market comparisons)',
        validationRules: [
          { type: 'required', message: 'ZIP code is required' },
          { type: 'pattern', value: /^\d{5}(-\d{4})?$/, message: 'Please enter a valid ZIP code' }
        ]
      });
    }

    if (!data.condition) {
      gaps.push({
        field: 'condition',
        required: true,
        prompt: 'What is the overall condition of your vehicle?',
        validationRules: [
          { type: 'required', message: 'Vehicle condition is required' }
        ]
      });
    }

    if (!data.titleStatus) {
      gaps.push({
        field: 'titleStatus',
        required: true,
        defaultValue: TitleStatus.CLEAN,
        prompt: 'What is the title status of your vehicle?',
        validationRules: [
          { type: 'required', message: 'Title status is required' }
        ]
      });
    }

    // Optional but helpful data
    if (!data.exteriorColor) {
      gaps.push({
        field: 'exteriorColor',
        required: false,
        prompt: 'What is the exterior color of your vehicle? (Optional)',
        validationRules: []
      });
    }

    return gaps;
  };

  const handleInputChange = (field: string, value: any) => {
    setVehicleData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateCurrentInput = (): boolean => {
    const currentGap = dataGaps[currentGapIndex];
    if (!currentGap) return true;

    const value = vehicleData[currentGap.field as keyof VehicleData];
    const newErrors: Record<string, string> = {};

    for (const rule of currentGap.validationRules || []) {
      switch (rule.type) {
        case 'required':
          if (!value || (typeof value === 'string' && value.trim() === '')) {
            newErrors[currentGap.field] = rule.message;
          }
          break;
        case 'min':
          if (typeof value === 'number' && value < rule.value) {
            newErrors[currentGap.field] = rule.message;
          }
          break;
        case 'max':
          if (typeof value === 'number' && value > rule.value) {
            newErrors[currentGap.field] = rule.message;
          }
          break;
        case 'pattern':
          if (typeof value === 'string' && !rule.value.test(value)) {
            newErrors[currentGap.field] = rule.message;
          }
          break;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentInput()) {
      return;
    }

    if (currentGapIndex < dataGaps.length - 1) {
      setCurrentGapIndex(prev => prev + 1);
    } else {
      // All data collected, proceed to valuation
      setIsCollecting(false);
      generateValuation();
    }
  };

  const handlePrevious = () => {
    if (currentGapIndex > 0) {
      setCurrentGapIndex(prev => prev - 1);
    }
  };

  const generateValuation = async () => {
    setIsGeneratingValuation(true);

    try {
      // Ensure we have VIN from props
      const completeData: VehicleData = {
        ...vehicleData,
        vin: vin,
        make: vehicleData.make || '',
        model: vehicleData.model || '',
        year: vehicleData.year || new Date().getFullYear(),
      } as VehicleData;

      console.log('🚀 Generating valuation with data:', completeData);
      
      const result = await valuationEngine.generateValuation(completeData);
      
      if (result.success) {
        onComplete(result.data);
      } else {
        console.error('Valuation failed:', result.error);
        // Handle error - show error message to user
      }
    } catch (error) {
      console.error('Valuation error:', error);
      // Handle error
    } finally {
      setIsGeneratingValuation(false);
    }
  };

  const renderCurrentInput = () => {
    const currentGap = dataGaps[currentGapIndex];
    if (!currentGap) return null;

    const value = vehicleData[currentGap.field as keyof VehicleData];
    const error = errors[currentGap.field];

    switch (currentGap.field) {
      case 'mileage':
        return (
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Enter mileage (e.g., 45000)"
              value={value || ''}
              onChange={(e) => handleInputChange(currentGap.field, parseInt(e.target.value) || 0)}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        );

      case 'zipCode':
        return (
          <div className="space-y-2">
            <Input
              placeholder="Enter ZIP code (e.g., 90210)"
              value={value || ''}
              onChange={(e) => handleInputChange(currentGap.field, e.target.value)}
              className={error ? 'border-red-500' : ''}
              maxLength={10}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        );

      case 'condition':
        return (
          <div className="space-y-2">
            <select
              value={value || ''}
              onChange={(e) => handleInputChange(currentGap.field, e.target.value)}
              className={`w-full p-3 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select condition</option>
              <option value={VehicleCondition.EXCELLENT}>Excellent - Like new, no visible wear</option>
              <option value={VehicleCondition.VERY_GOOD}>Very Good - Minor wear, well maintained</option>
              <option value={VehicleCondition.GOOD}>Good - Normal wear, good condition</option>
              <option value={VehicleCondition.FAIR}>Fair - Some wear, needs minor repairs</option>
              <option value={VehicleCondition.POOR}>Poor - Significant wear, needs major repairs</option>
            </select>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        );

      case 'titleStatus':
        return (
          <div className="space-y-2">
            <select
              value={value || TitleStatus.CLEAN}
              onChange={(e) => handleInputChange(currentGap.field, e.target.value)}
              className={`w-full p-3 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value={TitleStatus.CLEAN}>Clean Title</option>
              <option value={TitleStatus.SALVAGE}>Salvage Title</option>
              <option value={TitleStatus.REBUILT}>Rebuilt Title</option>
              <option value={TitleStatus.FLOOD}>Flood Damage</option>
              <option value={TitleStatus.LEMON}>Lemon Title</option>
              <option value={TitleStatus.MANUFACTURER_BUYBACK}>Manufacturer Buyback</option>
            </select>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        );

      case 'exteriorColor':
        return (
          <div className="space-y-2">
            <Input
              placeholder="Enter exterior color (e.g., White, Black, Silver)"
              value={value || ''}
              onChange={(e) => handleInputChange(currentGap.field, e.target.value)}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        );

      default:
        return (
          <Input
            placeholder={`Enter ${currentGap.field}`}
            value={value || ''}
            onChange={(e) => handleInputChange(currentGap.field, e.target.value)}
            className={error ? 'border-red-500' : ''}
          />
        );
    }
  };

  if (isGeneratingValuation) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold mb-2">Generating Your Valuation</h3>
        <p className="text-gray-600">
          We're analyzing market data and vehicle history to provide you with the most accurate valuation...
        </p>
      </div>
    );
  }

  if (!isCollecting) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <h3 className="text-lg font-semibold mb-4">Data Collection Complete</h3>
        <p className="text-gray-600 mb-4">
          We have all the information needed to generate your valuation.
        </p>
        <Button onClick={generateValuation} className="w-full">
          Generate Valuation Report
        </Button>
      </div>
    );
  }

  const currentGap = dataGaps[currentGapIndex];
  const progress = ((currentGapIndex) / dataGaps.length) * 100;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Step {currentGapIndex + 1} of {dataGaps.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Current question */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">{currentGap?.prompt}</h3>
        {renderCurrentInput()}
        
        {!currentGap?.required && (
          <p className="text-sm text-gray-500 mt-2">
            This field is optional but helps improve valuation accuracy.
          </p>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentGapIndex === 0}
        >
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={currentGap?.required && !vehicleData[currentGap.field as keyof VehicleData]}
        >
          {currentGapIndex === dataGaps.length - 1 ? 'Complete' : 'Next'}
        </Button>
      </div>

      {/* Vehicle summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h4 className="font-medium mb-2">Vehicle Information</h4>
        <p className="text-sm text-gray-600">
          {vehicleData.year} {vehicleData.make} {vehicleData.model}
          {vehicleData.trim && ` ${vehicleData.trim}`}
        </p>
        {vehicleData.mileage && (
          <p className="text-sm text-gray-600">
            Mileage: {vehicleData.mileage.toLocaleString()} miles
          </p>
        )}
      </div>
    </div>
  );
}