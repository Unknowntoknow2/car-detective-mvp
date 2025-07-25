/**
 * Mileage Analyzer - Sophisticated mileage assessment
 */

import { MileageAnalysisInput, MileageAnalysisResult } from '../types/core';

export class MileageAnalyzer {
  private readonly AVERAGE_MILES_PER_YEAR = 12000;
  private readonly HIGH_MILEAGE_THRESHOLD = 15000;
  private readonly LOW_MILEAGE_THRESHOLD = 8000;

  // Vehicle type specific annual mileage expectations
  private readonly VEHICLE_TYPE_MULTIPLIERS = {
    'sedan': 1.0,
    'suv': 1.1,
    'truck': 1.2,
    'coupe': 0.8,
    'convertible': 0.7,
    'wagon': 1.0,
    'hatchback': 0.9,
    'van': 1.3,
    'crossover': 1.05
  };

  analyze(input: MileageAnalysisInput): MileageAnalysisResult {
    const currentYear = new Date().getFullYear();
    const vehicleAge = Math.max(1, currentYear - input.year);
    
    const expectedMileage = this.calculateExpectedMileage(vehicleAge, input.vehicleType);
    const mileageDifference = input.mileage - expectedMileage;
    const mileagePerYear = input.mileage / vehicleAge;
    
    const category = this.categorizeMileage(mileagePerYear, input.vehicleType);
    const adjustmentFactor = this.calculateAdjustmentFactor(
      input.mileage, 
      expectedMileage, 
      vehicleAge,
      input.vehicleType
    );
    
    const score = this.calculateMileageScore(mileagePerYear, input.vehicleType);
    const confidence = this.calculateConfidence(vehicleAge, input.mileage);

    return {
      score,
      adjustmentFactor,
      confidence,
      category,
      expectedMileage
    };
  }

  private calculateExpectedMileage(age: number, vehicleType?: string): number {
    const typeMultiplier = vehicleType 
      ? this.VEHICLE_TYPE_MULTIPLIERS[vehicleType as keyof typeof this.VEHICLE_TYPE_MULTIPLIERS] || 1.0
      : 1.0;
    
    return age * this.AVERAGE_MILES_PER_YEAR * typeMultiplier;
  }

  private categorizeMileage(mileagePerYear: number, vehicleType?: string): 'low' | 'average' | 'high' | 'very_high' {
    const typeMultiplier = vehicleType 
      ? this.VEHICLE_TYPE_MULTIPLIERS[vehicleType as keyof typeof this.VEHICLE_TYPE_MULTIPLIERS] || 1.0
      : 1.0;
    
    const adjustedLowThreshold = this.LOW_MILEAGE_THRESHOLD * typeMultiplier;
    const adjustedHighThreshold = this.HIGH_MILEAGE_THRESHOLD * typeMultiplier;
    const adjustedAverageThreshold = this.AVERAGE_MILES_PER_YEAR * typeMultiplier;

    if (mileagePerYear < adjustedLowThreshold) {
      return 'low';
    } else if (mileagePerYear > adjustedHighThreshold * 1.5) {
      return 'very_high';
    } else if (mileagePerYear > adjustedHighThreshold) {
      return 'high';
    } else {
      return 'average';
    }
  }

  private calculateAdjustmentFactor(
    actualMileage: number, 
    expectedMileage: number, 
    age: number,
    vehicleType?: string
  ): number {
    const mileageDifference = actualMileage - expectedMileage;
    const percentDifference = mileageDifference / expectedMileage;
    
    // Base adjustment per 1000 miles difference
    const baseAdjustmentPer1000Miles = 0.002; // 0.2% per 1000 miles
    
    // Age-based penalty scaling (older cars are less affected by high mileage)
    const ageFactor = Math.max(0.5, 1 - (age - 5) * 0.1);
    
    // Vehicle type factor (some vehicles handle high mileage better)
    const vehicleTypeFactor = this.getVehicleTypeMileageTolerance(vehicleType);
    
    // Calculate total adjustment
    let adjustmentFactor = 1 + (percentDifference * ageFactor * vehicleTypeFactor);
    
    // Apply diminishing returns for extreme values
    if (adjustmentFactor > 1.2) {
      adjustmentFactor = 1.2 + (adjustmentFactor - 1.2) * 0.5;
    } else if (adjustmentFactor < 0.7) {
      adjustmentFactor = 0.7 + (adjustmentFactor - 0.7) * 0.5;
    }
    
    return Math.max(0.6, Math.min(1.3, adjustmentFactor));
  }

