
import { supabase } from '@/integrations/supabase/client';
import { ValuationInput, ValuationResult, AdjustmentBreakdown } from '@/types/valuation';
import { Photo, AICondition, PhotoScore } from '@/types/photo';
import { calculateValuation } from '@/utils/valuation/valuationEngine';
import { downloadPdf } from '@/utils/pdf';
import { decodeVin } from '@/services/vinService';
import { lookupPlate } from '@/services/plateService';
import { generateUniqueId } from '@/utils/helpers';
import { toast } from 'sonner';

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
      zip: input.zipCode,
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
        priceRange: valuationResult.priceRange,
        confidenceScore: valuationResult.confidenceScore,
        adjustments: valuationResult.adjustments,
        aiCondition: photoAnalysisResult,
        bestPhotoUrl,
        explanation: gptExplanation
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
      gptExplanation,
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
      priceRange: valuationResult.priceRange,
      adjustments: valuationResult.adjustments,
      photoScore: photoAnalysisResult?.confidenceScore,
      bestPhotoUrl,
      gptExplanation,
      isPremium: premiumStatus.hasPremiumAccess,
      pdfUrl,
      createdAt: new Date().toISOString()
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
        mileage: decodedData.mileage || input.mileage,
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
    // First try to get exact match with trim
    if (vehicleData.trim) {
      const { data: priceData, error } = await supabase
        .from('base_prices')
        .select('base_price')
        .eq('make', vehicleData.make)
        .eq('model', vehicleData.model)
        .eq('year', vehicleData.year)
        .eq('trim', vehicleData.trim)
        .maybeSingle();
      
      if (!error && priceData?.base_price) {
        log('Found exact base price with trim', { price: priceData.base_price });
        return priceData.base_price;
      }
    }
    
    // Then try without trim
    const { data: priceData, error } = await supabase
      .from('base_prices')
      .select('base_price')
      .eq('make', vehicleData.make)
      .eq('model', vehicleData.model)
      .eq('year', vehicleData.year)
      .maybeSingle();
    
    if (!error && priceData?.base_price) {
      log('Found base price', { price: priceData.base_price });
      return priceData.base_price;
    }
    
    // If no database entry, use a fallback calculation
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
        photos,
        valuationId
      }
    });
    
    if (error) {
      log('Error in photo processing', { error });
      throw new Error(`Photo analysis failed: ${error.message}`);
    }
    
    if (!data || !data.scores || !data.aiCondition) {
      log('Photo processing returned incomplete data');
      return { aiCondition: null, bestPhotoUrl: null };
    }
    
    // Find best photo (highest score)
    const photoScores = data.scores as PhotoScore[];
    let bestScore = 0;
    let bestPhotoUrl = null;
    
    photoScores.forEach(score => {
      if (score.score > bestScore) {
        bestScore = score.score;
        bestPhotoUrl = score.url;
      }
    });
    
    log('Photo processing complete', { 
      condition: data.aiCondition.condition,
      score: data.aiCondition.confidenceScore,
      bestPhotoUrl
    });
    
    return {
      aiCondition: data.aiCondition,
      bestPhotoUrl
    };
  } catch (error) {
    log('Error processing photos', { error: error instanceof Error ? error.message : 'Unknown error' });
    return { aiCondition: null, bestPhotoUrl: null };
  }
}

/**
 * Calculate final price with all adjustments
 */
