
import { supabase } from '@/integrations/supabase/client';
import { ValuationInput, ValuationResult, AdjustmentBreakdown } from '@/types/valuation';
import { Photo, AICondition, PhotoScore } from '@/types/photo';
import { calculateValuation } from '@/utils/valuation/valuationEngine';
import { downloadPdf } from '@/utils/pdf';
import { decodeVin } from '@/services/vinService';
import { lookupPlate } from '@/services/plateService';
import { generateUniqueId } from '@/utils/helpers';

/**
 * Core function to build a complete vehicle valuation report
 * Orchestrates the entire valuation pipeline from input to final result
 */
export async function buildValuationReport(input: ValuationInput): Promise<ValuationResult> {
  try {
    // Initialize logger for tracking the build process
    const processId = generateUniqueId();
    const log = createProcessLogger(processId);
    log('Starting valuation process', { input: { ...input, photos: input.photos?.length || 0 } });

    // Step 1: Normalize input and decode vehicle information
    const vehicleData = await normalizeAndDecodeInput(input, log);
    if (!vehicleData) {
      throw new Error('Failed to decode vehicle information');
    }

    // Step 2: Calculate base price
    const basePrice = await fetchBasePrice(vehicleData, log);
    
    // Step 3: Process photos and run condition scoring if photos provided
    let photoAnalysisResult = null;
    let bestPhotoUrl = null;
    
    if (input.photos && input.photos.length > 0) {
      log('Processing photos', { count: input.photos.length });
      const photoResults = await processPhotos(input.photos, input.valuationId || processId, log);
      photoAnalysisResult = photoResults.aiCondition;
      bestPhotoUrl = photoResults.bestPhotoUrl;
    }
    
    // Step 4: Calculate final price with all adjustments
    const valuationResult = await calculateFinalPrice({
      ...vehicleData,
      basePrice,
      aiConditionData: photoAnalysisResult,
      zipCode: input.zipCode,
      accidentCount: input.accidentCount || 0,
      premiumFeatures: input.features,
      mpg: input.mpg
    }, log);
    
    // Step 5: Generate explanation with GPT if premium or test mode
    let gptExplanation = null;
    if (input.isPremium || input.isTestMode) {
      log('Generating GPT explanation');
      gptExplanation = await generateExplanation(vehicleData, valuationResult, photoAnalysisResult, log);
    }
    
    // Step 6: Check premium status via Stripe
    const premiumStatus = await verifyPremiumAccess(input.userId, input.valuationId, log);
    
    // Step 7: Generate PDF if premium
    let pdfUrl = null;
    if (premiumStatus.hasPremiumAccess) {
      log('Generating PDF report');
      pdfUrl = await generatePdfReport({
        vin: vehicleData.vin || '',
        make: vehicleData.make,
        model: vehicleData.model,
        year: vehicleData.year,
        mileage: vehicleData.mileage || 0,
        condition: vehicleData.condition || 'Good',
        zipCode: input.zipCode || '',
        estimatedValue: valuationResult.estimatedValue,
        priceRange: valuationResult.priceRange as [number, number],
        confidenceScore: valuationResult.confidenceScore,
        adjustments: valuationResult.adjustments.map(adj => ({
          name: adj.factor,
          value: adj.impact,
          description: adj.description || '',
          percentAdjustment: Math.round((adj.impact / valuationResult.estimatedValue) * 100 * 100) / 100
        })),
        aiCondition: photoAnalysisResult,
        bestPhotoUrl,
        explanation: gptExplanation,
        features: input.features || []
      }, input.valuationId || processId);
    }
    
    // Step 8: Trigger dealer leads if user opted in
    if (input.notifyDealers) {
      log('Notifying dealers');
      await triggerDealerNotifications(vehicleData, valuationResult, input.userId, input.valuationId || processId);
    }
    
    // Step 9: Save the complete valuation result to database
    const savedValuationId = await saveValuationResult({
      ...vehicleData,
      ...valuationResult,
      userId: input.userId,
      valuationId: input.valuationId || processId,
      photoScore: photoAnalysisResult?.confidenceScore,
      bestPhotoUrl,
      explanation: gptExplanation,
      isPremium: premiumStatus.hasPremiumAccess,
      pdfUrl
    }, log);
    
    // Return the final result
    log('Valuation process completed', { valuationId: savedValuationId });
    
    return {
      id: savedValuationId,
      vin: vehicleData.vin,
      make: vehicleData.make,
      model: vehicleData.model,
      year: vehicleData.year,
      mileage: vehicleData.mileage || 0,
      condition: vehicleData.condition || 'Good',
      zipCode: input.zipCode || '',
      estimatedValue: valuationResult.estimatedValue,
      confidenceScore: valuationResult.confidenceScore,
      adjustments: valuationResult.adjustments,
      explanation: gptExplanation,
      photoScore: photoAnalysisResult?.confidenceScore,
      bestPhotoUrl,
      aiCondition: photoAnalysisResult,
      priceRange: valuationResult.priceRange as [number, number],
      isPremium: premiumStatus.hasPremiumAccess,
      pdfUrl,
      fuelType: vehicleData.fuelType,
      transmission: vehicleData.transmission
    };
  } catch (error) {
    console.error('Error in buildValuationReport:', error);
    throw new Error(`Valuation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Create a logger for tracking the valuation process
 */
function createProcessLogger(processId: string) {
  return (message: string, data?: any) => {
    console.log(`[${processId}] ${message}`, data || '');
  };
}

/**
 * Normalize and decode input data based on type (VIN, Plate, Manual)
 */
async function normalizeAndDecodeInput(input: ValuationInput, log: (message: string, data?: any) => void): Promise<{
  vin?: string;
  make: string; 
  model: string; 
  year: number;
  condition?: string;
  mileage?: number;
  trim?: string;
  bodyType?: string;
  transmission?: string;
  fuelType?: string;
}> {
  log('Normalizing input', { type: input.identifierType });
  
  try {
    // VIN lookup
    if (input.identifierType === 'vin' && input.vin) {
      const decodedData = await decodeVin(input.vin);
      log('VIN decoded', { make: decodedData.make, model: decodedData.model, year: decodedData.year });
      
      return {
        vin: input.vin,
        make: decodedData.make,
        model: decodedData.model,
        year: decodedData.year,
        trim: decodedData.trim,
        bodyType: decodedData.bodyType,
        transmission: decodedData.transmission,
        mileage: input.mileage,
        condition: input.condition,
        fuelType: decodedData.fuelType
      };
    }
    
    // Plate lookup
    if (input.identifierType === 'plate' && input.plate && input.state) {
      const decodedData = await lookupPlate(input.plate, input.state);
      log('Plate decoded', { make: decodedData.make, model: decodedData.model, year: decodedData.year });
      
      return {
        vin: decodedData.vin,
        make: decodedData.make,
        model: decodedData.model,
        year: decodedData.year,
        mileage: input.mileage, // Use input mileage instead of plate data
        condition: input.condition
      };
    }
    
    // Manual input
    if (input.identifierType === 'manual' || input.identifierType === 'photo') {
      log('Processing manual input', { make: input.make, model: input.model, year: input.year });
      
      if (!input.make || !input.model || !input.year) {
        throw new Error('Manual input requires make, model, and year');
      }
      
      return {
        make: input.make,
        model: input.model,
        year: input.year,
        mileage: input.mileage,
        condition: input.condition,
        trim: input.trim,
        bodyType: input.bodyType,
        transmission: input.transmission,
        fuelType: input.fuelType
      };
    }
    
    throw new Error('Invalid identification type or missing required data');
  } catch (error) {
    log('Error in normalizeAndDecodeInput', { error: error instanceof Error ? error.message : 'Unknown error' });
    throw error;
  }
}

/**
 * Fetch base price from database or external source
 */
async function fetchBasePrice(vehicleData: { make: string; model: string; year: number; trim?: string }, log: (message: string, data?: any) => void): Promise<number> {
  log('Fetching base price', { make: vehicleData.make, model: vehicleData.model, year: vehicleData.year });
  
  try {
    // Use a fallback calculation since we don't have the actual base_prices table
    log('No base price found, using fallback calculation');
    const currentYear = new Date().getFullYear();
    const age = currentYear - vehicleData.year;
    
    // Simple fallback algorithm (would be more sophisticated in production)
    let basePrice = 30000; // Average new car price
    
    // Depreciation factor (roughly 15% per year for first 5 years, then 7%)
    for (let i = 0; i < Math.min(age, 5); i++) {
      basePrice *= 0.85;
    }
    for (let i = 5; i < age; i++) {
      basePrice *= 0.93;
    }
    
    // Make adjustments based on brand prestige
    const luxuryBrands = ['BMW', 'Mercedes-Benz', 'Audi', 'Lexus', 'Porsche', 'Tesla', 'Cadillac'];
    if (luxuryBrands.includes(vehicleData.make)) {
      basePrice *= 1.4;
    }
    
    // Economy brands adjustment
    const economyBrands = ['Kia', 'Hyundai', 'Mitsubishi', 'Suzuki', 'Nissan'];
    if (economyBrands.includes(vehicleData.make)) {
      basePrice *= 0.8;
    }
    
    return Math.round(basePrice);
  } catch (error) {
    log('Error in fetchBasePrice', { error: error instanceof Error ? error.message : 'Unknown error' });
    return 20000; // Absolute fallback value
  }
}

/**
 * Process and analyze vehicle photos
 */
async function processPhotos(photos: File[], valuationId: string, log: (message: string, data?: any) => void): Promise<{
  aiCondition: AICondition | null;
  bestPhotoUrl: string | null;
}> {
  try {
    log('Processing photos', { count: photos.length });
    
    // Call the score-image function to upload and analyze photos
    const { data, error } = await supabase.functions.invoke('score-image', {
      body: {
        valuationId,
        photos: photos.length
      }
    });
    
    if (error) {
      log('Error processing photos', { error });
      return {
        aiCondition: null,
        bestPhotoUrl: null
      };
    }
    
    // Find best photo (highest score)
    let bestScore = 0;
    let bestPhotoUrl = null;
    
    if (data.scores && Array.isArray(data.scores)) {
      data.scores.forEach((score: PhotoScore) => {
        if (score.score > bestScore) {
          bestScore = score.score;
          bestPhotoUrl = score.url;
        }
      });
    }
    
    log('Photo processing completed', { 
      bestScore, 
      bestPhotoUrl: bestPhotoUrl ? '...exists' : null,
      aiCondition: data.aiCondition ? data.aiCondition.condition : null
    });
    
    return {
      aiCondition: data.aiCondition || null,
      bestPhotoUrl
    };
  } catch (error) {
    log('Error in processPhotos', { error: error instanceof Error ? error.message : 'Unknown error' });
    return {
      aiCondition: null,
      bestPhotoUrl: null
    };
  }
}

/**
 * Calculate final price with all adjustments
 */
async function calculateFinalPrice(params: {
  make: string;
  model: string;
  year: number;
  basePrice: number;
  mileage?: number;
  condition?: string;
  zipCode?: string;
  aiConditionData?: AICondition | null;
  accidentCount?: number;
  premiumFeatures?: string[];
  mpg?: number | null;
}, log: (message: string, data?: any) => void): Promise<{
  estimatedValue: number;
  confidenceScore: number;
  priceRange: [number, number];
  adjustments: { factor: string; impact: number; description?: string; }[];
}> {
  log('Calculating final price', { 
    basePrice: params.basePrice,
    mileage: params.mileage,
    condition: params.condition
  });
  
  try {
    // Call the valuation engine
    const result = await calculateValuation({
      make: params.make,
      model: params.model,
      year: params.year,
      mileage: params.mileage || 0,
      condition: params.condition || 'good',
      zip: params.zipCode,
      accidentCount: params.accidentCount,
      premiumFeatures: params.premiumFeatures,
      mpg: params.mpg,
      aiCondition: params.aiConditionData?.condition
    }, (message) => log(`Valuation Engine: ${message}`));
    
    // Format the adjustments to match the expected output
    const adjustments = result.adjustments.map(adj => ({
      factor: adj.name,
      impact: adj.value,
      description: adj.description
    }));
    
    log('Final price calculated', { 
      estimatedValue: result.estimatedValue,
      confidenceScore: result.confidenceScore,
      adjustmentsCount: adjustments.length
    });
    
    return {
      estimatedValue: result.estimatedValue,
      confidenceScore: result.confidenceScore,
      priceRange: result.priceRange as [number, number],
      adjustments
    };
  } catch (error) {
    log('Error in calculateFinalPrice', { error: error instanceof Error ? error.message : 'Unknown error' });
    
    // Fallback calculation in case the engine fails
    const basePrice = params.basePrice;
    const mileageAdjustment = params.mileage ? -Math.round(params.mileage / 10000) * 500 : 0;
    const conditionAdjustment = params.condition === 'Excellent' ? 1000 : 
                               params.condition === 'Good' ? 0 : 
                               params.condition === 'Fair' ? -1000 : -2000;
    
    const estimatedValue = basePrice + mileageAdjustment + conditionAdjustment;
    const priceRange: [number, number] = [
      Math.round(estimatedValue * 0.95),
      Math.round(estimatedValue * 1.05)
    ];
    
    return {
      estimatedValue,
      confidenceScore: 60, // Lower confidence for fallback calculation
      priceRange,
      adjustments: [
        { factor: 'Mileage', impact: mileageAdjustment },
        { factor: 'Condition', impact: conditionAdjustment }
      ]
    };
  }
}

/**
 * Generate explanation using GPT
 */
async function generateExplanation(
  vehicleData: { make: string; model: string; year: number; trim?: string; condition?: string; mileage?: number; },
  valuationResult: { estimatedValue: number; adjustments: { factor: string; impact: number; description?: string; }[]; },
  aiCondition: AICondition | null,
  log: (message: string, data?: any) => void
): Promise<string | null> {
  log('Generating explanation', { 
    vehicle: `${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`,
    estimatedValue: valuationResult.estimatedValue
  });
  
  try {
    const { data, error } = await supabase.functions.invoke('generate-explanation', {
      body: {
        vehicle: vehicleData,
        valuation: valuationResult.estimatedValue,
        adjustments: valuationResult.adjustments,
        aiCondition
      }
    });
    
    if (error) {
      log('Error generating explanation', { error });
      return null;
    }
    
    log('Explanation generated', { length: data.explanation?.length || 0 });
    return data.explanation || null;
  } catch (error) {
    log('Error in generateExplanation', { error: error instanceof Error ? error.message : 'Unknown error' });
    return null;
  }
}

/**
 * Verify premium access via Stripe
 */
async function verifyPremiumAccess(userId?: string, valuationId?: string, log?: (message: string, data?: any) => void): Promise<{
  hasPremiumAccess: boolean;
  reason?: string;
}> {
  if (log) log('Verifying premium access', { userId, valuationId });
  
  if (!userId) {
    if (log) log('No user ID provided, assuming no premium access');
    return { hasPremiumAccess: false, reason: 'No user ID provided' };
  }
  
  try {
    const { data, error } = await supabase.functions.invoke('verify-payment', {
      body: { userId, valuationId }
    });
    
    if (error) {
      if (log) log('Error verifying premium access', { error });
      return { hasPremiumAccess: false, reason: error.message };
    }
    
    if (log) log('Premium access verified', { hasPremiumAccess: data.hasPremiumAccess });
    return { hasPremiumAccess: data.hasPremiumAccess || false, reason: data.reason };
  } catch (error) {
    if (log) log('Error in verifyPremiumAccess', { error: error instanceof Error ? error.message : 'Unknown error' });
    return { hasPremiumAccess: false, reason: 'Error verifying premium access' };
  }
}

/**
 * Generate PDF report
 */
async function generatePdfReport(reportData: {
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  estimatedValue: number;
  priceRange: [number, number];
  confidenceScore: number;
  adjustments: AdjustmentBreakdown[];
  aiCondition?: AICondition;
  bestPhotoUrl?: string | null;
  explanation?: string | null;
  features?: string[];
}, valuationId: string): Promise<string | null> {
  try {
    // Generate PDF
    await downloadPdf({
      ...reportData,
      valuationId
    });
    
    // In a real implementation, we would upload the PDF to storage
    // and return the URL, but for now we just return a dummy URL
    return `https://storage.example.com/pdf/valuation-${reportData.make}-${reportData.model}-${valuationId}.pdf`;
  } catch (error) {
    console.error('Error generating PDF report:', error);
    return null;
  }
}

/**
 * Trigger dealer notifications
 */
async function triggerDealerNotifications(
  vehicleData: { make: string; model: string; year: number; },
  valuationResult: { estimatedValue: number; },
  userId?: string,
  valuationId?: string
): Promise<void> {
  try {
    if (!userId || !valuationId) {
      console.log('Skipping dealer notification, missing userId or valuationId');
      return;
    }
    
    // Call dealer notification service or function
    await supabase.functions.invoke('notify-dealers', {
      body: {
        userId,
        valuationId,
        vehicle: {
          make: vehicleData.make,
          model: vehicleData.model,
          year: vehicleData.year,
          estimatedValue: valuationResult.estimatedValue
        }
      }
    });
    
    console.log('Dealer notification triggered', { valuationId });
  } catch (error) {
    console.error('Error triggering dealer notifications:', error);
  }
}

/**
 * Save valuation result to database
 */
async function saveValuationResult(result: {
  make: string;
  model: string;
  year: number;
  mileage?: number;
  condition?: string;
  estimatedValue: number;
  adjustments: { factor: string; impact: number; description?: string; }[];
  userId?: string;
  valuationId: string;
  photoScore?: number;
  bestPhotoUrl?: string | null;
  explanation?: string | null;
  isPremium?: boolean;
  pdfUrl?: string | null;
}, log: (message: string, data?: any) => void): Promise<string> {
  log('Saving valuation result', { valuationId: result.valuationId });
  
  try {
    // We'll just log the saving operation without actually performing it
    // since we don't have a properly typed "valuations" table
    log('(Mock) Valuation result saved', { valuationId: result.valuationId });
    
    return result.valuationId;
  } catch (error) {
    log('Error in saveValuationResult', { error: error instanceof Error ? error.message : 'Unknown error' });
    return result.valuationId; // Return the ID anyway for fault tolerance
  }
}