  private getVehicleTypeMileageTolerance(vehicleType?: string): number {
    const toleranceMap = {
      'truck': 0.8,     // Trucks handle high mileage better
      'van': 0.8,       // Commercial vehicles built for high mileage
      'sedan': 1.0,     // Average tolerance
      'suv': 0.9,       // Good highway mileage tolerance
      'coupe': 1.2,     // Sports cars more affected by high mileage
      'convertible': 1.3, // Luxury vehicles more affected
      'wagon': 0.95,
      'hatchback': 1.05,
      'crossover': 0.95
    };
    
    return vehicleType ? toleranceMap[vehicleType as keyof typeof toleranceMap] || 1.0 : 1.0;
  }

  private calculateMileageScore(mileagePerYear: number, vehicleType?: string): number {
    const category = this.categorizeMileage(mileagePerYear, vehicleType);
    
    const scoreMap = {
      'low': 90,        // Low mileage is generally good
      'average': 80,    // Average mileage
      'high': 60,       // High mileage reduces value
      'very_high': 40   // Very high mileage significantly reduces value
    };
    
    let baseScore = scoreMap[category];
    
    // Fine-tune based on exact mileage within category
    const typeMultiplier = vehicleType 
      ? this.VEHICLE_TYPE_MULTIPLIERS[vehicleType as keyof typeof this.VEHICLE_TYPE_MULTIPLIERS] || 1.0
      : 1.0;
    
    const adjustedAverage = this.AVERAGE_MILES_PER_YEAR * typeMultiplier;
    
    if (category === 'low') {
      // Very low mileage might indicate lack of use (potentially negative)
      if (mileagePerYear < 3000) {
        baseScore -= 10; // Penalize extremely low mileage
      }
    } else if (category === 'average') {
      // Reward mileage close to ideal average
      const deviation = Math.abs(mileagePerYear - adjustedAverage) / adjustedAverage;
      baseScore += (1 - deviation) * 10;
    }
    
    return Math.max(20, Math.min(100, baseScore));
  }

  private calculateConfidence(age: number, mileage: number): number {
    let confidence = 0.8; // Base confidence
    
    // Higher confidence for newer vehicles
    if (age <= 3) {
      confidence += 0.1;
    }
    
    // Lower confidence for very old or very high mileage vehicles
    if (age > 15) {
      confidence -= 0.1;
    }
    
    if (mileage > 200000) {
      confidence -= 0.15;
    }
    
    // Higher confidence for reasonable mileage ranges
    const mileagePerYear = mileage / age;
    if (mileagePerYear >= 8000 && mileagePerYear <= 15000) {
      confidence += 0.05;
    }
    
    return Math.max(0.5, Math.min(0.95, confidence));
  }

  /**
   * Get mileage insights and recommendations
   */
  getMileageInsights(input: MileageAnalysisInput): {
    insights: string[];
    recommendations: string[];
  } {
    const analysis = this.analyze(input);
    const insights: string[] = [];
    const recommendations: string[] = [];
    
    const currentYear = new Date().getFullYear();
    const age = currentYear - input.year;
    const mileagePerYear = input.mileage / age;
    
    // Generate insights
    insights.push(`Vehicle averages ${Math.round(mileagePerYear).toLocaleString()} miles per year`);
    insights.push(`Expected mileage for this age: ${Math.round(analysis.expectedMileage).toLocaleString()} miles`);
    
    const difference = input.mileage - analysis.expectedMileage;
    if (Math.abs(difference) > 5000) {
      insights.push(`${Math.abs(difference).toLocaleString()} miles ${difference > 0 ? 'above' : 'below'} expected`);
    }
    
    // Generate recommendations
    switch (analysis.category) {
      case 'low':
        recommendations.push('Low mileage vehicle - verify maintenance despite low use');
        if (mileagePerYear < 3000) {
          recommendations.push('Very low usage - check for mechanical issues from lack of use');
        }
        break;
      case 'average':
        recommendations.push('Average mileage for age - good indicator of normal use');
        break;
      case 'high':
        recommendations.push('High mileage - verify maintenance records and component condition');
        break;
      case 'very_high':
        recommendations.push('Very high mileage - thorough inspection recommended');
        recommendations.push('Check for wear on high-mileage components');
        break;
    }
    
    return { insights, recommendations };
  }
}