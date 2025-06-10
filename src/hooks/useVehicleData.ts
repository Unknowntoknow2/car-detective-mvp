
import { useState, useEffect } from 'react';

interface VehicleData {
  makes: Array<{ id: string; name: string }>;
  models: Array<{ id: string; name: string; makeId: string }>;
  years: number[];
}

interface UseVehicleDataReturn {
  vehicleData: VehicleData;
  isLoading: boolean;
  error: string | null;
}

export function useVehicleData(): UseVehicleDataReturn {
  const [vehicleData, setVehicleData] = useState<VehicleData>({
    makes: [],
    models: [],
    years: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    
    // Mock data
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 30 }, (_, i) => currentYear - i);
    
    setVehicleData({
      makes: [
        { id: '1', name: 'Toyota' },
        { id: '2', name: 'Honda' },
        { id: '3', name: 'Ford' },
        { id: '4', name: 'Chevrolet' },
        { id: '5', name: 'BMW' },
      ],
      models: [
        { id: '1', name: 'Camry', makeId: '1' },
        { id: '2', name: 'Corolla', makeId: '1' },
        { id: '3', name: 'Civic', makeId: '2' },
        { id: '4', name: 'Accord', makeId: '2' },
      ],
      years
    });
    
    setIsLoading(false);
  }, []);

  return {
    vehicleData,
    isLoading,
    error
  };
}
