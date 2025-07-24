import { FollowUpAnswers, ServiceHistoryDetails, AccidentDetails, ModificationDetails } from '@/types/follow-up-answers';

export interface ValuationAdjustment {
  factor: string;
  impact: number;
  description: string;
  source: 'followup' | 'calculated' | 'ai_analysis';
  confidence: number;
}

/**
 * Service History Calculator
 * Regular maintenance adds value, poor maintenance reduces it
 */
export function calculateServiceHistoryAdjustment(
  serviceHistory: ServiceHistoryDetails,
  baseValue: number
): ValuationAdjustment | null {
  if (!serviceHistory || serviceHistory.hasRecords === undefined) return null;

  let impactPercent = 0;
  let description = '';

  if (!serviceHistory.hasRecords) {
    impactPercent = -2;
    description = 'No service records available - reduces buyer confidence';
  } else {
    // Has records - evaluate quality
    let qualityScore = 0;

    if (serviceHistory.regularMaintenance) qualityScore += 3;
    if (serviceHistory.dealerMaintained) qualityScore += 2;
    if (serviceHistory.frequency === 'regular') qualityScore += 2;
    if (serviceHistory.frequency === 'occasional') qualityScore += 1;
    if (serviceHistory.services && serviceHistory.services.length > 0) qualityScore += 1;

    if (qualityScore >= 5) {
      impactPercent = 4;
      description = 'Excellent service history with regular dealer maintenance';
    } else if (qualityScore >= 3) {
      impactPercent = 2;
      description = 'Good service history with documented maintenance';
    } else {
      impactPercent = 0;
      description = 'Basic service records available';
    }
  }

  const impact = Math.round((baseValue * impactPercent) / 100);

  return {
    factor: 'Service History',
    impact,
    description,
    source: 'followup',
    confidence: serviceHistory.hasRecords ? 85 : 70
  };
}

/**
 * Accident History Calculator
 * Frame damage significantly reduces value, multiple accidents compound
 */
export function calculateAccidentHistoryAdjustment(
  accidents: AccidentDetails,
  baseValue: number
): ValuationAdjustment | null {
  if (!accidents || accidents.hadAccident === false) {
    return {
      factor: 'Clean Accident History',
      impact: Math.round(baseValue * 0.02), // 2% bonus for clean history
      description: 'No accidents reported - adds to vehicle value',
      source: 'followup',
      confidence: 90
    };
  }

  let impactPercent = 0;
  let description = '';

  // Frame damage is critical
  if (accidents.frameDamage) {
    impactPercent = -18;
    description = 'Frame damage significantly reduces value';
  } else {
    // Calculate based on severity and count
    switch (accidents.severity) {
      case 'minor':
        impactPercent = -3 * accidents.count;
        description = `${accidents.count} minor accident${accidents.count > 1 ? 's' : ''} reported`;
        break;
      case 'moderate':
        impactPercent = -8 * accidents.count;
        description = `${accidents.count} moderate accident${accidents.count > 1 ? 's' : ''} with repairs`;
        break;
      case 'major':
        impactPercent = -15 * accidents.count;
        description = `${accidents.count} major accident${accidents.count > 1 ? 's' : ''} with extensive damage`;
        break;
    }

    // Airbag deployment adds additional penalty
    if (accidents.airbagDeployment) {
      impactPercent -= 5;
      description += ' (airbag deployment)';
    }

    // Quality repairs can reduce penalty
    if (accidents.repaired && accidents.repairShops?.includes('certified')) {
      impactPercent *= 0.8; // 20% reduction in penalty
      description += ' - certified repairs completed';
    }
  }

  const impact = Math.round((baseValue * impactPercent) / 100);

  return {
    factor: 'Accident History',
    impact,
    description,
    source: 'followup',
    confidence: accidents.frameDamage ? 95 : 80
  };
}

/**
 * Modification Calculator
 * Evaluates impact of vehicle modifications
 */
