
/**
 * Examples of using the valuation engine
 */

import { calculateFinalValuation, ValuationInput } from './calculateFinalValuation';
import { FinalValuationResult } from './types';

/**
 * Simple example of using the valuation engine with minimal parameters
 */
export async function basicValuationExample(): Promise<FinalValuationResult> {
  // Define the vehicle details
  const vehicleParams: ValuationInput = {
    make: 'Toyota',
    model: 'Camry',
    year: 2018,
    mileage: 45000,
    condition: 'Good',
    zipCode: '90210', // Important for regional adjustments
    // Optional parameters can be added for more accurate valuation
  };
  
  // Define a base market value if you have one, otherwise
  // the system will estimate one based on the vehicle details
  const basePrice = 25000;
  
  // Calculate the valuation
  return await calculateFinalValuation(vehicleParams, basePrice);
}

/**
 * Example with all possible parameters for maximum accuracy
 */
export async function detailedValuationExample(): Promise<FinalValuationResult> {
  // Define comprehensive vehicle details
  const vehicleParams: ValuationInput = {
    make: 'BMW',
    model: '3 Series',
    year: 2020,
    mileage: 25000,
    condition: 'Excellent',
    zipCode: '10001', // NYC
    trim: '330i',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    features: [
      'leather_seats',
      'navigation',
      'premium_audio',
      'panoramic_roof'
    ],
    accidentCount: 0,
    color: 'Black'
  };
  
  // Use a known market value if available
  const basePrice = 35000;
  
  // Calculate the valuation
  return await calculateFinalValuation(vehicleParams, basePrice);
}

/**
 * Example using photos and AI analysis
 */
export async function photoBasedValuationExample(photoScore: number): Promise<FinalValuationResult> {
  // Basic vehicle details
  const vehicleParams: ValuationInput = {
    make: 'Honda',
    model: 'Accord',
    year: 2019,
    mileage: 30000,
    condition: 'Good', // User-reported condition
    zipCode: '60601', // Chicago
    photoScore: photoScore // Photo analysis score (0-1)
  };
  
  // AI-detected condition (could come from photo analysis)
  const aiCondition = {
    condition: 'Good',
    confidenceScore: 85,
    issuesDetected: ['minor_scratches'],
    aiSummary: 'Vehicle appears to be in good condition with minor scratches on the driver-side door.'
  };
  
  // Use an estimated base value
  const baseValue = 22000;
  
  // Calculate valuation using photo data
  return await calculateFinalValuation(vehicleParams, baseValue, aiCondition);
}
