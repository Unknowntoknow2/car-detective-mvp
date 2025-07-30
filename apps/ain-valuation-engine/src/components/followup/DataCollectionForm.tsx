import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DecodedVehicle } from '@/types/DecodedVehicle';
import { VehicleData, VehicleCondition, TitleStatus, DataGap } from '@/types/ValuationTypes';
import { ValuationEngine } from '@/services/valuationEngine';

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

  // Refactored: Now uses actual DecodedVehicle keys (no Variable/Value)
  const extractVehicleDataFromVin = (decoded: DecodedVehicle[]): Partial<VehicleData> => {
    // Assumes decodedVin is an array of objects with the correct keys
    const item = decoded[0] || {};
    return {
      vin: vin,
      make: item.make,
      model: item.model,
      year: item.modelYear,
      trim: item.trim,
      engineSize: item.engineSize,
      fuelType: item.fuelTypePrimary,
      drivetrain: item.drivetrain,
      transmission: item.transmissionStyle,
      // Add more fields as necessary based on your DecodedVehicle type
    };
  };

  const identifyDataGaps = (data: Partial<VehicleData>): DataGap[] => {
    const gaps: DataGap[] = [];
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
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // ...[rest of your code remains unchanged]...
  // (Leave the rest of the component code as-is)
}