export function calculateModificationAdjustment(
  modifications: ModificationDetails,
  baseValue: number
): ValuationAdjustment | null {
  if (!modifications || !modifications.hasModifications) return null;

  let impactPercent = 0;
  let description = '';

  const modTypes = modifications.types || [];
  
  // Performance modifications - variable impact
  if (modTypes.includes('performance')) {
    if (modifications.reversible) {
      impactPercent = 2;
      description = 'Reversible performance modifications may add value';
    } else {
      impactPercent = -5;
      description = 'Permanent performance modifications reduce appeal to general buyers';
    }
  }

  // Aesthetic modifications - generally neutral to negative
  if (modTypes.includes('aesthetic') || modTypes.includes('visual')) {
    impactPercent += modifications.reversible ? 0 : -3;
    description += (description ? '; ' : '') + 'Aesthetic modifications affect marketability';
  }

  // Functional improvements - can add value
  if (modTypes.includes('functional') || modTypes.includes('utility')) {
    impactPercent += 3;
    description += (description ? '; ' : '') + 'Functional improvements add utility value';
  }

  // Safety modifications - positive impact
  if (modTypes.includes('safety')) {
    impactPercent += 2;
    description += (description ? '; ' : '') + 'Safety upgrades enhance value';
  }

  // Extensive modifications penalty
  if (modTypes.length > 3) {
    impactPercent -= 3;
    description += '; Extensive modifications limit buyer appeal';
  }

  const impact = Math.round((baseValue * impactPercent) / 100);

  return {
    factor: 'Vehicle Modifications',
    impact,
    description: description || 'Vehicle modifications evaluated',
    source: 'followup',
    confidence: 75
  };
}

/**
 * Condition Details Calculator
 * Evaluates tire, brake, and component conditions
 */
export function calculateConditionDetailsAdjustment(
  followUpData: FollowUpAnswers,
  baseValue: number
): ValuationAdjustment[] {
  const adjustments: ValuationAdjustment[] = [];

  // Tire condition
  if (followUpData.tire_condition) {
    let tireImpact = 0;
    switch (followUpData.tire_condition) {
      case 'excellent':
        tireImpact = 500;
        break;
      case 'poor':
      case 'worn':
      case 'replacement':
        tireImpact = -800;
        break;
    }

    if (tireImpact !== 0) {
      adjustments.push({
        factor: 'Tire Condition',
        impact: tireImpact,
        description: `Tires are in ${followUpData.tire_condition} condition`,
        source: 'followup',
        confidence: 85
      });
    }
  }

  // Brake condition
  if (followUpData.brake_condition) {
    let brakeImpact = 0;
    switch (followUpData.brake_condition) {
      case 'excellent':
        brakeImpact = 300;
        break;
      case 'poor':
        brakeImpact = -600;
        break;
    }

    if (brakeImpact !== 0) {
      adjustments.push({
        factor: 'Brake Condition',
        impact: brakeImpact,
        description: `Brakes are in ${followUpData.brake_condition} condition`,
        source: 'followup',
        confidence: 85
      });
    }
  }

  // Dashboard warning lights
  if (followUpData.dashboard_lights && followUpData.dashboard_lights.length > 0) {
    let lightsPenalty = 0;
    const lights = followUpData.dashboard_lights;

    if (lights.includes('engine') || lights.includes('check_engine')) {
      lightsPenalty += -1500;
    }
    if (lights.includes('transmission')) {
      lightsPenalty += -1200;
    }
    if (lights.includes('abs') || lights.includes('brake')) {
      lightsPenalty += -800;
    }
    if (lights.includes('airbag')) {
      lightsPenalty += -1000;
    }

    // General warning lights
    lightsPenalty += (lights.length * -200);

    if (lightsPenalty < 0) {
      adjustments.push({
        factor: 'Dashboard Warning Lights',
        impact: lightsPenalty,
        description: `${lights.length} dashboard warning light${lights.length > 1 ? 's' : ''} active`,
        source: 'followup',
        confidence: 90
      });
    }
  }

  return adjustments;
}

/**
 * AI-Powered Free Text Analysis
 * Analyzes additional notes for value-affecting information
 */
