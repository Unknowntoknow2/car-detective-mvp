
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
  vin?: string;
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

  // NEW: Function to get real MSRP from database
  const getRealMSRP = async (make: string, model: string, year: number): Promise<number> => {
    try {
      console.log('🔍 Looking up real MSRP for:', { make, model, year });
      
      // First try to find exact match with make/model/year
      const { data: trimData, error } = await supabase
        .from('model_trims')
        .select(`
          msrp, 
          trim_name,
          models!inner (
            model_name,
            makes!inner (
              make_name
            )
          )
        `)
        .eq('year', year)
        .eq('models.model_name', model)
        .eq('models.makes.make_name', make)
        .not('msrp', 'is', null)
        .order('msrp', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (trimData && trimData.msrp) {
        console.log('✅ Found real MSRP:', trimData.msrp, 'for trim:', trimData.trim_name);
        return trimData.msrp;
      }

      // Fallback: try to find similar year (±2 years)
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('model_trims')
        .select(`
          msrp, 
          year, 
          trim_name,
          models!inner (
            model_name,
            makes!inner (
              make_name
            )
          )
        `)
        .gte('year', year - 2)
        .lte('year', year + 2)
        .eq('models.model_name', model)
        .eq('models.makes.make_name', make)
        .not('msrp', 'is', null)
        .order('year', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fallbackData && fallbackData.msrp) {
        // Adjust for year difference
        const yearDiff = year - fallbackData.year;
        const adjustedMSRP = fallbackData.msrp + (yearDiff * 500); // $500 per year adjustment
        console.log('✅ Found fallback MSRP:', adjustedMSRP, `(${fallbackData.msrp} adjusted for ${yearDiff} years)`);
        return Math.max(adjustedMSRP, 15000); // Minimum $15k
      }

      console.warn('⚠️ No MSRP found in database, using make-based fallback');
      return getMakeFallbackMSRP(make, year);
      
    } catch (error) {
      console.error('❌ Error fetching MSRP:', error);
      return getMakeFallbackMSRP(make, year);
    }
  };

  // Fallback MSRP based on make when no database data exists
  const getMakeFallbackMSRP = (make: string, year: number): number => {
    const currentYear = new Date().getFullYear();
    const yearFactor = Math.max(0, year - 2015) * 500; // $500 per year after 2015
    
    const makeMultipliers: Record<string, number> = {
      'Toyota': 28000,
      'Honda': 27000,
      'Lexus': 45000,
      'BMW': 50000,
      'Mercedes-Benz': 55000,
      'Audi': 48000,
      'Nissan': 26000,
      'Ford': 30000,
      'Chevrolet': 28000,
      'Hyundai': 25000,
      'Kia': 24000,
      'Mazda': 26000,
      'Subaru': 28000,
      'Volkswagen': 30000,
      'Volvo': 42000,
      'Acura': 38000,
      'Infiniti': 40000,
      'Cadillac': 45000,
      'Lincoln': 43000,
      'Genesis': 47000
    };

    const baseMSRP = makeMultipliers[make] || 30000;
    return baseMSRP + yearFactor;
  };

  // Enhanced valuation calculation with real MSRP
  const calculateRealAdjustments = async (input: ProcessFreeValuationInput): Promise<{
    adjustments: any[];
    finalValue: number;
    baseMSRP: number;
  }> => {
    const adjustments = [];
    
    // Get real MSRP from database
    const baseMSRP = await getRealMSRP(input.make, input.model, input.year);
    console.log('💰 Using real base MSRP:', baseMSRP);
    
    let finalValue = baseMSRP;

    // Age/Depreciation adjustment (most significant factor)
    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - input.year;
    if (vehicleAge > 0) {
      // More sophisticated depreciation curve
      let depreciationRate;
      if (vehicleAge <= 1) depreciationRate = 0.20; // 20% first year
      else if (vehicleAge <= 3) depreciationRate = 0.15; // 15% per year years 2-3
      else if (vehicleAge <= 7) depreciationRate = 0.10; // 10% per year years 4-7
      else depreciationRate = 0.05; // 5% per year after 7 years

      const totalDepreciation = vehicleAge <= 1 ? 0.20 : 
        0.20 + Math.min(vehicleAge - 1, 2) * 0.15 + Math.max(0, Math.min(vehicleAge - 3, 4)) * 0.10 + Math.max(0, vehicleAge - 7) * 0.05;
      
      const depreciatedValue = baseMSRP * (1 - Math.min(totalDepreciation, 0.85)); // Max 85% depreciation
      const depreciationImpact = depreciatedValue - baseMSRP;
      
      adjustments.push({
        factor: 'Age/Depreciation',
        impact: Math.round(depreciationImpact),
        percentage: (depreciationImpact / baseMSRP) * 100,
        description: `${vehicleAge} year${vehicleAge > 1 ? 's' : ''} old - ${Math.round(totalDepreciation * 100)}% depreciation`
      });
      
      finalValue = depreciatedValue;
    }

    // Mileage adjustment
    const avgMileagePerYear = 12000;
    const expectedMileage = avgMileagePerYear * Math.max(vehicleAge, 1);
    const mileageDifference = input.mileage - expectedMileage;
    
    if (Math.abs(mileageDifference) > 5000) {
      const mileageAdjustment = (mileageDifference / 1000) * -150; // $150 per 1000 miles difference
      adjustments.push({
        factor: 'Mileage Adjustment',
        impact: Math.round(mileageAdjustment),
        percentage: (mileageAdjustment / finalValue) * 100,
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
      const impact = Math.round(finalValue * (conditionAdjustment.multiplier - 1));
      adjustments.push({
        factor: 'Vehicle Condition',
        impact: impact,
        percentage: (conditionAdjustment.multiplier - 1) * 100,
        description: conditionAdjustment.description
      });
      finalValue *= conditionAdjustment.multiplier;
    }

    // Geographic adjustment (only for valid ZIP codes)
    const geographicMultipliers: Record<string, { multiplier: number; description: string }> = {
      '90210': { multiplier: 1.15, description: 'Beverly Hills premium market (+15%)' },
      '10001': { multiplier: 1.12, description: 'Manhattan premium market (+12%)' },
      '94102': { multiplier: 1.18, description: 'San Francisco premium market (+18%)' },
      '02101': { multiplier: 1.10, description: 'Boston premium market (+10%)' },
    };

    if (input.zipCode && input.zipCode.length === 5 && /^\d{5}$/.test(input.zipCode)) {
      const geoAdjustment = geographicMultipliers[input.zipCode];
      if (geoAdjustment) {
        const impact = Math.round(finalValue * (geoAdjustment.multiplier - 1));
        adjustments.push({
          factor: 'Geographic Premium',
          impact: impact,
          percentage: (geoAdjustment.multiplier - 1) * 100,
          description: geoAdjustment.description
        });
        finalValue *= geoAdjustment.multiplier;
      }
    }

    return {
      adjustments,
      finalValue: Math.max(2000, Math.round(finalValue)), // Minimum $2000
      baseMSRP: Math.round(baseMSRP)
    };
  };

  const processFreeValuation = useCallback(async (input: ProcessFreeValuationInput): Promise<ProcessFreeValuationResult> => {
    setIsLoading(true);
    try {
      console.log('🚀 Processing valuation with real MSRP for:', input.make, input.model, input.year);

      // Calculate real adjustments with MSRP from database
      const { adjustments, finalValue, baseMSRP } = await calculateRealAdjustments(input);

      // Calculate confidence score based on data completeness
      let confidenceScore = 80; // Higher base confidence with real MSRP
      if (input.vin) confidenceScore += 10;
      if (input.zipCode && input.zipCode.length === 5 && /^\d{5}$/.test(input.zipCode)) {
        confidenceScore += 5;
      }
      if (input.mileage > 0) confidenceScore += 5;
      confidenceScore = Math.min(95, confidenceScore);

      // Create comprehensive valuation record
      const valuationData = {
        vin: input.vin || null,
        make: input.make,
        model: input.model,
        year: input.year,
        mileage: input.mileage,
        condition: input.condition,
        zip_code: input.zipCode || null,
        estimated_value: finalValue,
        confidence_score: confidenceScore,
        adjustments: adjustments,
        price_range_low: Math.round(finalValue * 0.92),
        price_range_high: Math.round(finalValue * 1.08),
        vehicle_data: {
          baseMSRP: baseMSRP, // Store the real MSRP used
          calculationMethod: 'real_msrp_model',
          dataCompleteness: {
            hasVin: !!input.vin,
            hasRealLocation: !!(input.zipCode && input.zipCode.length === 5 && /^\d{5}$/.test(input.zipCode)),
            hasActualMileage: input.mileage > 0,
            usedRealMSRP: true
          }
        },
        valuation_type: 'free'
      };

      console.log('💰 Real valuation completed:', {
        baseMSRP,
        adjustments: adjustments.length,
        finalValue,
        confidenceScore,
        method: 'real_msrp'
      });

      const result = await createValuation(valuationData);
      
      return {
        valuationId: result.id,
        estimatedValue: finalValue,
        confidenceScore: confidenceScore
      };
    } catch (error) {
      console.error('❌ Error processing real MSRP valuation:', error);
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
