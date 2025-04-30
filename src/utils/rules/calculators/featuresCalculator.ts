
import { AdjustmentBreakdown, RulesEngineInput } from '../types';
import { getPremiumFeaturesAdjustment } from '../../adjustments/featureAdjustments';
import valuationRules from '../../valuationRules.json';

export class FeaturesCalculator {
  public calculate(input: RulesEngineInput): AdjustmentBreakdown | null {
    if (!input.premiumFeatures || input.premiumFeatures.length === 0) {
      return null;
    }
    
    // Get the features from our rules
    const featureRules = valuationRules.adjustments.premiumFeatures;
    const featureValueCap = valuationRules.adjustments.featureValueCap;
    
    // Calculate the total value of all features
    let totalValue = 0;
    const featuresWithValues: { name: string; value: number }[] = [];

    input.premiumFeatures.forEach(feature => {
      const featureKey = feature.toLowerCase();
      const featureInfo = featureRules[featureKey as keyof typeof featureRules];
      
      if (featureInfo) {
        const featureValue = input.basePrice * featureInfo.value;
        totalValue += featureValue;
        featuresWithValues.push({
          name: featureInfo.description || feature,
          value: featureValue
        });
      }
    });
    
    // Apply the feature value cap
    const cappedPercentage = Math.min(
      featureValueCap,
      totalValue / input.basePrice
    );
    
    // Calculate the actual capped value
    const cappedValue = input.basePrice * cappedPercentage;
    
    // Check if we have any feature value
    if (cappedValue <= 0) {
      return null;
    }
    
    // Create a description of the features and their values
    const formattedTotal = cappedValue.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    
    // Generate a description
    let description = "";
    
    if (featuresWithValues.length > 0) {
      const featuresText = featuresWithValues.map(f => f.name).join(', ');
      
      if (cappedValue < totalValue) {
        description = `Premium features (${featuresText}) add ${Math.round(cappedPercentage * 100)}% to value (capped at ${formattedTotal})`;
      } else {
        description = `Premium features (${featuresText}) add ${Math.round(cappedPercentage * 100)}% to value (${formattedTotal})`;
      }
    } else {
      description = "Premium features increase vehicle value";
    }
    
    return {
      name: "Premium Features",
      value: cappedValue,
      description,
      percentAdjustment: cappedPercentage
    };
  }
}
