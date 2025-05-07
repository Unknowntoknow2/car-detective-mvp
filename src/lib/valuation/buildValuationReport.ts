import { calculateFinalValuation } from '@/utils/valuation/calculateFinalValuation';
import { ValuationParams } from '@/utils/valuation/types';
import { decodeVin } from '@/services/vinService';
import { lookupPlate } from '@/services/plateService';
import { supabase } from '@/integrations/supabase/client';
import { downloadPdf } from '@/utils/pdf';
import { ValuationResult, AdjustmentBreakdown } from '@/types/valuation';
import { AICondition } from '@/types/photo';
import { ReportData } from '@/utils/pdf/types';
import { uploadAndAnalyzePhotos } from '@/services/photoService';

interface BuildValuationReportInput {
  identifierType: 'vin' | 'plate' | 'manual' | 'photo';
  vin?: string;
  plate?: string;
  state?: string;
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  zipCode?: string;
  bodyType?: string;
  trim?: string;
  transmission?: string;
  fuelType?: string;
  accidentCount?: number;
  photos?: File[];
  features?: string[];
  mpg?: number | null;
  userId?: string;
  valuationId?: string;
  isPremium?: boolean;
  isTestMode?: boolean;
  notifyDealers?: boolean;
}

/**
 * Orchestrates the valuation process based on the input identifier type.
 * @param input - The valuation input containing vehicle details and options.
 */
