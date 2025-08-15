import { FollowUpAnswers } from '@/types/follow-up-answers';
import { TabValidation } from '@/components/followup/validation/TabValidation';

export interface MissingFieldImpact {
  field: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  impactDescription: string;
  valueImpact: string;
  helpText: string;
  currentAccuracy: number;
  improvedAccuracy: number;
}

export interface MissingDataAnalysis {
  missingFields: MissingFieldImpact[];
  currentAccuracyRange: string;
  improvedAccuracyRange: string;
  confidenceBoost: number;
  completionPercentage: number;
  isPremiumRequired: boolean;
}

// Field impact definitions with accuracy improvements
const FIELD_IMPACTS: Record<string, Omit<MissingFieldImpact, 'field'>> = {
  zip_code: {
    category: 'location',
    priority: 'high',
    impactDescription: 'Local market pricing varies significantly by region',
    valueImpact: '$500-2,500',
    helpText: 'ZIP code enables regional market analysis and local pricing trends',
    currentAccuracy: 85,
    improvedAccuracy: 92
  },
  mileage: {
    category: 'condition',
    priority: 'high', 
    impactDescription: 'Mileage is the strongest predictor of vehicle value',
    valueImpact: '$1,000-5,000',
    helpText: 'Current odometer reading for accurate depreciation calculation',
    currentAccuracy: 80,
    improvedAccuracy: 94
  },
  condition: {
    category: 'condition',
    priority: 'high',
    impactDescription: 'Overall condition directly affects market positioning',
    valueImpact: '$2,000-8,000',
    helpText: 'Honest assessment of vehicle condition for accurate valuation',
    currentAccuracy: 75,
    improvedAccuracy: 90
  },
  accidents: {
    category: 'history',
    priority: 'high',
    impactDescription: 'Accident history significantly impacts resale value',
    valueImpact: '$1,500-6,000',
    helpText: 'Any collision history, even minor incidents, affects value',
    currentAccuracy: 82,
    improvedAccuracy: 91
  },
  serviceHistory: {
    category: 'history',
    priority: 'medium',
    impactDescription: 'Well-maintained vehicles command premium pricing',
    valueImpact: '$800-3,000',
    helpText: 'Regular maintenance records increase buyer confidence',
    currentAccuracy: 88,
    improvedAccuracy: 93
  },
  title_status: {
    category: 'legal',
    priority: 'high',
    impactDescription: 'Title issues can severely limit marketability',
    valueImpact: '$3,000-12,000',
    helpText: 'Clean, lien, salvage, or other title status affects value',
    currentAccuracy: 85,
    improvedAccuracy: 96
  },
  modifications: {
    category: 'features',
    priority: 'medium',
    impactDescription: 'Modifications can increase or decrease value depending on quality',
    valueImpact: '$500-4,000',
    helpText: 'Aftermarket parts and modifications affect resale appeal',
    currentAccuracy: 87,
    improvedAccuracy: 92
  },
  tire_condition: {
    category: 'condition',
    priority: 'medium',
    impactDescription: 'Tire replacement is an immediate buyer expense',
    valueImpact: '$400-1,200',
    helpText: 'Tire condition affects negotiation position',
    currentAccuracy: 89,
    improvedAccuracy: 92
  },
  exterior_condition: {
    category: 'condition',
    priority: 'medium',
    impactDescription: 'Exterior condition affects first impressions and value',
    valueImpact: '$800-3,500',
    helpText: 'Paint, body damage, and exterior wear assessment',
    currentAccuracy: 86,
    improvedAccuracy: 91
  },
  interior_condition: {
    category: 'condition',
    priority: 'medium',
    impactDescription: 'Interior wear reflects vehicle care and usage',
    valueImpact: '$600-2,500',
    helpText: 'Seats, dashboard, and interior component condition',
    currentAccuracy: 87,
    improvedAccuracy: 91
  },
  photos: {
    category: 'verification',
    priority: 'medium',
    impactDescription: 'Photos enable AI condition scoring and verification',
    valueImpact: '$300-2,000',
    helpText: '3-8 clear photos unlock AI analysis and condition verification',
    currentAccuracy: 85,
    improvedAccuracy: 93
  },
  previous_owners: {
    category: 'history',
    priority: 'low',
    impactDescription: 'Single-owner vehicles typically command higher prices',
    valueImpact: '$200-1,500',
    helpText: 'Number of previous owners affects buyer perception',
    currentAccuracy: 91,
    improvedAccuracy: 93
  },
  features: {
    category: 'features',
    priority: 'low',
    impactDescription: 'Premium features and options add value',
    valueImpact: '$300-2,000',
    helpText: 'Navigation, sunroof, premium audio, and other options',
    currentAccuracy: 89,
    improvedAccuracy: 92
  }
};

/**
 * Analyzes form data to identify missing fields that would improve valuation accuracy
 */
