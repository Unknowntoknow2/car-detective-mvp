import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { runCorrectedValuationPipeline } from '@/utils/valuation/correctedValuationPipeline';

interface ValuationState {
  isLoading: boolean;
  error: string | null;
  data: any | null;
  currentValuationId: string | null;
}

type ValuationAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_DATA'; payload: any }
  | { type: 'SET_VALUATION_ID'; payload: string | null };

const initialState: ValuationState = {
  isLoading: false,
  error: null,
  data: null,
  currentValuationId: null
};

function valuationReducer(state: ValuationState, action: ValuationAction): ValuationState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_DATA':
      return { ...state, data: action.payload };
    case 'SET_VALUATION_ID':
      return { ...state, currentValuationId: action.payload };
    default:
      return state;
  }
}

interface ValuationContextType {
  state: ValuationState;
  dispatch: React.Dispatch<ValuationAction>;
  processFreeValuation: (data: any) => Promise<{ valuationId: string; estimatedValue: number; confidenceScore: number; }>;
  processPremiumValuation: (data: any) => Promise<{ valuationId: string; estimatedValue: number; confidenceScore: number; }>;
  processVinLookup: (vin: string, decodedData: any) => Promise<{ valuationId: string; estimatedValue: number; confidenceScore: number; }>;
  getValuationById: (id: string) => Promise<any>;
  isLoading: boolean;
}

const ValuationContext = createContext<ValuationContextType | undefined>(undefined);

