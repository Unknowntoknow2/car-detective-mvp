
import { ValuationEngine, ValuationEngineInput, ValuationEngineResult } from '@/services/valuation/ValuationEngine';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { supabase } from '@/integrations/supabase/client';

export interface CorrectedValuationInput {
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage?: number;
  condition?: string;
  zipCode: string;
  trim?: string;
  color?: string;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  followUpAnswers?: FollowUpAnswers;
}

export interface CorrectedValuationResult {
  success: boolean;
  valuation: {
    estimatedValue: number;
    confidenceScore: number;
    basePrice: number;
    adjustments: any[];
    priceRange: [number, number];
    marketAnalysis?: any;
    riskFactors?: any[];
    recommendations?: string[];
  };
  error?: string;
}

export async function runCorrectedValuationPipeline(
  input: CorrectedValuationInput
): Promise<CorrectedValuationResult> {
  try {
    console.log('🚀 Starting corrected valuation pipeline:', input);
    console.log('🧠 Running correctedValuationPipeline with:');
    console.log('  VIN:', input.vin);
    console.log('  Year:', input.year);
    console.log('  Decoded Trim:', input.trim);
    console.log('  Mileage:', input.followUpAnswers?.mileage);
    console.log('  ZIP:', input.zipCode);

    // Get or create follow-up answers
    let followUpAnswers = input.followUpAnswers;
    
    if (!followUpAnswers) {
      // Check if follow-up answers exist for this VIN
      const { data: existingAnswers } = await supabase
        .from('follow_up_answers')
        .select('*')
        .eq('vin', input.vin)
        .maybeSingle();

      if (existingAnswers) {
        followUpAnswers = existingAnswers as FollowUpAnswers;
        console.log('📋 Found existing follow-up answers:', followUpAnswers);
      } else {
        // Create default follow-up answers with provided data
        followUpAnswers = createDefaultFollowUpAnswers(input);
        console.log('📝 Created default follow-up answers:', followUpAnswers);
      }
    }

    // Validate follow-up answers structure
    followUpAnswers = validateAndSanitizeFollowUpAnswers(followUpAnswers);

    // Fix year override conflict: Always prefer decoded vehicle year
    let finalYear = input.year; // Start with input year (likely from decoded vehicle)
    
    // Check if we have decoded vehicle data to get the authoritative year
    const { data: decodedVehicle } = await supabase
      .from('decoded_vehicles')
      .select('year')
      .eq('vin', input.vin)
      .maybeSingle();
    
    if (decodedVehicle?.year) {
      finalYear = decodedVehicle.year;
      console.log('🔧 Using decoded vehicle year:', finalYear, 'over input year:', input.year);
      
      if (followUpAnswers.year && followUpAnswers.year !== finalYear) {
        console.log('⚠️ Year conflict resolved: form=' + followUpAnswers.year + ' vs decoded=' + finalYear + ' — using decoded');
      }
    } else if (followUpAnswers.year && followUpAnswers.year !== input.year) {
      // If no decoded vehicle data, prefer form year over input year if they differ
      finalYear = followUpAnswers.year;
      console.log('📝 Using form year:', finalYear, 'over input year:', input.year);
    }

    // Initialize valuation engine
    const engine = new ValuationEngine();

    // Prepare engine input with resolved year
    const engineInput: ValuationEngineInput = {
      vin: input.vin,
      make: input.make,
      model: input.model,
      year: finalYear, // Use resolved year
      followUpData: {
        ...followUpAnswers,
        year: finalYear // Ensure follow-up data also uses resolved year
      },
      decodedVehicleData: {
        trim: input.trim,
        color: input.color,
        bodyType: input.bodyType,
        fuelType: input.fuelType,
        transmission: input.transmission
      }
    };

    // Calculate valuation using the engine (now includes market data diagnostics)
    const result = await engine.calculateValuation(engineInput);
    console.log('🎯 Valuation engine result:', result);
    console.log('🧮 Calculated base value:', result.basePrice, 'Confidence:', result.confidenceScore + '%');

    // Log market data availability
    if (result.marketAnalysis) {
      console.log('📊 Market data status:');
      console.log('  - MSRP data:', result.marketAnalysis.msrpDataAvailable ? '✅' : '❌');
      console.log('  - Auction data:', result.marketAnalysis.auctionDataAvailable ? '✅' : '❌');
      console.log('  - Competitor data:', result.marketAnalysis.competitorDataAvailable ? '✅' : '❌');
      console.log('  - Market listings:', result.marketAnalysis.marketListingsAvailable ? '✅' : '❌');
    }

    // Validate result
    if (!result.estimatedValue || result.estimatedValue <= 0) {
      throw new Error('Invalid valuation result: estimated value is zero or negative');
    }

    return {
      success: true,
      valuation: {
        estimatedValue: result.estimatedValue,
        confidenceScore: result.confidenceScore,
        basePrice: result.basePrice,
        adjustments: result.adjustments.map(adj => ({
          factor: adj.factor,
          impact: Math.round(result.basePrice * adj.impact),
          percentage: adj.percentage,
          description: adj.description
        })),
        priceRange: result.priceRange,
        marketAnalysis: result.marketAnalysis,
        riskFactors: result.riskFactors,
        recommendations: result.recommendations
      }
    };

  } catch (error) {
    console.error('❌ Error in corrected valuation pipeline:', error);
    return {
      success: false,
      valuation: {
        estimatedValue: 0,
        confidenceScore: 0,
        basePrice: 0,
        adjustments: [],
        priceRange: [0, 0]
      },
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

function createDefaultFollowUpAnswers(input: CorrectedValuationInput): FollowUpAnswers {
  return {
    vin: input.vin,
    zip_code: input.zipCode,
    mileage: input.mileage || 50000,
    condition: input.condition || 'good',
    accidents: {
      hadAccident: false,
      count: 0,
      severity: 'minor',
      repaired: false,
      frameDamage: false,
      description: '',
      types: [],
      repairShops: [],
      airbagDeployment: false
    },
    transmission: input.transmission || 'automatic',
    title_status: 'clean',
    previous_use: 'personal',
    serviceHistory: {
      hasRecords: false,
      frequency: 'unknown',
      dealerMaintained: false,
      description: '',
      services: []
    },
    tire_condition: 'good',
    exterior_condition: 'good',
    interior_condition: 'good',
    brake_condition: 'good',
    dashboard_lights: [],
    modifications: {
      hasModifications: false,
      modified: false,
      types: [],
      additionalNotes: ''
    },
    features: [],
    additional_notes: '',
    completion_percentage: 60, // Default completion since we have basic data
    is_complete: false,
    previous_owners: 1,
    loan_balance: 0,
    payoffAmount: 0,
    year: input.year // Use the input year for default follow-up
  };
}

function validateAndSanitizeFollowUpAnswers(answers: FollowUpAnswers): FollowUpAnswers {
  // Ensure all required nested objects exist with proper structure
  const sanitized = { ...answers };

  // Validate accidents structure
  if (!sanitized.accidents || typeof sanitized.accidents !== 'object') {
    sanitized.accidents = {
      hadAccident: false,
      count: 0,
      severity: 'minor',
      repaired: false,
      frameDamage: false,
      description: '',
      types: [],
      repairShops: [],
      airbagDeployment: false
    };
  }

  // Validate serviceHistory structure
  if (!sanitized.serviceHistory || typeof sanitized.serviceHistory !== 'object') {
    sanitized.serviceHistory = {
      hasRecords: false,
      frequency: 'unknown',
      dealerMaintained: false,
      description: '',
      services: []
    };
  }

  // Validate modifications structure
  if (!sanitized.modifications || typeof sanitized.modifications !== 'object') {
    sanitized.modifications = {
      hasModifications: false,
      modified: false,
      types: [],
      additionalNotes: ''
    };
  }

  // Ensure arrays exist
  if (!Array.isArray(sanitized.dashboard_lights)) {
    sanitized.dashboard_lights = [];
  }
  if (!Array.isArray(sanitized.features)) {
    sanitized.features = [];
  }

  // Ensure numeric values
  if (!sanitized.mileage || sanitized.mileage <= 0) {
    sanitized.mileage = 50000; // Default reasonable mileage
  }
  if (!sanitized.completion_percentage) {
    sanitized.completion_percentage = 0;
  }

  // Ensure string values
  if (!sanitized.condition) {
    sanitized.condition = 'good';
  }
  if (!sanitized.zip_code) {
    sanitized.zip_code = '90210'; // Default zip code
  }

  return sanitized;
}

// Export legacy function for backward compatibility
export const calculateFinalValuation = runCorrectedValuationPipeline;
