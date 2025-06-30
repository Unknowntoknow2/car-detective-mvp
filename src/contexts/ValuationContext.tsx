import React, { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProcessFreeValuationInput {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  vin?: string; // Add VIN to input
}

interface ProcessFreeValuationResult {
  valuationId: string;
  estimatedValue: number;
  confidenceScore: number;
}

interface ValuationContextType {
  isLoading: boolean;
  createValuation: (data: any) => Promise<any>;
  getValuationById: (id: string) => Promise<any>;
  updateValuation: (id: string, data: any) => Promise<any>;
  processFreeValuation: (input: ProcessFreeValuationInput) => Promise<ProcessFreeValuationResult>;
}

const ValuationContext = createContext<ValuationContextType | undefined>(undefined);

export const ValuationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const createValuation = useCallback(async (data: any) => {
    setIsLoading(true);
    try {
      console.log('🔄 Creating new valuation record with VIN:', data.vin);
      
      const { data: result, error } = await supabase
        .from('valuation_results')
        .insert(data)
        .select()
        .single();

      if (error) {
        console.error('❌ Valuation creation failed:', error);
        throw error;
      }

      if (result.vin) {
        console.log('✅ Valuation created with VIN:', result.vin, 'valuation_id:', result.id);
      } else {
        console.warn('⚠️ New valuation_results created without VIN — may break decoded vehicle linkage');
      }

      return result;
    } catch (error) {
      console.error('❌ Error creating valuation:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getValuationById = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('valuation_results')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('❌ Error fetching valuation:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('❌ Error in getValuationById:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateValuation = useCallback(async (id: string, data: any) => {
    setIsLoading(true);
    try {
      console.log('🔄 Updating valuation:', id, 'with VIN:', data.vin);
      
      const { data: result, error } = await supabase
        .from('valuation_results')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Valuation update failed:', error);
        throw error;
      }

      if (result.vin) {
        console.log('✅ Valuation updated with VIN:', result.vin);
      } else {
        console.warn('⚠️ Valuation updated without VIN');
      }

      return result;
    } catch (error) {
      console.error('❌ Error updating valuation:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Enhanced valuation calculation with real adjustments
  const calculateRealAdjustments = (input: ProcessFreeValuationInput, baseValue: number) => {
    const adjustments = [];
    let finalValue = baseValue;

    // Geographic adjustment based on ZIP code - FIXED: Handle empty ZIP codes
    const geographicMultipliers: Record<string, { multiplier: number; description: string }> = {
      '90210': { multiplier: 1.15, description: 'Beverly Hills premium market (+15%)' },
      '10001': { multiplier: 1.12, description: 'Manhattan premium market (+12%)' },
      '94102': { multiplier: 1.18, description: 'San Francisco premium market (+18%)' },
      '02101': { multiplier: 1.10, description: 'Boston premium market (+10%)' },
    };

    // FIXED: Only apply geographic adjustment if ZIP code is provided and valid
    if (input.zipCode && input.zipCode.length === 5 && /^\d{5}$/.test(input.zipCode)) {
      const geoAdjustment = geographicMultipliers[input.zipCode];
      if (geoAdjustment) {
        const impact = Math.round(baseValue * (geoAdjustment.multiplier - 1));
        adjustments.push({
          factor: 'Geographic Premium',
          impact: impact,
          percentage: (geoAdjustment.multiplier - 1) * 100,
          description: geoAdjustment.description
        });
        finalValue *= geoAdjustment.multiplier;
      } else {
        // Real ZIP code but not in our premium list - neutral adjustment
        adjustments.push({
          factor: 'Geographic Location',
          impact: 0,
          percentage: 0,
          description: `ZIP ${input.zipCode} - standard market conditions`
        });
      }
    } else if (input.zipCode && input.zipCode.length > 0) {
      // Invalid ZIP code format
      adjustments.push({
        factor: 'Geographic Location',
        impact: 0,
        percentage: 0,
        description: 'Invalid ZIP code - using national average'
      });
    }
    // If no ZIP code at all, don't add any geographic adjustment

    // Mileage adjustment
    const avgMileagePerYear = 12000;
    const vehicleAge = new Date().getFullYear() - input.year;
    const expectedMileage = avgMileagePerYear * vehicleAge;
    const mileageDifference = input.mileage - expectedMileage;
    
    if (Math.abs(mileageDifference) > 5000) {
      const mileageAdjustment = (mileageDifference / 1000) * -100; // $100 per 1000 miles difference
      adjustments.push({
        factor: 'Mileage Adjustment',
        impact: Math.round(mileageAdjustment),
        percentage: (mileageAdjustment / baseValue) * 100,
        description: `${input.mileage.toLocaleString()} miles vs expected ${expectedMileage.toLocaleString()} miles`
      });
      finalValue += mileageAdjustment;
    }

    // Condition adjustment
    const conditionMultipliers: Record<string, { multiplier: number; description: string }> = {
      'Excellent': { multiplier: 1.08, description: 'Excellent condition premium (+8%)' },
      'Very Good': { multiplier: 1.04, description: 'Very good condition (+4%)' },
      'Good': { multiplier: 1.0, description: 'Good condition (baseline)' },
      'Fair': { multiplier: 0.92, description: 'Fair condition penalty (-8%)' },
      'Poor': { multiplier: 0.80, description: 'Poor condition penalty (-20%)' }
    };

    const conditionAdjustment = conditionMultipliers[input.condition];
    if (conditionAdjustment && conditionAdjustment.multiplier !== 1.0) {
      const impact = Math.round(baseValue * (conditionAdjustment.multiplier - 1));
      adjustments.push({
        factor: 'Vehicle Condition',
        impact: impact,
        percentage: (conditionAdjustment.multiplier - 1) * 100,
        description: conditionAdjustment.description
      });
      finalValue = (finalValue - baseValue) + (baseValue * conditionAdjustment.multiplier);
    }

    // Year/Depreciation adjustment
    const currentYear = new Date().getFullYear();
    const yearsDifference = currentYear - input.year;
    if (yearsDifference > 0) {
      const depreciationRate = 0.15; // 15% per year average
      const depreciationMultiplier = Math.pow(1 - depreciationRate, yearsDifference);
      const depreciationImpact = Math.round(baseValue * (depreciationMultiplier - 1));
      
      adjustments.push({
        factor: 'Age Depreciation',
        impact: depreciationImpact,
        percentage: (depreciationMultiplier - 1) * 100,
        description: `${yearsDifference} year${yearsDifference > 1 ? 's' : ''} old vehicle depreciation`
      });
    }

    return {
      adjustments,
      finalValue: Math.max(1000, Math.round(finalValue)) // Minimum $1000
    };
  };

  const processFreeValuation = useCallback(async (input: ProcessFreeValuationInput): Promise<ProcessFreeValuationResult> => {
    setIsLoading(true);
    try {
      console.log('🚀 Processing valuation with VIN:', input.vin);
      console.log('🏠 ZIP Code provided:', input.zipCode || 'none');

      // Enhanced base value calculation
      const makeMultipliers: Record<string, number> = {
        'Toyota': 1.1,
        'Honda': 1.08,
        'Lexus': 1.25,
        'BMW': 1.3,
        'Mercedes-Benz': 1.35,
        'Audi': 1.25,
        'Nissan': 1.0,
        'Ford': 0.95,
        'Chevrolet': 0.92
      };

      const baseMSRP = 25000; // Base MSRP for calculations
      const makeMultiplier = makeMultipliers[input.make] || 1.0;
      const baseValue = Math.round(baseMSRP * makeMultiplier);

      // Calculate real adjustments
      const { adjustments, finalValue } = calculateRealAdjustments(input, baseValue);

      // Calculate confidence score based on data completeness
      let confidenceScore = 75; // Base confidence
      if (input.vin) confidenceScore += 10; // VIN provides more data
      if (input.zipCode && input.zipCode.length === 5 && /^\d{5}$/.test(input.zipCode)) {
        confidenceScore += 5; // Real location data
      }
      if (input.mileage > 0) confidenceScore += 5; // Actual mileage
      confidenceScore = Math.min(95, confidenceScore);

      // Create comprehensive valuation record
      const valuationData = {
        vin: input.vin || null, // FIXED: Preserve VIN properly
        make: input.make,
        model: input.model,
        year: input.year,
        mileage: input.mileage,
        condition: input.condition,
        zip_code: input.zipCode || null, // FIXED: Store empty ZIP as null instead of '90210'
        estimated_value: finalValue,
        confidence_score: confidenceScore,
        adjustments: adjustments,
        price_range_low: Math.round(finalValue * 0.92),
        price_range_high: Math.round(finalValue * 1.08),
        vehicle_data: {
          baseValue: baseValue,
          makeMultiplier: makeMultiplier,
          calculationMethod: 'enhanced_adjustment_model',
          dataCompleteness: {
            hasVin: !!input.vin,
            hasRealLocation: !!(input.zipCode && input.zipCode.length === 5 && /^\d{5}$/.test(input.zipCode)),
            hasActualMileage: input.mileage > 0
          }
        },
        valuation_type: 'free'
      };

      console.log('💰 Calculated valuation:', {
        baseValue,
        adjustments: adjustments.length,
        finalValue,
        confidenceScore,
        hasVin: !!input.vin,
        hasZip: !!input.zipCode
      });

      const result = await createValuation(valuationData);
      
      return {
        valuationId: result.id,
        estimatedValue: finalValue,
        confidenceScore: confidenceScore
      };
    } catch (error) {
      console.error('❌ Error processing enhanced valuation:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [createValuation]);

  const value = {
    isLoading,
    createValuation,
    getValuationById,
    updateValuation,
    processFreeValuation
  };

  return (
    <ValuationContext.Provider value={value}>
      {children}
    </ValuationContext.Provider>
  );
};

export const useValuation = () => {
  const context = useContext(ValuationContext);
  if (context === undefined) {
    throw new Error('useValuation must be used within a ValuationProvider');
  }
  return context;
};