export function analyzeMissingFields(
  formData: FollowUpAnswers,
  hasPhotos: boolean = false,
  isPremium: boolean = false
): MissingDataAnalysis {
  const missingFields: MissingFieldImpact[] = [];
  const validation = TabValidation.validateAllTabs(formData);
  
  // Check basic required fields
  if (!formData.zip_code || formData.zip_code.length !== 5) {
    missingFields.push({ field: 'zip_code', ...FIELD_IMPACTS.zip_code });
  }
  
  if (!formData.mileage || formData.mileage <= 0) {
    missingFields.push({ field: 'mileage', ...FIELD_IMPACTS.mileage });
  }
  
  if (!formData.condition) {
    missingFields.push({ field: 'condition', ...FIELD_IMPACTS.condition });
  }
  
  // Check accident history
  if (!formData.accidents || formData.accidents.hadAccident === undefined) {
    missingFields.push({ field: 'accidents', ...FIELD_IMPACTS.accidents });
  }
  
  // Check title status
  if (!formData.title_status) {
    missingFields.push({ field: 'title_status', ...FIELD_IMPACTS.title_status });
  }
  
  // Check service history
  if (!formData.serviceHistory || formData.serviceHistory.hasRecords === undefined) {
    missingFields.push({ field: 'serviceHistory', ...FIELD_IMPACTS.serviceHistory });
  }
  
  // Check modifications
  if (!formData.modifications || formData.modifications.hasModifications === undefined) {
    missingFields.push({ field: 'modifications', ...FIELD_IMPACTS.modifications });
  }
  
  // Check detailed condition assessments
  if (!formData.tire_condition) {
    missingFields.push({ field: 'tire_condition', ...FIELD_IMPACTS.tire_condition });
  }
  
  if (!formData.exterior_condition) {
    missingFields.push({ field: 'exterior_condition', ...FIELD_IMPACTS.exterior_condition });
  }
  
  if (!formData.interior_condition) {
    missingFields.push({ field: 'interior_condition', ...FIELD_IMPACTS.interior_condition });
  }
  
  // Check photos (if premium)
  if (isPremium && !hasPhotos) {
    missingFields.push({ field: 'photos', ...FIELD_IMPACTS.photos });
  }
  
  // Check optional but valuable fields
  if (!formData.previous_owners) {
    missingFields.push({ field: 'previous_owners', ...FIELD_IMPACTS.previous_owners });
  }
  
  if (!formData.features || formData.features.length === 0) {
    missingFields.push({ field: 'features', ...FIELD_IMPACTS.features });
  }
  
  // Sort by priority and potential impact
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  missingFields.sort((a, b) => {
    if (a.priority !== b.priority) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return b.improvedAccuracy - b.currentAccuracy - (a.improvedAccuracy - a.currentAccuracy);
  });
  
  // Calculate accuracy improvements
  const completionPercentage = TabValidation.getOverallCompletion(formData);
  const baseAccuracy = Math.min(completionPercentage, 85);
  
  // Calculate potential accuracy with missing fields filled
  const totalImprovements = missingFields.reduce((sum, field) => {
    return sum + (field.improvedAccuracy - field.currentAccuracy);
  }, 0);
  
  const improvedAccuracy = Math.min(95, baseAccuracy + (totalImprovements * 0.1));
  const confidenceBoost = improvedAccuracy - baseAccuracy;
  
  return {
    missingFields: missingFields.slice(0, 6), // Top 6 most impactful
    currentAccuracyRange: `±${Math.round(100 - baseAccuracy)}%`,
    improvedAccuracyRange: `±${Math.round(100 - improvedAccuracy)}%`,
    confidenceBoost,
    completionPercentage,
    isPremiumRequired: missingFields.some(f => f.field === 'photos')
  };
}

/**
 * Gets personalized messaging for missing field completion
 */
export function getMissingFieldMessage(
  analysis: MissingDataAnalysis,
  vehicleInfo?: { make?: string; model?: string; year?: number }
): string {
  const { missingFields, currentAccuracyRange, improvedAccuracyRange } = analysis;
  
  if (missingFields.length === 0) {
    return "Your valuation data is complete! We have everything needed for maximum accuracy.";
  }
  
  const topFields = missingFields.slice(0, 3);
  const vehicleDescription = vehicleInfo 
    ? `${vehicleInfo.year || ''} ${vehicleInfo.make || ''} ${vehicleInfo.model || ''}`.trim()
    : 'your vehicle';
  
  let message = `We're almost ready — just a few details left to finalize your ${vehicleDescription} valuation.\n\n`;
  message += `To provide the most accurate value (and unlock features like Carfax/AutoCheck analysis and AI photo grading), we still need:\n\n`;
  
  topFields.forEach((field, index) => {
    message += `**${field.impactDescription}** — ${field.helpText}`;
    if (field.valueImpact) {
      message += ` (Impact: ${field.valueImpact})`;
    }
    message += '\n\n';
  });
  
  message += `Completing these fields can reduce your valuation range from ${currentAccuracyRange} to as low as ${improvedAccuracyRange}, giving you a number you can confidently defend in any sale, trade-in, or insurance claim.\n\n`;
  
  if (analysis.isPremiumRequired) {
    message += `**Tip:** Uploading 3–8 clear photos (interior, exterior, VIN plate) enables our AI condition scoring — one of the most accurate in the industry.\n\n`;
  }
  
  return message;
}