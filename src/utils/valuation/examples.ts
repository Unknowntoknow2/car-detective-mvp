
import {
  ValuationParams,
  ValuationResult,
  EnhancedValuationParams,
  FinalValuationResult
} from './types';

// Example base market value
export const baseMarketValue = 25000;

// Example mileage
export const mileage = 50000;

// Example condition
export const condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' = 'Good';

// Example zip code
export const zipCode = '90210';

// Example premium features
export const premiumFeatures = ['Leather Seats', 'Navigation System'];

// Example ValuationParams object
export const valuationParams: ValuationParams = {
  baseMarketValue: baseMarketValue,
  mileage: mileage,
  condition: condition,
  zipCode: zipCode,
  features: premiumFeatures,
  make: 'Toyota',
  model: 'Camry',
  year: 2018
};

// Example ValuationResult object
export const valuationResult: ValuationResult = {
  finalValue: 28000,
  adjustments: [
    {
      name: 'Mileage',
      value: -1000,
      description: 'Below average mileage',
      percentAdjustment: -3.4,
      factor: 'mileage',
      impact: -1000
    },
    {
      name: 'Condition',
      value: 2000,
      description: 'Good condition',
      percentAdjustment: 6.9,
      factor: 'condition',
      impact: 2000
    },
    {
      name: 'Regional Market',
      value: 1500,
      description: 'High demand in your area',
      percentAdjustment: 5.2,
      factor: 'location',
      impact: 1500
    },
    {
      name: 'Premium Features',
      value: 500,
      description: 'Leather seats and navigation system',
      percentAdjustment: 1.7,
      factor: 'features',
      impact: 500
    },
    {
      name: 'Market Trends',
      value: 1000,
      description: 'Favorable market trends',
      percentAdjustment: 3.4,
      factor: 'trends',
      impact: 1000
    }
  ],
  confidenceScore: 95,
  baseValue: baseMarketValue,
  estimatedValue: 28000,
  priceRange: [26500, 29500]
};

// Example EnhancedValuationParams object
export const enhancedValuationParams: EnhancedValuationParams = {
  baseMarketValue: baseMarketValue,
  mileage: mileage,
  condition: condition,
  zipCode: zipCode,
  features: premiumFeatures,
  accidentCount: 0,
  trim: 'LE',
  bodyType: 'Sedan',
  transmission: 'Automatic',
  fuelType: 'Gasoline',
  make: 'Toyota',
  model: 'Camry',
  year: 2018,
  aiConditionOverride: {
    condition: 'Good',
    confidenceScore: 80,
    issuesDetected: [],
    aiSummary: 'Vehicle is in good condition with no visible issues.'
  }
};

// Example FinalValuationResult object
export const finalValuationResult: FinalValuationResult = {
  finalValue: 30000,
  adjustments: [
    {
      name: 'Mileage',
      value: -1000,
      description: 'Below average mileage',
      percentAdjustment: -3.3,
      factor: 'mileage',
      impact: -1000
    },
    {
      name: 'Condition',
      value: 2000,
      description: 'Good condition',
      percentAdjustment: 6.7,
      factor: 'condition',
      impact: 2000
    },
    {
      name: 'Regional Market',
      value: 1500,
      description: 'High demand in your area',
      percentAdjustment: 5.0,
      factor: 'location',
      impact: 1500
    },
    {
      name: 'Premium Features',
      value: 500,
      description: 'Leather seats and navigation system',
      percentAdjustment: 1.7,
      factor: 'features',
      impact: 500
    },
    {
      name: 'Accident History',
      value: -500,
      description: 'No accident history',
      percentAdjustment: -1.7,
      factor: 'accident',
      impact: -500
    },
    {
      name: 'Trim Level',
      value: 500,
      description: 'LE trim level',
      percentAdjustment: 1.7,
      factor: 'trim',
      impact: 500
    },
    {
      name: 'Market Trends',
      value: 1000,
      description: 'Favorable market trends',
      percentAdjustment: 3.3,
      factor: 'trends',
      impact: 1000
    }
  ],
  confidenceScore: 95,
  baseValue: baseMarketValue,
  estimatedValue: 30000,
  priceRange: [28500, 31500]
};
