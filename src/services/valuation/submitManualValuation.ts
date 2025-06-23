
import { ManualEntryFormData } from '@/types/manual-entry';
import { supabase } from '@/integrations/supabase/client';

export const submitManualValuation = async (data: ManualEntryFormData): Promise<string> => {
  try {
    console.log('📝 Submitting manual valuation:', data);

    // Calculate a basic valuation based on the provided data
    const baseValue = calculateBaseValue(data);
    
    // Save to database
    const { data: savedData, error } = await supabase
      .from('valuation_results')
      .insert([{
        make: data.make,
        model: data.model,
        year: data.year,
        mileage: data.mileage || 50000,
        condition: data.condition || 'Good',
        estimated_value: baseValue,
        confidence_score: 75, // Manual entries get moderate confidence
        price_range_low: baseValue * 0.92,
        price_range_high: baseValue * 1.08,
        adjustments: [],
        vehicle_data: data,
        valuation_type: 'free',
        zip_code: data.zipCode || '90210'
      }])
      .select()
      .single();

    if (error) {
      console.error('❌ Database error saving manual valuation:', error);
      throw error;
    }

    // Store in localStorage for navigation
    localStorage.setItem('latest_valuation_id', savedData.id);

    console.log('✅ Manual valuation saved successfully:', savedData);
    return savedData.id;
    
  } catch (error) {
    console.error('❌ Error submitting manual valuation:', error);
    throw error;
  }
};

function calculateBaseValue(data: ManualEntryFormData): number {
  const currentYear = new Date().getFullYear();
  const age = currentYear - data.year;
  
  // Base calculation similar to BasePriceService
  let baseValue: number;
  if (age <= 1) {
    baseValue = 35000;
  } else if (age <= 3) {
    baseValue = 28000;
  } else if (age <= 5) {
    baseValue = 22000;
  } else if (age <= 8) {
    baseValue = 18000;
  } else if (age <= 12) {
    baseValue = 12000;
  } else {
    baseValue = 8000;
  }

  // Simple condition adjustment
  const conditionMultipliers: Record<string, number> = {
    'Excellent': 1.1,
    'Very Good': 1.05,
    'Good': 1.0,
    'Fair': 0.85,
    'Poor': 0.7
  };

  const conditionMultiplier = conditionMultipliers[data.condition || 'Good'] || 1.0;
  baseValue *= conditionMultiplier;

  // Mileage adjustment
  const expectedMileage = age * 12000;
  const actualMileage = data.mileage || 50000;
  if (actualMileage > expectedMileage + 20000) {
    baseValue *= 0.9; // High mileage penalty
  }

  return Math.max(3000, Math.round(baseValue));
}
