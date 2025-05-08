import { supabase } from '@/integrations/supabase/client';
import {
  ValuationInput,
  ValuationResult,
} from '@/types/valuation';
import {
  EnhancedValuationParams,
  FinalValuationResult,
} from '@/utils/valuation/types';
import { RulesEngine } from '@/utils/rules/RulesEngine';
import { accidentRules } from '@/utils/rules/accidentRules';
import { carfaxRules } from '@/utils/rules/carfaxRules';
import { colorRules } from '@/utils/rules/colorRules';
import { conditionRules } from '@/utils/rules/conditionRules';
import { demandRules } from '@/utils/rules/demandRules';
import { featureRules } from '@/utils/rules/featureRules';
import { mileageRules } from '@/utils/rules/mileageRules';
import { photoRules } from '@/utils/rules/photoRules';
import { titleRules } from '@/utils/rules/titleRules';
import { trimRules } from '@/utils/rules/trimRules';
import { vehicleTypeRules } from '@/utils/rules/vehicleTypeRules';

const rules = [
  ...accidentRules,
  ...carfaxRules,
  ...colorRules,
  ...conditionRules,
  ...demandRules,
  ...featureRules,
  ...mileageRules,
  ...photoRules,
  ...titleRules,
  ...trimRules,
  ...vehicleTypeRules,
];

const engine = new RulesEngine(rules);

const calculateBaseValue = async (params: ValuationInput): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('valuations_data')
      .select('base_price')
      .eq('make', params.make)
      .eq('model', params.model)
      .eq('year', params.year)
      .single();

    if (error) {
      console.error('Error fetching base value:', error);
      return 15000; // Provide a default base value
    }

    return data?.base_price || 15000; // Use the fetched base price or a default value
  } catch (error) {
    console.error('Error calculating base value:', error);
    return 15000; // Provide a default base value in case of an error
  }
};

const calculateValuation = async (params: EnhancedValuationParams): Promise<FinalValuationResult> => {
  // Ensure zipCode is defined for ValuationInput
  const valuationInput: ValuationInput = {
    identifierType: 'manual',
    make: params.make,
    model: params.model,
    year: params.year,
    mileage: params.mileage,
    condition: params.condition,
    zipCode: params.zipCode || params.zip || '10001', // Use zipCode or zip with a fallback
    // ... include other properties as needed
  };

  const baseValue = await calculateBaseValue(valuationInput);

  const facts = {
    baseValue,
    make: params.make,
    model: params.model,
    year: params.year,
    mileage: params.mileage,
    condition: params.condition,
    trim: params.trim,
    bodyType: params.bodyType,
    fuelType: params.fuelType,
    zipCode: params.zipCode,
    photoScore: params.photoScore,
    accidentCount: params.accidentCount,
    premiumFeatures: params.premiumFeatures,
    mpg: params.mpg,
    aiConditionData: params.aiConditionData,
    exteriorColor: params.exteriorColor,
    colorMultiplier: params.colorMultiplier,
    saleDate: params.saleDate,
    bodyStyle: params.bodyStyle,
  };

  const { result, auditTrail } = engine.evaluate(facts);

  const finalValue = result !== null ? result : baseValue;
  const priceRange = [finalValue * 0.9, finalValue * 1.1];
  const confidenceScore = 80;

  // Add the explanation property to the result
  return {
    baseValue: result.baseValue,
    adjustments: result.adjustments, 
    finalValue: result.finalValue,
    confidenceScore: result.confidenceScore,
    priceRange: result.priceRange,
    estimatedValue: result.finalValue,
    explanation: `This valuation is based on ${params.year} ${params.make} ${params.model} in ${params.condition} condition` 
  };
};

export const buildValuationReport = async (
  params: EnhancedValuationParams
): Promise<FinalValuationResult> => {
  try {
    // Call the calculateValuation function to get the valuation result
    const valuationResult = await calculateValuation(params);
    return valuationResult;
  } catch (error) {
    console.error('Error in buildValuationReport:', error);
    
    // Return a default or error state valuation result
    return {
      baseValue: 0,
      adjustments: [],
      finalValue: 0,
      confidenceScore: 0,
      priceRange: [0, 0],
      estimatedValue: 0,
      explanation: 'Failed to generate valuation report due to an error.'
    };
  }
};
