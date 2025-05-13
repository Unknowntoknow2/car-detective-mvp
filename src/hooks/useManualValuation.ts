
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { buildValuationReport } from '@/lib/valuation/buildValuationReport';
import { useVehicleDBData } from './useVehicleDBData';
import { toast } from 'sonner';

export interface ManualVehicleInfo {
  makeId: string;
  modelId: string;
  year: number;
  mileage: number;
  zipCode: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  fuelType?: string;
  trim?: string;
}

export function useManualValuation() {
  const [formData, setFormData] = useState<ManualVehicleInfo>({
    makeId: '',
    modelId: '',
    year: new Date().getFullYear(),
    mileage: 0,
    zipCode: '',
    condition: 'good',
  });
  const [valuation, setValuation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [valuationId, setValuationId] = useState<string>('');
  const { getMakeName, getModelName } = useVehicleDBData();

  const resetForm = () => {
    setValuation(null);
    setFormData({
      makeId: '',
      modelId: '',
      year: new Date().getFullYear(),
      mileage: 0,
      zipCode: '',
      condition: 'good',
    });
    setValuationId('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!formData.makeId || !formData.modelId || !formData.year || !formData.mileage || !formData.zipCode || !formData.condition) {
      setError('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }

    try {
      const makeName = await getMakeName(formData.makeId);
      const modelName = await getModelName(formData.modelId);

      const report = await buildValuationReport({
        year: formData.year,
        make: makeName,
        model: modelName,
        mileage: formData.mileage,
        zipCode: formData.zipCode,
        condition: formData.condition,
        identifierType: 'manual',
        fuelType: formData.fuelType || 'gasoline',
        baseMarketValue: 25000, // Default base market value
      });

      if (report) {
        // Generate a UUID for the valuation
        const newValuationId = crypto.randomUUID();
        setValuationId(newValuationId);
        
        // Store the valuation in the database
        await supabase.from('valuations').insert({
          id: newValuationId,
          user_id: supabase.auth.getUser()?.data?.user?.id,
          year: formData.year,
          make: makeName,
          model: modelName,
          mileage: formData.mileage,
          state: formData.zipCode,
          estimated_value: report.estimatedValue,
          confidence_score: report.confidenceScore || 70,
          condition_score: formData.condition === 'excellent' ? 90 : 
                           formData.condition === 'good' ? 75 : 
                           formData.condition === 'fair' ? 60 : 40,
          is_vin_lookup: false,
        });

        setValuation(report);
        toast.success('Valuation generated successfully!');
      }
    } catch (err: any) {
      console.error('Error during valuation:', err);
      setError(err.message || 'Failed to generate valuation.');
      toast.error(err.message || 'Failed to generate valuation.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateValuation = async (vehicleData: Omit<ManualVehicleInfo, 'makeId' | 'modelId'> & { make: string; model: string; }) => {
    setIsLoading(true);
    setError(null);
    try {
      const report = await buildValuationReport({
        year: vehicleData.year,
        make: vehicleData.make,
        model: vehicleData.model,
        mileage: vehicleData.mileage,
        zipCode: vehicleData.zipCode,
        condition: vehicleData.condition,
        identifierType: 'manual',
        fuelType: vehicleData.fuelType || 'gasoline',
        baseMarketValue: 25000, // Default base market value
      });

      return report;
    } catch (err: any) {
      console.error('Error building valuation report:', err);
      setError(err.message || 'Failed to build valuation report.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    valuation,
    isLoading,
    error,
    handleSubmit,
    calculateValuation,
    valuationId,
    resetForm
  };
}
