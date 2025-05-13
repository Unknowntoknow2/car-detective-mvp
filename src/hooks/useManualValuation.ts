
import { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { buildValuationReport } from '@/lib/valuation/buildValuationReport';

export interface ManualVehicleInfo {
  make: string;
  model: string;
  year: number;
  mileage: number;
  zipCode: string;
  condition: string;
  valuationId?: string;
  valuation?: number;
  confidenceScore?: number;
}

export function useManualValuation() {
  const [formData, setFormData] = useState<ManualVehicleInfo>({
    make: '',
    model: '',
    year: 0,
    mileage: 0,
    zipCode: '',
    condition: ''
  });
  
  const [valuation, setValuation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [valuationId, setValuationId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Form submission with data:', formData);
      
      // Get make and model names from their IDs
      const { data: makeData, error: makeError } = await supabase
        .from('makes')
        .select('make_name')
        .eq('id', formData.make)
        .single();
      
      if (makeError) throw new Error(`Make lookup error: ${makeError.message}`);
      
      const { data: modelData, error: modelError } = await supabase
        .from('models')
        .select('model_name')
        .eq('id', formData.model)
        .single();
      
      if (modelError) throw new Error(`Model lookup error: ${modelError.message}`);
      
      const makeName = makeData.make_name;
      const modelName = modelData.model_name;
      
      console.log(`Resolved names: ${makeName} ${modelName}`);
      
      // Build valuation parameters
      const valuationParams = {
        make: makeName,
        model: modelName,
        year: formData.year,
        mileage: formData.mileage,
        condition: formData.condition,
        zipCode: formData.zipCode,
        identifierType: 'manual'
      };
      
      // Generate valuation report
      const valuationResult = await buildValuationReport(valuationParams);
      console.log('Valuation result:', valuationResult);
      
      // Create valuation record in database
      const { data: valuationData, error: valuationError } = await supabase
        .from('valuations')
        .insert({
          make: makeName,
          model: modelName,
          year: formData.year,
          mileage: formData.mileage,
          condition_score: formData.condition === 'excellent' ? 90 : 
                           formData.condition === 'good' ? 75 : 
                           formData.condition === 'fair' ? 60 : 45,
          state: formData.zipCode,
          estimated_value: Math.round(valuationResult.finalValue),
          user_id: null, // Anonymous user for free valuation
          confidence_score: valuationResult.confidenceScore,
          is_vin_lookup: false
        })
        .select()
        .single();
      
      if (valuationError) throw new Error(`Valuation storage error: ${valuationError.message}`);
      
      // Update state with valuation result
      setValuation(valuationResult);
      setValuationId(valuationData.id);
      
      toast({
        title: "Valuation Complete",
        description: `Your ${formData.year} ${makeName} ${modelName} is valued at approximately $${valuationResult.finalValue.toLocaleString()}.`,
      });
      
    } catch (err) {
      console.error('Valuation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate valuation. Please try again.');
      
      toast({
        variant: "destructive",
        title: "Valuation Error",
        description: err instanceof Error ? err.message : 'Failed to generate valuation. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      make: '',
      model: '',
      year: 0,
      mileage: 0,
      zipCode: '',
      condition: ''
    });
    setValuation(null);
    setValuationId(null);
    setError(null);
  };

  return {
    formData,
    setFormData,
    valuation,
    isLoading,
    error,
    handleSubmit,
    valuationId,
    resetForm
  };
}
