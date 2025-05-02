
import { useEffect, useState } from 'react';
import { fetchVehicleData } from '@/api/vehicleApi';
import { Make, Model } from './types/vehicle';

interface VehicleData {
  makes: Make[];
  models: Model[];
}

export function useVehicleData(): {
  makes: Make[];
  models: Model[];
  isLoading: boolean;
  error: string | null;
} {
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVehicleData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { makes, models }: VehicleData = await fetchVehicleData();

        setMakes(makes);
        setModels(models);

        if (makes.length === 0) {
          console.warn("⚠️ No makes returned from Supabase.");
        }

        if (models.length === 0) {
          console.warn("⚠️ No models returned from Supabase.");
        }

      } catch (err) {
        console.error("❌ Failed to load vehicle data:", err);
        setError("Failed to load vehicle data");
        setMakes([]);
        setModels([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadVehicleData();
  }, []);

  return { makes, models, isLoading, error };
}