export async function buildValuationReport(input: BuildValuationReportInput): Promise<ValuationResult> {
  try {
    let vehicleDetails: any = {};
    let valuationParams: ValuationParams;
    let isPremiumUser = false;
    let photoScore: number | undefined;
    let bestPhotoUrl: string | null = null;
    let aiCondition: AICondition | undefined;
    let explanation: string | undefined;
    let pdfUrl: string | undefined;

    // 1. Identify Vehicle
    console.log(`Starting vehicle identification using ${input.identifierType}`);
    switch (input.identifierType) {
      case 'vin':
        if (!input.vin) throw new Error('VIN is required');
        vehicleDetails = await decodeVin(input.vin);
        if (!vehicleDetails) throw new Error('Failed to decode vehicle information');
        valuationParams = {
          make: vehicleDetails.make,
          model: vehicleDetails.model,
          year: vehicleDetails.year,
          mileage: input.mileage || 0,
          condition: input.condition || 'Good',
          zip: input.zipCode,
          trim: vehicleDetails.trim,
          transmission: vehicleDetails.transmission,
          fuelType: vehicleDetails.fuelType
        };
        console.log(`VIN decoded successfully: ${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model}`);
        break;

      case 'plate':
        if (!input.plate || !input.state) throw new Error('Plate and state are required');
        const plateLookup = await lookupPlate(input.plate, input.state);
        if (!plateLookup) throw new Error('Failed to lookup vehicle by plate');
        vehicleDetails = plateLookup;
        valuationParams = {
          make: plateLookup.make,
          model: plateLookup.model,
          year: plateLookup.year,
          mileage: input.mileage || plateLookup.mileage || 0,
          condition: input.condition || 'Good',
          zip: input.zipCode,
          transmission: plateLookup.transmission,
          fuelType: plateLookup.fuelType
        };
        console.log(`Plate lookup successful: ${plateLookup.year} ${plateLookup.make} ${plateLookup.model}`);
        break;

      case 'manual':
        if (!input.make || !input.model || !input.year) throw new Error('Make, model, and year are required for manual entry');
        vehicleDetails = {
          make: input.make,
          model: input.model,
          year: input.year
        };
        valuationParams = {
          make: input.make,
          model: input.model,
          year: input.year,
          mileage: input.mileage || 0,
          condition: input.condition || 'Good',
          zip: input.zipCode,
          trim: input.trim,
          transmission: input.transmission,
          fuelType: input.fuelType
        };
        console.log(`Manual entry processed: ${input.year} ${input.make} ${input.model}`);
        break;

      case 'photo':
        if (!input.photos || input.photos.length === 0) throw new Error('Photos are required for photo-based valuation');
        
        // Process and analyze photos first
        const photoAnalysisResult = await uploadAndAnalyzePhotos(input.photos, input.valuationId || 'temp-id');
        
        if (photoAnalysisResult.error) {
          throw new Error(`Photo analysis failed: ${photoAnalysisResult.error}`);
        }
        
        // Use the AI detected vehicle info or fall back to user-provided data
        const photoVehicleInfo = photoAnalysisResult.vehicleInfo || {
          make: input.make,
          model: input.model,
          year: input.year
        };
        
        if (!photoVehicleInfo.make || !photoVehicleInfo.model || !photoVehicleInfo.year) {
          throw new Error('Could not identify vehicle from photos. Please provide make, model, and year.');
        }
        
        vehicleDetails = photoVehicleInfo;
        valuationParams = {
          make: photoVehicleInfo.make,
          model: photoVehicleInfo.model,
          year: photoVehicleInfo.year,
          mileage: input.mileage || 0,
          condition: input.condition || 'Good',
          zip: input.zipCode,
          trim: input.trim,
          transmission: input.transmission,
          fuelType: input.fuelType
        };
        
        // Set photo data for later usage
        photoScore = photoAnalysisResult.overallScore;
        bestPhotoUrl = photoAnalysisResult.individualScores.find(score => score.isPrimary)?.url || 
                       (photoAnalysisResult.individualScores.length > 0 ? photoAnalysisResult.individualScores[0].url : null);
        aiCondition = photoAnalysisResult.aiCondition;
        
        console.log(`Photo analysis complete: ${photoVehicleInfo.year} ${photoVehicleInfo.make} ${photoVehicleInfo.model}`);
        break;

      default:
        throw new Error('Invalid identifier type');
    }

    // 2. Premium Access Check
    console.log('Checking premium access status');
    try {
      if (input.userId && input.valuationId) {
        const { data: premiumData, error: premiumError } = await supabase.functions.invoke('verify-payment', {
          body: { userId: input.userId, valuationId: input.valuationId }
        });

        if (premiumError) {
          console.error('Error verifying premium status:', premiumError);
        } else if (premiumData && premiumData.hasPremiumAccess) {
          isPremiumUser = true;
          console.log('Premium access verified');
        } else {
          console.warn('User does not have premium access:', premiumData?.reason);
        }
      } else if (input.isTestMode) {
        // Allow premium features in test mode
        isPremiumUser = true;
        console.log('Test mode enabled - granting premium access');
      }
    } catch (premiumCheckError: any) {
      console.error('Error during premium access check:', premiumCheckError);
    }

    // 3. Photo Analysis (if not already done in photo identification)
    if (input.identifierType !== 'photo' && input.photos && input.photos.length > 0) {
      console.log('Processing additional photos');
      try {
        const photoAnalysisResult = await uploadAndAnalyzePhotos(input.photos, input.valuationId || 'temp-id');

        if (!photoAnalysisResult.error) {
          photoScore = photoAnalysisResult.overallScore;
          bestPhotoUrl = photoAnalysisResult.individualScores.find(score => score.isPrimary)?.url || 
                        (photoAnalysisResult.individualScores.length > 0 ? photoAnalysisResult.individualScores[0].url : null);
          aiCondition = photoAnalysisResult.aiCondition;
          console.log('Photo analysis complete', { photoScore, bestPhotoUrl: bestPhotoUrl ? 'available' : 'not available' });
        } else {
          console.error('Photo analysis failed:', photoAnalysisResult.error);
        }
      } catch (photoAnalysisError: any) {
        console.error('Error during photo analysis:', photoAnalysisError);
      }
    }

    // 4. Calculate Base Price and Valuation
    console.log('Calculating vehicle valuation');
    // Add photo score to valuation params if available
    if (photoScore !== undefined) {
      valuationParams.photoScore = photoScore;
    }
    
    // Add accident count to valuation params if available
    if (input.accidentCount !== undefined) {
      valuationParams.accidentCount = input.accidentCount;
    }
    
    // Add features to valuation params if available
    if (input.features && input.features.length > 0) {
      valuationParams.premiumFeatures = input.features;
    }
    
    // Add MPG data if available
    if (input.mpg !== undefined) {
      valuationParams.mpg = input.mpg;
    }
    
    // Include AI condition data if available
    if (aiCondition) {
      valuationParams.aiConditionData = {
        condition: aiCondition.condition as any,
        confidenceScore: aiCondition.confidenceScore,
        issuesDetected: aiCondition.issuesDetected,
        aiSummary: aiCondition.aiSummary
      };
    }
    
    // Calculate the final valuation using all available data
    const finalValuation = await calculateFinalValuation({
      make: valuationParams.make,
      model: valuationParams.model,
      year: valuationParams.year,
      mileage: valuationParams.mileage,
      condition: valuationParams.condition,
      zipCode: valuationParams.zip || '90210',
      trim: valuationParams.trim,
      fuelType: valuationParams.fuelType,
      transmission: valuationParams.transmission,
      features: input.features,
      accidentCount: input.accidentCount,
      photoScore: photoScore
    }, 
    // Base price (would normally come from a database or pricing service)
    getBasePrice(valuationParams.make, valuationParams.model, valuationParams.year), 
    aiCondition);

    // 5. Generate Explanation (if premium or test mode)
    if ((isPremiumUser || input.isTestMode) && input.valuationId) {
      console.log('Generating explanation using AI');
      try {
        const { data: explanationData, error: explanationError } = await supabase.functions.invoke('generate-explanation', {
          body: {
            valuationId: input.valuationId,
            valuationResult: {
              estimatedValue: finalValuation.estimatedValue,
              basePrice: finalValuation.basePrice,
              adjustments: finalValuation.adjustments,
              priceRange: finalValuation.priceRange,
              confidenceScore: finalValuation.confidenceScore
            },
            vehicleDetails: {
              ...vehicleDetails,
              mileage: valuationParams.mileage,
              condition: valuationParams.condition,
              photoScore,
              aiCondition
            }
          }
        });

        if (explanationError) {
          console.error('Explanation generation failed:', explanationError);
        } else if (explanationData && explanationData.explanation) {
          explanation = explanationData.explanation;
          console.log('Explanation generated successfully');
        }
      } catch (explanationError: any) {
        console.error('Error generating explanation:', explanationError);
      }
    }

    // 6. Generate PDF (if premium or test mode)
    if ((isPremiumUser || input.isTestMode) && input.valuationId) {
      console.log('Generating PDF report');
      try {
        const reportData: ReportData = {
          id: input.valuationId,
          make: vehicleDetails.make,
          model: vehicleDetails.model,
          year: vehicleDetails.year,
          mileage: valuationParams.mileage,
          condition: valuationParams.condition,
          estimatedValue: finalValuation.estimatedValue,
          priceRange: finalValuation.priceRange,
          adjustments: finalValuation.adjustments,
          photoUrl: bestPhotoUrl || undefined,
          explanation: explanation,
          generatedAt: new Date().toISOString()
        };
        
        const { data: pdfData, error: pdfError } = await supabase.functions.invoke('generate-pdf', {
          body: {
            reportData,
            valuationId: input.valuationId
          }
        });
        
        if (pdfError) {
          console.error('PDF generation failed:', pdfError);
        } else if (pdfData && pdfData.pdfUrl) {
          pdfUrl = pdfData.pdfUrl;
          console.log('PDF generated successfully:', pdfUrl);
        }
      } catch (pdfError: any) {
        console.error('Error generating PDF:', pdfError);
      }
    }

    // 7. Notify Dealers (if opted in)
    if (input.notifyDealers && input.valuationId) {
      console.log('Notifying dealers of this valuation');
      try {
        const { error: notifyError } = await supabase.functions.invoke('notify-dealers', {
          body: {
            valuationId: input.valuationId,
            vehicleDetails: {
              make: vehicleDetails.make,
              model: vehicleDetails.model,
              year: vehicleDetails.year,
              estimatedValue: finalValuation.estimatedValue,
              zipCode: valuationParams.zip
            }
          }
        });
        
        if (notifyError) {
          console.error('Dealer notification failed:', notifyError);
        } else {
          console.log('Dealers notified successfully');
        }
      } catch (notifyError: any) {
        console.error('Error notifying dealers:', notifyError);
      }
    }

    // 8. Save Valuation to Database
    if (input.valuationId && input.userId) {
      console.log('Saving valuation to database');
      try {
        const { error: saveError } = await supabase
          .from('valuations')
          .upsert({
            id: input.valuationId,
            user_id: input.userId,
            make: vehicleDetails.make,
            model: vehicleDetails.model,
            year: vehicleDetails.year,
            mileage: valuationParams.mileage,
            condition_score: convertConditionToScore(valuationParams.condition),
            estimated_value: finalValuation.estimatedValue,
            base_price: finalValuation.basePrice,
            confidence_score: finalValuation.confidenceScore,
            vin: input.identifierType === 'vin' ? input.vin : null,
            plate: input.identifierType === 'plate' ? input.plate : null,
            state: input.zipCode,
            body_type: input.bodyType,
            accident_count: input.accidentCount || 0,
            premium_unlocked: isPremiumUser,
            photo_url: bestPhotoUrl
          });

        if (saveError) {
          console.error('Error saving valuation to database:', saveError);
        } else {
          console.log('Valuation saved to database successfully');
        }
      } catch (saveError: any) {
        console.error('Error during database save:', saveError);
      }
    }

    // 9. Construct Result
    const adjustments = finalValuation.adjustments.map(adj => ({
      factor: adj.name,
      impact: adj.value,
      description: adj.description
    }));

    // Convert condition string to AICondition enum type if needed
    const safeAiCondition = aiCondition ? {
      condition: ensureValidCondition(aiCondition.condition),
      confidenceScore: aiCondition.confidenceScore,
      issuesDetected: aiCondition.issuesDetected || []
    } : undefined;

    console.log('Valuation report completed successfully');
    
    // Return the final valuation result
    const result: ValuationResult = {
      id: input.valuationId || 'VALUATION-ID',
      make: vehicleDetails.make,
      model: vehicleDetails.model,
      year: vehicleDetails.year,
      mileage: valuationParams.mileage,
      condition: valuationParams.condition,
      zipCode: valuationParams.zip || '90210',
      estimatedValue: finalValuation.estimatedValue,
      confidenceScore: finalValuation.confidenceScore,
      adjustments,
      priceRange: finalValuation.priceRange,
      isPremium: isPremiumUser,
      photoScore,
      bestPhotoUrl,
      aiCondition: safeAiCondition,
      explanation,
      pdfUrl,
      vin: input.vin,
      features: input.features
    };

    return result;
  } catch (error: any) {
    console.error('Error in buildValuationReport:', error);
    throw error;
  }
}

