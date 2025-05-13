
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export interface ManualVehicleInfo {
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  zipCode?: string;
  condition?: string;
  valuation?: number;
  confidenceScore?: number;
}

export function useManualValuation() {
  const [formData, setFormData] = useState<ManualVehicleInfo>({});
  const [valuation, setValuation] = useState<ManualVehicleInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [valuationId, setValuationId] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  // Load form data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('manual_valuation_form');
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (e) {
        console.error('Error parsing saved form data:', e);
        localStorage.removeItem('manual_valuation_form');
      }
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      localStorage.setItem('manual_valuation_form', JSON.stringify(formData));
    }
  }, [formData]);

  const calculateValuation = async (data: ManualVehicleInfo) => {
    // Simple valuation logic for demonstration
    // In a real app, this would call an API or use a more complex algorithm
    const baseValue = 20000; // Base value for a standard car
    const yearFactor = data.year ? (data.year - 2000) * 500 : 0; // Newer cars worth more
    const mileageFactor = data.mileage ? -(data.mileage / 10000) * 1000 : 0; // Higher mileage reduces value
    
    // Condition multipliers
    const conditionMultipliers: Record<string, number> = {
      excellent: 1.2,
      good: 1.0,
      fair: 0.8,
      poor: 0.6
    };
    
    const conditionMultiplier = data.condition 
      ? conditionMultipliers[data.condition] || 1.0 
      : 1.0;
    
    // Calculate estimated value
    const estimatedValue = Math.max(
      1000, // Minimum value
      Math.round((baseValue + yearFactor + mileageFactor) * conditionMultiplier)
    );
    
    // Calculate confidence score (higher for newer cars with lower mileage)
    const ageConfidence = data.year ? Math.min(100, Math.max(50, 100 - (new Date().getFullYear() - data.year) * 3)) : 70;
    const mileageConfidence = data.mileage ? Math.min(100, Math.max(50, 100 - (data.mileage / 10000) * 5)) : 70;
    const confidenceScore = Math.round((ageConfidence + mileageConfidence) / 2);
    
    return {
      ...data,
      valuation: estimatedValue,
      confidenceScore: confidenceScore
    };
  };

  const saveValuationToSupabase = async (valuationData: ManualVehicleInfo) => {
    try {
      // Prepare data for saving to Supabase
      const dataToSave = {
        make: valuationData.make,
        model: valuationData.model,
        year: valuationData.year,
        mileage: valuationData.mileage,
        state: valuationData.zipCode, // Storing ZIP in the state field
        condition_score: valuationData.condition === 'excellent' ? 90 :
                         valuationData.condition === 'good' ? 75 :
                         valuationData.condition === 'fair' ? 60 : 45,
        estimated_value: valuationData.valuation,
        confidence_score: valuationData.confidenceScore,
        user_id: localStorage.getItem('userId') || '00000000-0000-0000-0000-000000000000' // Anonymous ID for guest users
      };

      const { data, error } = await supabase
        .from('valuations')
        .insert([dataToSave])
        .select()
        .single();

      if (error) {
        console.error('Error saving valuation:', error);
        throw new Error('Failed to save valuation to database');
      }

      console.log('Valuation saved successfully:', data);
      return data.id;
    } catch (err) {
      console.error('Error in saveValuationToSupabase:', err);
      throw err;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Calculate valuation
      const valuationResult = await calculateValuation(formData);
      setValuation(valuationResult);
      
      // Save to Supabase
      try {
        const savedId = await saveValuationToSupabase(valuationResult);
        setValuationId(savedId);
        
        // Store the latest valuation ID in localStorage
        localStorage.setItem('latest_valuation_id', savedId);
        
        // Redirect to the valuation result page
        if (savedId) {
          navigate(`/valuation-result/${savedId}`);
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Even if saving fails, still show the calculated result
      }
    } catch (e) {
      console.error('Valuation error:', e);
      setError('An error occurred while calculating your valuation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({});
    setValuation(null);
    setValuationId(undefined);
    localStorage.removeItem('manual_valuation_form');
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