export function ValuationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(valuationReducer, initialState);

  const saveValuationResult = async (valuationData: any) => {
    // Validate the valuation before saving
    if (!valuationData.estimated_value || valuationData.estimated_value <= 0) {
      console.error('❌ Attempting to save invalid valuation with $0 value:', valuationData);
      throw new Error('Cannot save valuation with zero or negative value');
    }

    console.log('💾 Saving valuation result:', valuationData);

    const { data, error } = await supabase
      .from('valuation_results')
      .insert([valuationData])
      .select()
      .single();

    if (error) {
      console.error('❌ Database error saving valuation:', error);
      throw error;
    }

    console.log('✅ Valuation saved successfully:', data);
    return data;
  };

  const getValuationById = async (id: string) => {
    const { data, error } = await supabase
      .from('valuation_results')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  };

  const processVinLookup = async (vin: string, decodedData: any) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      console.log('🔍 Processing VIN lookup with real valuation engine:', { vin, decodedData });

      // Run the corrected valuation pipeline with decoded VIN data
      const pipelineResult = await runCorrectedValuationPipeline({
        vin,
        make: decodedData.make || 'Unknown',
        model: decodedData.model || 'Unknown',
        year: decodedData.year || new Date().getFullYear(),
        mileage: 50000, // Default mileage, will be updated via follow-up
        condition: 'good',
        zipCode: '90210', // Default, will be updated via follow-up
        trim: decodedData.trim,
        color: decodedData.color,
        bodyType: decodedData.bodyType,
        fuelType: decodedData.fuelType,
        transmission: decodedData.transmission,
      });

      console.log('🚀 Real valuation engine result:', pipelineResult);

      // Validate pipeline result
      if (!pipelineResult.success || !pipelineResult.valuation.estimatedValue || pipelineResult.valuation.estimatedValue <= 0) {
        throw new Error(`Real valuation engine failed: ${pipelineResult.error || 'Invalid estimated value'}`);
      }

      // Save to database with comprehensive data
      const valuationResult = await saveValuationResult({
        vin,
        make: decodedData.make || 'Unknown',
        model: decodedData.model || 'Unknown',
        year: decodedData.year || new Date().getFullYear(),
        mileage: 50000,
        condition: 'good',
        estimated_value: pipelineResult.valuation.estimatedValue,
        confidence_score: pipelineResult.valuation.confidenceScore,
        price_range_low: pipelineResult.valuation.priceRange[0],
        price_range_high: pipelineResult.valuation.priceRange[1],
        adjustments: pipelineResult.valuation.adjustments,
        vehicle_data: {
          ...decodedData,
          marketAnalysis: pipelineResult.valuation.marketAnalysis,
          riskFactors: pipelineResult.valuation.riskFactors,
          recommendations: pipelineResult.valuation.recommendations,
          basePrice: pipelineResult.valuation.basePrice
        },
        valuation_type: 'free',
        zip_code: '90210'
      });

      dispatch({ type: 'SET_DATA', payload: valuationResult });
      dispatch({ type: 'SET_VALUATION_ID', payload: valuationResult.id });
      
      // Store in localStorage for navigation
      localStorage.setItem('latest_valuation_id', valuationResult.id);

      console.log('✅ VIN lookup with real valuation engine completed successfully:', valuationResult);

      return { 
        valuationId: valuationResult.id, 
        estimatedValue: valuationResult.estimated_value, 
        confidenceScore: valuationResult.confidence_score 
      };
    } catch (error) {
      console.error('❌ Error processing VIN lookup with real valuation engine:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      dispatch({ type: 'SET_ERROR', payload: `Failed to process VIN lookup: ${errorMessage}` });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const processFreeValuation = async (data: any) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      console.log('🆓 Processing free valuation with real engine:', data);

      // Run the real valuation engine
      const pipelineResult = await runCorrectedValuationPipeline({
        vin: '', // No VIN for manual entry
        make: data.make,
        model: data.model,
        year: data.year,
        mileage: data.mileage,
        condition: data.condition,
        zipCode: data.zipCode,
        trim: data.trim,
        bodyType: data.bodyType,
        fuelType: data.fuelType,
        transmission: data.transmission
      });

      if (!pipelineResult.success) {
        throw new Error(pipelineResult.error || 'Valuation calculation failed');
      }
      
      const valuationResult = await saveValuationResult({
        make: data.make,
        model: data.model,
        year: data.year,
        mileage: data.mileage,
        condition: data.condition,
        estimated_value: pipelineResult.valuation.estimatedValue,
        confidence_score: pipelineResult.valuation.confidenceScore,
        price_range_low: pipelineResult.valuation.priceRange[0],
        price_range_high: pipelineResult.valuation.priceRange[1],
        adjustments: pipelineResult.valuation.adjustments,
        vehicle_data: {
          ...data,
          marketAnalysis: pipelineResult.valuation.marketAnalysis,
          riskFactors: pipelineResult.valuation.riskFactors,
          recommendations: pipelineResult.valuation.recommendations,
          basePrice: pipelineResult.valuation.basePrice
        },
        valuation_type: 'free',
        zip_code: data.zipCode
      });

      dispatch({ type: 'SET_DATA', payload: valuationResult });
      dispatch({ type: 'SET_VALUATION_ID', payload: valuationResult.id });
      
      localStorage.setItem('latest_valuation_id', valuationResult.id);
      
      return { 
        valuationId: valuationResult.id, 
        estimatedValue: valuationResult.estimated_value, 
        confidenceScore: valuationResult.confidence_score 
      };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to process free valuation' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const processPremiumValuation = async (data: any) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      console.log('💎 Processing premium valuation with enhanced engine:', data);

      // Enhanced valuation with premium features
      const pipelineResult = await runCorrectedValuationPipeline({
        vin: data.vin || '',
        make: data.make,
        model: data.model,
        year: data.year,
        mileage: data.mileage,
        condition: data.condition,
        zipCode: data.zipCode,
        trim: data.trim,
        bodyType: data.bodyType,
        fuelType: data.fuelType,
        transmission: data.transmission,
        followUpAnswers: data.followUpAnswers // Premium includes full follow-up data
      });

      if (!pipelineResult.success) {
        throw new Error(pipelineResult.error || 'Premium valuation calculation failed');
      }

      // Premium valuations get higher confidence scores
      const enhancedConfidence = Math.min(95, pipelineResult.valuation.confidenceScore + 8);
      
      const valuationResult = await saveValuationResult({
        vin: data.vin,
        make: data.make,
        model: data.model,
        year: data.year,
        mileage: data.mileage,
        condition: data.condition,
        estimated_value: pipelineResult.valuation.estimatedValue,
        confidence_score: enhancedConfidence,
        price_range_low: pipelineResult.valuation.priceRange[0],
        price_range_high: pipelineResult.valuation.priceRange[1],
        adjustments: pipelineResult.valuation.adjustments,
        vehicle_data: {
          ...data,
          marketAnalysis: pipelineResult.valuation.marketAnalysis,
          riskFactors: pipelineResult.valuation.riskFactors,
          recommendations: pipelineResult.valuation.recommendations,
          basePrice: pipelineResult.valuation.basePrice,
          premiumFeatures: true
        },
        valuation_type: 'premium',
        zip_code: data.zipCode
      });

      dispatch({ type: 'SET_DATA', payload: valuationResult });
      dispatch({ type: 'SET_VALUATION_ID', payload: valuationResult.id });
      
      localStorage.setItem('latest_valuation_id', valuationResult.id);
      
      return { 
        valuationId: valuationResult.id, 
        estimatedValue: valuationResult.estimated_value, 
        confidenceScore: valuationResult.confidence_score 
      };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to process premium valuation' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <ValuationContext.Provider value={{
      state,
      dispatch,
      processFreeValuation,
      processPremiumValuation,
      processVinLookup,
      getValuationById,
      isLoading: state.isLoading
    }}>
      {children}
    </ValuationContext.Provider>
  );
}

export function useValuation() {
  const context = useContext(ValuationContext);
  if (context === undefined) {
    throw new Error('useValuation must be used within a ValuationProvider');
  }
  return context;
}
