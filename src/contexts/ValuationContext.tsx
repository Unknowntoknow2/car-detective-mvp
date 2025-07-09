
import React, { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getFullyNormalizedMsrp } from '@/utils/valuation/msrpInflationNormalizer';
import { generateValuationExplanation } from '@/services/confidenceExplainer';

interface ProcessFreeValuationInput {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  vin?: string;
  trim_id?: string;
  trim?: string;
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
  triggerMarketOrchestration: (vehicleParams: any) => Promise<any>;
}

const ValuationContext = createContext<ValuationContextType | undefined>(undefined);

export const ValuationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const createValuation = useCallback(async (data: any) => {
    setIsLoading(true);
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('🔄 Creating new valuation record with VIN:', data.vin);
      }
      
      const { data: result, error } = await supabase
        .from('valuations')
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
        .from('valuations')
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
        .from('valuations')
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

  // Load real MSRP from model_trims table
  const getRealMSRP = async (make: string, model: string, year: number, trim_id?: string): Promise<{ msrp: number; source: string }> => {
    try {
      console.log('🔍 Looking up real MSRP for:', { make, model, year, trim_id });
      
      // First try to use trim_id if provided
      if (trim_id) {
        const { data: trimData, error } = await supabase
          .from('model_trims')
          .select('msrp, trim_name')
          .eq('id', trim_id)
          .maybeSingle();

        if (trimData?.msrp && !isNaN(trimData.msrp)) {
          console.log('✅ Found MSRP via trim_id:', trimData.msrp, 'for trim:', trimData.trim_name);
          // Apply inflation normalization
          const normalized = getFullyNormalizedMsrp(trimData.msrp, make, model, year);
          console.log('💰 Inflation-normalized MSRP:', normalized.finalMsrp, 'from original:', trimData.msrp);
          return { msrp: normalized.finalMsrp, source: 'trim_id_normalized' };
        }
      }
      
      // Fallback: try to find exact match with make/model/year
      const { data: fallbackData, error } = await supabase
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

      if (fallbackData?.msrp) {
        console.log('✅ Found fallback MSRP:', fallbackData.msrp, 'for trim:', fallbackData.trim_name);
        // Apply inflation normalization
        const normalized = getFullyNormalizedMsrp(fallbackData.msrp, make, model, year);
        console.log('💰 Inflation-normalized fallback MSRP:', normalized.finalMsrp, 'from original:', fallbackData.msrp);
        return { msrp: normalized.finalMsrp, source: 'database_fallback_normalized' };
      }

      console.warn('⚠️ No MSRP found in database, using make-based fallback');
      return { msrp: getMakeFallbackMSRP(make, year), source: 'make_fallback' };
      
    } catch (error) {
      console.error('❌ Error fetching MSRP:', error);
      return { msrp: getMakeFallbackMSRP(make, year), source: 'error_fallback' };
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

    const baseMSRP = makeMultipliers[make] || 25000; // Default fallback
    return baseMSRP + yearFactor;
  };

  // Enhanced valuation calculation with real MSRP
  const calculateRealAdjustments = async (input: ProcessFreeValuationInput): Promise<{
    adjustments: any[];
    finalValue: number;
    baseMSRP: number;
    msrpSource: string;
  }> => {
    const adjustments = [];
    
    // Get real MSRP from database
    const { msrp: baseMSRP, source: msrpSource } = await getRealMSRP(input.make, input.model, input.year, input.trim_id);
    console.log('💰 Using MSRP:', baseMSRP, 'from source:', msrpSource);
    
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
      baseMSRP: Math.round(baseMSRP),
      msrpSource
    };
  };

  const triggerMarketOrchestration = useCallback(async (vehicleParams: any) => {
    try {
      console.log('🚀 Triggering AIN Market Orchestration:', vehicleParams);
      
      // Create valuation request
      const { data: request, error: requestError } = await supabase
        .from('valuation_requests')
        .insert({
          vehicle_params: vehicleParams,
          user_id: (await supabase.auth.getUser()).data.user?.id || null
        })
        .select()
        .single();

      if (requestError) {
        throw requestError;
      }

      // Market orchestration has been removed
      console.log('ℹ️ Market orchestration feature removed');
      // Continue with valuation using existing data
      
      return { success: true, message: 'Market orchestration feature removed' };
    } catch (error) {
      console.error('❌ Market orchestration error:', error);
      throw error;
    }
  }, []);

  const processFreeValuation = useCallback(async (input: ProcessFreeValuationInput): Promise<ProcessFreeValuationResult> => {
    setIsLoading(true);
    try {
      console.log('🚀 Processing valuation with REAL data integrity for:', input.make, input.model, input.year);

      // INTEGRITY: Load follow-up data if VIN provided to get real user inputs
      let actualInput = { ...input };
      if (input.vin) {
        console.log('🔍 Loading follow-up data for VIN:', input.vin);
        try {
          const { data: followUpData } = await supabase
            .from('follow_up_answers')
            .select('*')
            .eq('vin', input.vin)
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (followUpData && followUpData.mileage > 0) {
            console.log('✅ Using follow-up data for calculations:', {
              mileage: followUpData.mileage,
              condition: followUpData.condition,
              zipCode: followUpData.zip_code
            });
            
            actualInput = {
              ...input,
              mileage: followUpData.mileage,
              condition: followUpData.condition || input.condition,
              zipCode: followUpData.zip_code || input.zipCode
            };
          } else {
            console.log('⚠️ No valid follow-up data found, using input values');
          }
        } catch (error) {
          console.log('❌ Error loading follow-up data:', error);
        }
      }

      // INTEGRITY: Fetch real market listings to base confidence on actual data
      const { data: marketListings } = await supabase
        .from('market_listings')
        .select('price, source, confidence_score, mileage, condition')
        .eq('make', actualInput.make)
        .eq('model', actualInput.model)
        .gte('year', actualInput.year - 2)
        .lte('year', actualInput.year + 2)
        .order('created_at', { ascending: false })
        .limit(20);

      const hasRealMarketData = marketListings && marketListings.length >= 3;
      console.log(`📊 Market data: ${marketListings?.length || 0} listings found`);

      // Calculate real adjustments with MSRP from database
      const { adjustments, finalValue, baseMSRP, msrpSource } = await calculateRealAdjustments(actualInput);

      // INTEGRITY: Data-driven confidence score (NO MORE HARDCODED 80%)
      let confidenceScore = 25; // Start with minimal baseline
      let confidenceDetails: string[] = [];

      // Market data confidence
      if (hasRealMarketData) {
        const marketConfidence = Math.min(40, marketListings.length * 3);
        confidenceScore += marketConfidence;
        confidenceDetails.push(`${marketConfidence}pts: ${marketListings.length} market comparables`);
      } else {
        confidenceDetails.push(`0pts: No market comparables found`);
      }

      // MSRP data confidence
      if (msrpSource === 'trim_id_normalized') {
        confidenceScore += 25;
        confidenceDetails.push(`25pts: Real trim-specific MSRP`);
      } else if (msrpSource === 'database_fallback_normalized') {
        confidenceScore += 15;
        confidenceDetails.push(`15pts: Database MSRP fallback`);
      } else {
        confidenceScore += 5;
        confidenceDetails.push(`5pts: Estimated MSRP (${msrpSource})`);
      }

      // Vehicle-specific data confidence
      if (actualInput.vin) {
        confidenceScore += 10;
        confidenceDetails.push(`10pts: VIN provided`);
      }
      if (actualInput.zipCode && /^\d{5}$/.test(actualInput.zipCode)) {
        confidenceScore += 5;
        confidenceDetails.push(`5pts: Valid location`);
      }
      if (actualInput.mileage > 0) {
        confidenceScore += 10;
        confidenceDetails.push(`10pts: Actual mileage`);
      } else {
        confidenceDetails.push(`0pts: No mileage data`);
      }

      confidenceScore = Math.min(95, confidenceScore);
      console.log(`🎯 Data-driven confidence: ${confidenceScore}% (${confidenceDetails.join(', ')})`);

      // INTEGRITY: Only create price ranges if we have real market data
      let priceRangeLow = null;
      let priceRangeHigh = null;
      if (hasRealMarketData) {
        const prices = marketListings.map(l => l.price).sort((a, b) => a - b);
        const median = prices[Math.floor(prices.length / 2)];
        const variance = Math.sqrt(prices.reduce((sum, p) => sum + Math.pow(p - median, 2), 0) / prices.length);
        
        priceRangeLow = Math.max(finalValue - variance, finalValue * 0.85);
        priceRangeHigh = Math.min(finalValue + variance, finalValue * 1.15);
        console.log(`📈 Real market-based range: $${priceRangeLow.toLocaleString()} - $${priceRangeHigh.toLocaleString()}`);
      } else {
        console.log(`❌ No price range - insufficient market data`);
      }

      // INTEGRITY: Enhanced data source tracking
      const dataSources: string[] = [];
      if (hasRealMarketData) dataSources.push(`market_listings (${marketListings.length})`);
      if (msrpSource.includes('trim_id')) dataSources.push('trim_database');
      else if (msrpSource.includes('database')) dataSources.push('vehicle_database');
      else dataSources.push('estimated_msrp');
      if (actualInput.vin) dataSources.push('vin_decode');
      if (actualInput !== input) dataSources.push('user_follow_up');

      // Initialize valuation notes array
      const valuationNotes: string[] = [];
      if (!hasRealMarketData) {
        valuationNotes.push("Used estimated MSRP - no recent market listings available");
      }
      if (msrpSource.includes('fallback')) {
        valuationNotes.push("MSRP based on manufacturer averages");
      }

      // Create transparent valuation record
      const valuationData = {
        vin: actualInput.vin || null,
        make: actualInput.make,
        model: actualInput.model,
        year: actualInput.year,
        mileage: actualInput.mileage,
        condition: actualInput.condition,
        zip_code: actualInput.zipCode || null,
        estimated_value: finalValue,
        confidence_score: confidenceScore,
        adjustments: adjustments.map(adj => ({
          ...adj,
          source: 'calculation_based',
          timestamp: new Date().toISOString()
        })),
        price_range_low: priceRangeLow ? Math.round(priceRangeLow) : null,
        price_range_high: priceRangeHigh ? Math.round(priceRangeHigh) : null,
        vehicle_data: {
          baseMSRP: baseMSRP,
          msrpSource: msrpSource,
          calculationMethod: hasRealMarketData ? 'market_analysis' : 'msrp_estimation',
          dataCompleteness: {
            hasVin: !!actualInput.vin,
            hasRealLocation: !!(actualInput.zipCode && /^\d{5}$/.test(actualInput.zipCode)),
            hasActualMileage: actualInput.mileage > 0,
            usedRealMSRP: !msrpSource.includes('fallback'),
            trimId: actualInput.trim_id || null,
            usedFollowUpData: actualInput !== input,
            marketListingsCount: marketListings?.length || 0,
            hasMarketRange: !!priceRangeLow
          }
        },
        data_source: {
          marketListings: marketListings?.length || 0,
          calculationMethod: hasRealMarketData ? 'market_analysis' : 'msrp_estimation',
          dataSourcesUsed: dataSources,
          confidenceBreakdown: confidenceDetails,
          timestamp: new Date().toISOString()
        },
        valuation_notes: valuationNotes,
        valuation_type: 'free'
      };

      console.log('💰 INTEGRITY-COMPLIANT valuation completed:', {
        baseMSRP,
        msrpSource,
        marketData: hasRealMarketData,
        confidenceScore,
        dataSources: dataSources.length,
        method: hasRealMarketData ? 'market_analysis' : 'msrp_estimation'
      });

      // Generate AI explanation before creating valuation
      try {
        console.log('🤖 Generating AI explanation for valuation');
        const aiExplanation = await generateValuationExplanation({
          vin: actualInput.vin,
          make: actualInput.make,
          model: actualInput.model,
          year: actualInput.year,
          trim: actualInput.trim,
          mileage: actualInput.mileage,
          condition: actualInput.condition,
          zipCode: actualInput.zipCode,
          estimated_value: finalValue,
          confidence_score: confidenceScore,
          data_sources: dataSources,
          valuation_notes: valuationNotes,
          adjustments: adjustments,
          baseMSRP: baseMSRP,
          msrpSource: msrpSource,
          marketListingsCount: marketListings?.length || 0
        });

        // Add AI explanation to valuation notes
        if (aiExplanation) {
          valuationNotes.push(`🔍 ${aiExplanation}`);
          // Update the valuation data with the new notes
          valuationData.valuation_notes = valuationNotes;
        }
      } catch (error) {
        console.error('❌ Error generating AI explanation:', error);
        // Continue without AI explanation - not a breaking error
      }

      const result = await createValuation(valuationData);
      
      return {
        valuationId: result.id,
        estimatedValue: finalValue,
        confidenceScore: confidenceScore
      };
    } catch (error) {
      console.error('❌ Error processing data-integrity valuation:', error);
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
    processFreeValuation,
    triggerMarketOrchestration
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
