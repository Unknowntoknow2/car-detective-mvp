import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { buildValuationReport } from '@/lib/valuation/buildValuationReport';
import { useVehicleDBData } from './useVehicleDBData';
import { toast } from 'sonner';

export interface ManualVehicleInfo {
  makeId: number;
  modelId: number;
  year: number;
  mileage: number;
  zipCode: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
}

export function useManualValuation() {
  const [valuation, setValuation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getMakeName, getModelName } = useVehicleDBData();

  const handleSubmit = async (e: React.FormEvent, vehicleData: ManualVehicleInfo) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!vehicleData.makeId || !vehicleData.modelId || !vehicleData.year || !vehicleData.mileage || !vehicleData.zipCode || !vehicleData.condition) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      const valuationResult = await calculateValuation(vehicleData);
      setValuation(valuationResult);
      toast.success('Valuation generated successfully!');
    } catch (err: any) {
      console.error('Error during valuation:', err);
      setError(err.message || 'Failed to generate valuation.');
      toast.error(err.message || 'Failed to generate valuation.');
    } finally {
      setLoading(false);
    }
  };

  const calculateValuation = async (vehicleData: ManualVehicleInfo) => {
    setLoading(true);
    setError(null);
    try {
      const makeName = await getMakeName(vehicleData.makeId);
      const modelName = await getModelName(vehicleData.modelId);

      const report = await buildValuationReport({
        year: vehicleData.year,
        make: makeName,
        model: modelName,
        mileage: vehicleData.mileage,
        zipCode: vehicleData.zipCode,
        condition: vehicleData.condition,
      });

      return report;
    } catch (err: any) {
      console.error('Error building valuation report:', err);
      setError(err.message || 'Failed to build valuation report.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    valuation,
    loading,
    error,
    handleSubmit,
  };
}
