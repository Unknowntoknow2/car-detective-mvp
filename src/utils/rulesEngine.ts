import { VehicleCondition } from './adjustments/types';
import rulesConfig from './valuationRules.json';

export interface AdjustmentBreakdown {
  label: string;
  value: number;
  description?: string;
}

export interface RulesEngineInput {
  make?: string;
  model?: string;
  year?: number;
  mileage: number;
  condition: string;
  zipCode?: string;
  trim?: string;
  accidentCount?: number;
  premiumFeatures?: string[];
  basePrice: number;
}

export class RulesEngine {
  private rules: typeof rulesConfig;

  constructor() {
    this.rules = rulesConfig;
  }

  private getMileageAdjustment(mileage: number, basePrice: number): AdjustmentBreakdown {
    const mileageRules = this.rules.adjustments.mileage;
    const rule = mileageRules.find(r => mileage >= r.min && mileage <= r.max);
    
    const adjustment = rule ? basePrice * rule.percent : 0;
    
    return {
      label: 'Mileage Impact',
      value: Math.round(adjustment),
      description: this.getMileageDescription(mileage)
    };
  }

  private getConditionAdjustment(condition: string, basePrice: number): AdjustmentBreakdown {
    const conditionRules = this.rules.adjustments.condition as Record<string, number>;
    const conditionValue = condition.toLowerCase() as keyof typeof conditionRules;
    const adjustment = conditionRules[conditionValue] !== undefined 
      ? basePrice * conditionRules[conditionValue] 
      : 0;
    
    return {
      label: 'Condition Impact',
      value: Math.round(adjustment),
      description: `Vehicle in ${condition} condition`
    };
  }

  private getZipAdjustment(zipCode: string | undefined, basePrice: number): AdjustmentBreakdown | null {
    if (!zipCode) return null;
    
    const zipRules = this.rules.adjustments.zip;
    
    let zoneType: 'hot' | 'cold' | 'default' = 'default';
    if (zipRules.hot.includes(zipCode)) {
      zoneType = 'hot';
    } else if (zipRules.cold.includes(zipCode)) {
      zoneType = 'cold';
    }
    
    const adjustment = basePrice * zipRules.adjustments[zoneType];
    
    return {
      label: 'Location Impact',
      value: Math.round(adjustment),
      description: `Based on market demand in ${zipCode}`
    };
  }

  private getTrimAdjustment(
    make: string | undefined, 
    model: string | undefined, 
    trim: string | undefined, 
    basePrice: number
  ): AdjustmentBreakdown | null {
    if (!make || !model || !trim) return null;
    
    const trimRules = this.rules.adjustments.trims as Record<string, Record<string, Array<{trim: string; percent: number}>>>;
    
    if (!trimRules[make] || !trimRules[make][model]) return null;
    
    const trimData = trimRules[make][model].find(t => 
      t.trim.toLowerCase() === trim.toLowerCase()
    );
    
    if (!trimData) return null;
    
    const adjustment = basePrice * trimData.percent;
    
    return {
      label: 'Trim Level',
      value: Math.round(adjustment),
      description: `${make} ${model} ${trim} trim package`
    };
  }

  private getAccidentAdjustment(accidentCount: number | undefined, basePrice: number): AdjustmentBreakdown | null {
    if (accidentCount === undefined || accidentCount === 0) return null;
    
    const accidentRules = this.rules.adjustments.accidents;
    const rule = accidentRules.find(r => r.count === Math.min(accidentCount, 3)) || 
                 accidentRules[accidentRules.length - 1]; // Use the highest penalty for counts above what we have rules for
    
    const adjustment = basePrice * rule.percent;
    
    return {
      label: 'Accident History',
      value: Math.round(adjustment),
      description: `Vehicle has ${accidentCount} reported accident${accidentCount > 1 ? 's' : ''}`
    };
  }

  private getPremiumFeaturesAdjustment(features: string[] | undefined, basePrice: number): AdjustmentBreakdown | null {
    if (!features || features.length === 0) return null;
    
    const featureRules = this.rules.adjustments.premiumFeatures as Record<string, {value: number; description: string}>;
    let totalPercent = 0;
    
    features.forEach(feature => {
      const featureKey = Object.keys(featureRules).find(
        key => key.toLowerCase() === feature.toLowerCase()
      );
      
      if (featureKey) {
        totalPercent += featureRules[featureKey].value;
      }
    });
    
    // Cap the total premium features adjustment
    const cappedPercent = Math.min(totalPercent, this.rules.adjustments.featureValueCap);
    const adjustment = basePrice * cappedPercent;
    
    return {
      label: 'Premium Features',
      value: Math.round(adjustment),
      description: `Vehicle has ${features.length} premium features`
    };
  }

  private getMileageDescription(mileage: number): string {
    if (mileage < 30000) {
      return "Vehicle has low mileage (below 30,000 miles)";
    } else if (mileage <= 60000) {
      return "Vehicle has average mileage";
    } else if (mileage <= 100000) {
      return "Vehicle has high mileage (above 60,000 miles)";
    } else if (mileage <= 150000) {
      return "Vehicle has very high mileage (above 100,000 miles)";
    } else {
      return "Vehicle has excessive mileage (above 150,000 miles)";
    }
  }

  public calculateAdjustments(input: RulesEngineInput): AdjustmentBreakdown[] {
    const adjustments: AdjustmentBreakdown[] = [];
    
    // Add mileage adjustment
    adjustments.push(this.getMileageAdjustment(input.mileage, input.basePrice));
    
    // Add condition adjustment
    adjustments.push(this.getConditionAdjustment(input.condition, input.basePrice));
    
    // Add zip code adjustment if available
    const zipAdjustment = this.getZipAdjustment(input.zipCode, input.basePrice);
    if (zipAdjustment) adjustments.push(zipAdjustment);
    
    // Add trim adjustment if available
    const trimAdjustment = this.getTrimAdjustment(
      input.make, 
      input.model, 
      input.trim, 
      input.basePrice
    );
    if (trimAdjustment) adjustments.push(trimAdjustment);
    
    // Add accident adjustment if available
    const accidentAdjustment = this.getAccidentAdjustment(
      input.accidentCount, 
      input.basePrice
    );
    if (accidentAdjustment) adjustments.push(accidentAdjustment);
    
    // Add premium features adjustment if available
    const featuresAdjustment = this.getPremiumFeaturesAdjustment(
      input.premiumFeatures, 
      input.basePrice
    );
    if (featuresAdjustment) adjustments.push(featuresAdjustment);
    
    return adjustments;
  }

  public calculateTotalAdjustment(adjustments: AdjustmentBreakdown[]): number {
    return adjustments.reduce((sum, item) => sum + item.value, 0);
  }
}

// Singleton instance
const rulesEngine = new RulesEngine();
export default rulesEngine;