async function calculateFinalPrice(params: {
  make: string;
  model: string;
  year: number;
  mileage?: number;
  condition?: string;
  basePrice: number;
  zip?: string;
  trim?: string;
  accidentCount?: number;
  premiumFeatures?: string[];
  mpg?: number | null;
  aiConditionData?: AICondition | null;
}, log: (message: string, data?: any) => void) {
  try {
    log('Calculating final price', { 
      basePrice: params.basePrice, 
      condition: params.condition,
      mileage: params.mileage
    });
    
    // Use the valuation engine to calculate the final price
    const result = await calculateValuation({
      make: params.make,
      model: params.model,
      year: params.year,
      mileage: params.mileage || 0,
      condition: params.condition || 'Good',
      zip: params.zip,
      trim: params.trim,
      accidentCount: params.accidentCount,
      premiumFeatures: params.premiumFeatures,
      mpg: params.mpg,
      aiConditionData: params.aiConditionData
    });
    
    log('Valuation calculation complete', { 
      estimatedValue: result.estimatedValue,
      confidenceScore: result.confidenceScore,
      adjustmentCount: result.adjustments.length
    });
    
    return result;
  } catch (error) {
    log('Error in calculateFinalPrice', { error: error instanceof Error ? error.message : 'Unknown error' });
    
    // Fallback calculation if the main engine fails
    const basePrice = params.basePrice;
    const depreciation = (params.mileage || 0) > 100000 ? 0.6 : 0.8;
    const estimatedValue = Math.round(basePrice * depreciation);
    
    return {
      estimatedValue,
      basePrice,
      adjustments: [],
      priceRange: [Math.round(estimatedValue * 0.9), Math.round(estimatedValue * 1.1)],
      confidenceScore: 60
    };
  }
}

/**
 * Generate explanation with GPT
 */
