
/**
 * Premium feature value data
 * Values represent both percentage and fixed amount adjustments to the base value
 */
export interface FeatureValue {
  name: string;
  percentValue: number;  // Percentage adjustment
  fixedValue: number;    // Fixed dollar adjustment
  description: string;   // Description of the feature
}

/**
 * Maximum combined feature adjustment as percentage of base value
 * This prevents overvaluation due to features
 */
export const MAX_FEATURE_ADJUSTMENT_PERCENT = 0.12; // 12% maximum