// Fix the PhotoScoringResult interface to include vehicleInfo
interface PhotoScoringResult {
  score: number;
  photoUrl: string;
  condition: string;
  confidenceScore: number;
  vehicleInfo?: {
    make: string;
    model: string;
    year: number;
  };
}

// Update ValuationParams to include photoScore
interface EnhancedValuationParams {
  // ... existing fields from ValuationParams
  photoScore?: number;
}

// In the ReportData interface, ensure id is a valid property
interface ReportData {
  id?: string;
  // ... other properties
}

// Helper function to ensure condition is one of the valid enum values
function ensureValidCondition(condition: any): "Excellent" | "Good" | "Fair" | "Poor" {
  if (typeof condition === 'string') {
    const validValues = ["Excellent", "Good", "Fair", "Poor"];
    const normalized = condition.charAt(0).toUpperCase() + condition.slice(1).toLowerCase();
    
    if (validValues.includes(normalized)) {
      return normalized as "Excellent" | "Good" | "Fair" | "Poor";
    }
  }
  
  // Default to "Good" if not valid
  return "Good";
}

// Helper function to convert condition string to numeric score
function convertConditionToScore(condition: string): number {
  switch (condition.toLowerCase()) {
    case 'excellent': return 90;
    case 'good': return 75;
    case 'fair': return 60;
    case 'poor': return 45;
    default: return 75; // Default to 'Good'
  }
}

// Helper function to get a base price for vehicle (simplified for demonstration)
function getBasePrice(make: string, model: string, year: number): number {
  // In production, this would query a database or API for accurate pricing
  // This is a simplified placeholder
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  
  // Base price starts at $30,000 and decreases with age
  let basePrice = 30000 - (age * 1500);
  
  // Premium brands adjustment
  const premiumBrands = ['BMW', 'Mercedes', 'Audi', 'Lexus', 'Porsche', 'Tesla'];
  if (premiumBrands.includes(make)) {
    basePrice *= 1.4;
  }
  
  // Budget brands adjustment
  const budgetBrands = ['Kia', 'Hyundai', 'Suzuki', 'Mitsubishi'];
  if (budgetBrands.includes(make)) {
    basePrice *= 0.85;
  }
  
  // Truck/SUV adjustment
  const truckSuvModels = ['F-150', 'Silverado', 'Ram', 'Explorer', 'Tahoe', 'Suburban', 'Highlander', '4Runner'];
  if (truckSuvModels.some(truck => model.includes(truck))) {
    basePrice *= 1.2;
  }
  
  // Ensure base price doesn't go below minimum threshold
  return Math.max(basePrice, 2000);
}