async function generateExplanation(
  vehicleData: { make: string; model: string; year: number; mileage?: number; condition?: string },
  valuationResult: { estimatedValue: number; adjustments: AdjustmentBreakdown[] },
  photoAnalysis: AICondition | null,
  log: (message: string, data?: any) => void
): Promise<string | null> {
  try {
    log('Generating explanation with GPT');
    
    const { data, error } = await supabase.functions.invoke('generate-explanation', {
      body: {
        vehicle: {
          make: vehicleData.make,
          model: vehicleData.model,
          year: vehicleData.year,
          mileage: vehicleData.mileage,
          condition: vehicleData.condition
        },
        valuation: {
          estimatedValue: valuationResult.estimatedValue,
          adjustments: valuationResult.adjustments
        },
        photoAnalysis: photoAnalysis || undefined
      }
    });
    
    if (error) {
      log('Error generating explanation', { error });
      return null;
    }
    
    log('Explanation generated successfully');
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
  if (!userId || !valuationId) {
    if (log) log('No user ID or valuation ID provided, premium access denied');
    return { hasPremiumAccess: false, reason: 'No user ID or valuation ID provided' };
  }
  
  try {
    if (log) log('Verifying premium access', { userId, valuationId });
    
    // Call the verify-payment function
    const { data, error } = await supabase.functions.invoke('verify-payment', {
      body: {
        userId,
        valuationId
      }
    });
    
    if (error) {
      if (log) log('Error verifying payment', { error });
      return { hasPremiumAccess: false, reason: `Payment verification error: ${error.message}` };
    }
    
    if (!data) {
      if (log) log('No data returned from payment verification');
      return { hasPremiumAccess: false, reason: 'Payment verification returned no data' };
    }
    
    if (log) log('Premium access verification complete', { hasPremiumAccess: data.hasPremiumAccess });
    return {
      hasPremiumAccess: data.hasPremiumAccess,
      reason: data.reason
    };
  } catch (error) {
    if (log) log('Error in verifyPremiumAccess', { error: error instanceof Error ? error.message : 'Unknown error' });
    return { hasPremiumAccess: false, reason: 'Payment verification failed' };
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
  aiCondition?: AICondition | null;
  bestPhotoUrl?: string | null;
  explanation?: string | null;
}, valuationId: string): Promise<string | null> {
  try {
    // Generate filename
    const fileName = `valuation-${reportData.make}-${reportData.model}-${valuationId}.pdf`;
    
    // Use the PDF generator to create the report
    await downloadPdf({
      reportData: {
        vin: reportData.vin,
        make: reportData.make,
        model: reportData.model,
        year: reportData.year,
        mileage: reportData.mileage,
        condition: reportData.condition,
        zipCode: reportData.zipCode,
        estimatedValue: reportData.estimatedValue,
        priceRange: reportData.priceRange,
        confidenceScore: reportData.confidenceScore,
        adjustments: reportData.adjustments,
        aiCondition: reportData.aiCondition || undefined,
        aiSummary: reportData.aiCondition?.aiSummary,
        bestPhotoUrl: reportData.bestPhotoUrl || undefined,
        explanation: reportData.explanation || undefined
      },
      fileName,
      options: {
        includeBranding: true,
        includeAIScore: Boolean(reportData.aiCondition),
        includeFooter: true,
        includeTimestamp: true,
        includePhotoAssessment: Boolean(reportData.bestPhotoUrl && reportData.aiCondition)
      }
    });
    
    // In a real implementation, we would upload the PDF to Supabase storage
    // and return the URL, but for now we'll just return a placeholder
    return `https://storage.googleapis.com/car-detective-valuations/${fileName}`;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return null;
  }
}

/**
 * Trigger dealer notifications
 */
async function triggerDealerNotifications(
  vehicleData: { make: string; model: string; year: number; vin?: string },
  valuationResult: { estimatedValue: number },
  userId?: string,
  valuationId?: string
): Promise<boolean> {
  if (!userId || !valuationId) {
    return false;
  }
  
  try {
    // Insert dealer lead record
    const { error } = await supabase
      .from('dealer_leads')
      .insert({
        user_id: userId,
        valuation_id: valuationId,
        status: 'open'
      });
    
    if (error) {
      console.error('Error creating dealer lead:', error);
      return false;
    }
    
    // In a real implementation, we would also send notifications
    // to dealers via email, SMS, or push notifications
    
    return true;
  } catch (error) {
    console.error('Error triggering dealer notifications:', error);
    return false;
  }
}

/**
 * Save valuation result to database
 */
async function saveValuationResult(result: {
  userId?: string;
  valuationId: string;
  make: string;
  model: string;
  year: number;
  mileage?: number;
  condition?: string;
  vin?: string;
  estimatedValue: number;
  confidenceScore: number;
  photoScore?: number;
  bestPhotoUrl?: string | null;
  gptExplanation?: string | null;
  isPremium: boolean;
  pdfUrl?: string | null;
}, log: (message: string, data?: any) => void): Promise<string> {
  try {
    log('Saving valuation result', { valuationId: result.valuationId });
    
    const valuationData = {
      id: result.valuationId,
      user_id: result.userId,
      make: result.make,
      model: result.model,
      year: result.year,
      mileage: result.mileage || 0,
      condition_score: result.photoScore || null,
      vin: result.vin || null,
      estimated_value: result.estimatedValue,
      confidence_score: result.confidenceScore,
      premium_unlocked: result.isPremium
    };
    
    // Insert or update valuation record
    const { error } = await supabase
      .from('valuations')
      .upsert(valuationData, { onConflict: 'id' });
    
    if (error) {
      log('Error saving valuation', { error });
      throw new Error(`Database error: ${error.message}`);
    }
    
    // If we have a photo, save it as well
    if (result.bestPhotoUrl) {
      await supabase
        .from('valuation_photos')
        .upsert({
          valuation_id: result.valuationId,
          photo_url: result.bestPhotoUrl,
          score: result.photoScore || 0,
          uploaded_at: new Date().toISOString()
        }, { onConflict: 'valuation_id, photo_url' });
    }
    
    // If there's a GPT explanation, save it to the chat system
    if (result.gptExplanation) {
      // Create a chat session if it doesn't exist
      const { data: sessionData } = await supabase
        .from('chat_sessions')
        .select('id')
        .eq('valuation_id', result.valuationId)
        .maybeSingle();
      
      const sessionId = sessionData?.id || undefined;
      
      if (!sessionId) {
        // Create a new chat session
        const { data: newSessionData, error: sessionError } = await supabase
          .from('chat_sessions')
          .insert({
            valuation_id: result.valuationId,
            user_id: result.userId
          })
          .select('id')
          .single();
        
        if (!sessionError && newSessionData) {
          // Add the explanation as a message
          await supabase
            .from('chat_messages')
            .insert({
              session_id: newSessionData.id,
              role: 'assistant',
              content: result.gptExplanation
            });
        }
      } else {
        // Add the explanation to the existing session
        await supabase
          .from('chat_messages')
          .insert({
            session_id: sessionId,
            role: 'assistant',
            content: result.gptExplanation
          });
      }
    }
    
    log('Valuation saved successfully', { valuationId: result.valuationId });
    return result.valuationId;
  } catch (error) {
    log('Error in saveValuationResult', { error: error instanceof Error ? error.message : 'Unknown error' });
    // Even if saving fails, return the ID so the client can still display the result
    return result.valuationId;
  }
}