export function analyzeAdditionalNotes(
  additionalNotes: string,
  baseValue: number
): ValuationAdjustment[] {
  if (!additionalNotes || additionalNotes.trim().length < 10) return [];

  const adjustments: ValuationAdjustment[] = [];
  const notes = additionalNotes.toLowerCase();

  // Positive keywords
  const positiveKeywords = [
    { words: ['garage kept', 'garaged', 'covered parking'], impact: 500, desc: 'Garage kept vehicle' },
    { words: ['new tires', 'recent tires'], impact: 400, desc: 'Recently replaced tires' },
    { words: ['new battery', 'recent battery'], impact: 150, desc: 'New battery installed' },
    { words: ['oil changed', 'recent service'], impact: 200, desc: 'Recent maintenance performed' },
    { words: ['non smoker', 'smoke free'], impact: 300, desc: 'Smoke-free vehicle' },
    { words: ['single owner', 'one owner'], impact: 600, desc: 'Single owner vehicle' },
    { words: ['highway miles', 'freeway miles'], impact: 400, desc: 'Primarily highway driven' }
  ];

  // Negative keywords
  const negativeKeywords = [
    { words: ['needs repair', 'needs work'], impact: -1000, desc: 'Vehicle needs repairs' },
    { words: ['engine noise', 'engine problem'], impact: -2000, desc: 'Engine issues reported' },
    { words: ['transmission slip', 'transmission problem'], impact: -1800, desc: 'Transmission issues' },
    { words: ['rust', 'corrosion'], impact: -800, desc: 'Rust or corrosion present' },
    { words: ['accident', 'collision'], impact: -1200, desc: 'Accident mentioned in notes' },
    { words: ['flood', 'water damage'], impact: -3000, desc: 'Flood or water damage' },
    { words: ['salvage', 'rebuilt'], impact: -2500, desc: 'Salvage or rebuilt title mentioned' }
  ];

  // Check positive keywords
  positiveKeywords.forEach(keyword => {
    if (keyword.words.some(word => notes.includes(word))) {
      adjustments.push({
        factor: 'Additional Notes Analysis',
        impact: keyword.impact,
        description: keyword.desc,
        source: 'ai_analysis',
        confidence: 70
      });
    }
  });

  // Check negative keywords
  negativeKeywords.forEach(keyword => {
    if (keyword.words.some(word => notes.includes(word))) {
      adjustments.push({
        factor: 'Additional Notes Analysis',
        impact: keyword.impact,
        description: keyword.desc,
        source: 'ai_analysis',
        confidence: 75
      });
    }
  });

  return adjustments;
}

/**
 * Enhanced Confidence Calculator
 * Calculates confidence based on data completeness and consistency
 */
export function calculateDataCompleteness(followUpData: FollowUpAnswers): number {
  const fields = [
    'mileage', 'condition', 'accidents', 'serviceHistory', 'modifications',
    'tire_condition', 'brake_condition', 'transmission', 'title_status',
    'previous_use', 'additional_notes'
  ];

  let completedFields = 0;
  let totalFields = fields.length;

  fields.forEach(field => {
    const value = followUpData[field as keyof FollowUpAnswers];
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'object') {
        // For complex objects, check if they have meaningful data
        if (JSON.stringify(value) !== '{}' && JSON.stringify(value) !== '[]') {
          completedFields++;
        }
      } else {
        completedFields++;
      }
    }
  });

  return Math.round((completedFields / totalFields) * 100);
}

/**
 * Main Follow-Up Data Integration Function
 * Processes all follow-up data and returns comprehensive adjustments
 */
export function processFollowUpData(
  followUpData: FollowUpAnswers,
  baseValue: number
): {
  adjustments: ValuationAdjustment[];
  totalAdjustment: number;
  confidenceBoost: number;
  dataCompleteness: number;
} {
  const adjustments: ValuationAdjustment[] = [];

  // Service history
  const serviceAdj = calculateServiceHistoryAdjustment(followUpData.serviceHistory, baseValue);
  if (serviceAdj) adjustments.push(serviceAdj);

  // Accident history
  const accidentAdj = calculateAccidentHistoryAdjustment(followUpData.accidents, baseValue);
  if (accidentAdj) adjustments.push(accidentAdj);

  // Modifications
  const modAdj = calculateModificationAdjustment(followUpData.modifications, baseValue);
  if (modAdj) adjustments.push(modAdj);

  // Condition details
  const conditionAdjs = calculateConditionDetailsAdjustment(followUpData, baseValue);
  adjustments.push(...conditionAdjs);

  // Additional notes analysis
  if (followUpData.additional_notes) {
    const notesAdjs = analyzeAdditionalNotes(followUpData.additional_notes, baseValue);
    adjustments.push(...notesAdjs);
  }

  // Previous owners impact
  if (followUpData.previous_owners !== undefined) {
    if (followUpData.previous_owners === 1) {
      adjustments.push({
        factor: 'Previous Owners',
        impact: Math.round(baseValue * 0.03), // 3% bonus for single owner
        description: 'Single previous owner adds to vehicle desirability',
        source: 'followup',
        confidence: 85
      });
    } else if (followUpData.previous_owners > 3) {
      adjustments.push({
        factor: 'Previous Owners',
        impact: Math.round(baseValue * -0.02 * (followUpData.previous_owners - 2)), // Penalty for multiple owners
        description: `${followUpData.previous_owners} previous owners may affect value`,
        source: 'followup',
        confidence: 80
      });
    }
  }

  const totalAdjustment = adjustments.reduce((sum, adj) => sum + adj.impact, 0);
  const dataCompleteness = calculateDataCompleteness(followUpData);
  const confidenceBoost = Math.min(25, Math.round(dataCompleteness / 4)); // Up to 25% confidence boost

  return {
    adjustments,
    totalAdjustment,
    confidenceBoost,
    dataCompleteness
  };
}