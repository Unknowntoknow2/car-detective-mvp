
import { useState, useEffect } from 'react';
import { fetchVehicleDetails } from '@/api/vehicleApi';

export const useVehicleData = (vin: string | null) => {
  const [vehicle, setVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getVehicleData = async () => {
      if (!vin) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await fetchVehicleDetails(vin);
        setVehicle(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch vehicle data');
        console.error('Error fetching vehicle data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    getVehicleData();
  }, [vin]);

  return { vehicle, isLoading, error };
};
