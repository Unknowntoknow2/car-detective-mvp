import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DecodedVehicle } from '@/types/DecodedVehicle';
import { VehicleData, VehicleCondition, TitleStatus, DataGap } from '@/types/ValuationTypes';
import valuationEngine from '@/services/valuationEngine'; // <-- Fix import

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

  // Restore NHTSA style mapping
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

    data.vin = vin;

    return data;
  };

  // ...rest of your code unchanged...
}