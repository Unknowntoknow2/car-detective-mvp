/**
 * Confidence Engine - Calculates valuation confidence scores
 */

import { ConfidenceBreakdown, ConfidenceFactor, PriceAdjustment } from '../types/core';

export interface ConfidenceEngineInput {
  dataQuality: number;
  mlConfidence: number;
  marketDataAvailability: number;
  adjustmentFactors: PriceAdjustment[];
}

export class ConfidenceEngine {
  
  calculateConfidence(input: ConfidenceEngineInput): {
    score: number;
    breakdown: ConfidenceBreakdown;
  } {
    // Individual confidence components
    const dataQuality = this.normalizeScore(input.dataQuality * 100, 0, 100);
    const marketDataAvailability = this.normalizeScore(input.marketDataAvailability * 100, 0, 100);
    const vehicleDataCompleteness = this.calculateVehicleDataCompleteness(input.adjustmentFactors);
    const mlModelConfidence = this.normalizeScore(input.mlConfidence * 100, 0, 100);
    
    // Calculate weighted overall confidence
    const weights = {
      dataQuality: 0.25,
      marketData: 0.30,
      vehicleData: 0.20,
      mlModel: 0.25
    };
    
    const overallConfidence = 
      (dataQuality * weights.dataQuality) +
      (marketDataAvailability * weights.marketData) +
      (vehicleDataCompleteness * weights.vehicleData) +
      (mlModelConfidence * weights.mlModel);

    // Generate confidence factors
    const factors = this.generateConfidenceFactors({
      dataQuality,
      marketDataAvailability,
      vehicleDataCompleteness,
      mlModelConfidence,
      adjustmentFactors: input.adjustmentFactors
    });

    // Generate recommendations
    const recommendations = this.generateRecommendations({
      dataQuality,
      marketDataAvailability,
      vehicleDataCompleteness,
      mlModelConfidence,
      overallConfidence
    });

    const breakdown: ConfidenceBreakdown = {
      dataQuality,
      marketDataAvailability,
      vehicleDataCompleteness,
      mlModelConfidence,
      overallConfidence,
      factors,
      recommendations
    };

    return {
      score: Math.max(10, Math.min(100, overallConfidence)),
      breakdown
    };
  }

  private normalizeScore(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  private calculateVehicleDataCompleteness(adjustments: PriceAdjustment[]): number {
    // Base completeness score
    let completeness = 60; // Base for having basic vehicle info

    // Bonus for each type of adjustment (indicates data availability)
    const adjustmentCategories = new Set(adjustments.map(adj => adj.category));
    
    const categoryBonus = {
      'condition': 10,
      'mileage': 10,
      'market': 8,
      'features': 6,
      'history': 8,
      'location': 4
    };

    for (const category of adjustmentCategories) {
      completeness += categoryBonus[category as keyof typeof categoryBonus] || 2;
    }

    // Bonus for high-confidence adjustments
    const highConfidenceAdjustments = adjustments.filter(adj => adj.confidence > 0.8);
    completeness += highConfidenceAdjustments.length * 2;

    return Math.min(100, completeness);
  }

  private generateConfidenceFactors(input: {
    dataQuality: number;
    marketDataAvailability: number;
    vehicleDataCompleteness: number;
    mlModelConfidence: number;
    adjustmentFactors: PriceAdjustment[];
  }): ConfidenceFactor[] {
    const factors: ConfidenceFactor[] = [];

    // Data Quality Factor
    factors.push({
      factor: 'Data Quality',
      score: input.dataQuality,
      impact: this.getImpactLevel(input.dataQuality),
      description: this.getDataQualityDescription(input.dataQuality)
    });

    // Market Data Factor
    factors.push({
      factor: 'Market Data Availability',
      score: input.marketDataAvailability,
      impact: this.getImpactLevel(input.marketDataAvailability),
      description: this.getMarketDataDescription(input.marketDataAvailability)
    });

    // Vehicle Data Factor
    factors.push({
      factor: 'Vehicle Information Completeness',
      score: input.vehicleDataCompleteness,
      impact: this.getImpactLevel(input.vehicleDataCompleteness),
      description: this.getVehicleDataDescription(input.vehicleDataCompleteness)
    });

    // ML Model Factor
    factors.push({
      factor: 'ML Model Confidence',
      score: input.mlModelConfidence,
      impact: this.getImpactLevel(input.mlModelConfidence),
      description: this.getMLModelDescription(input.mlModelConfidence)
    });

    // Adjustment Quality Factor
    const adjustmentQuality = this.calculateAdjustmentQuality(input.adjustmentFactors);
    factors.push({
      factor: 'Adjustment Accuracy',
      score: adjustmentQuality,
      impact: this.getImpactLevel(adjustmentQuality),
      description: this.getAdjustmentQualityDescription(adjustmentQuality)
    });

    return factors;
  }

  private getImpactLevel(score: number): 'high' | 'medium' | 'low' {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  }

  private getDataQualityDescription(score: number): string {
    if (score >= 90) return 'Excellent data quality with verified sources';
    if (score >= 80) return 'High data quality with reliable sources';
    if (score >= 70) return 'Good data quality with mostly reliable sources';
    if (score >= 60) return 'Moderate data quality with some uncertainty';
    if (score >= 50) return 'Fair data quality with limited verification';
    return 'Poor data quality requiring additional verification';
  }

  private getMarketDataDescription(score: number): string {
    if (score >= 90) return 'Abundant market data from multiple reliable sources';
    if (score >= 80) return 'Good market data coverage with sufficient comparable vehicles';
    if (score >= 70) return 'Adequate market data with some comparable vehicles';
    if (score >= 60) return 'Limited market data with few comparable vehicles';
    if (score >= 50) return 'Sparse market data requiring broader search criteria';
    return 'Insufficient market data for reliable comparison';
  }

  private getVehicleDataDescription(score: number): string {
    if (score >= 90) return 'Comprehensive vehicle information including photos and history';
    if (score >= 80) return 'Detailed vehicle information with good documentation';
    if (score >= 70) return 'Good vehicle information with adequate details';
    if (score >= 60) return 'Basic vehicle information with some missing details';
    if (score >= 50) return 'Limited vehicle information affecting accuracy';
    return 'Insufficient vehicle information for precise valuation';
  }

  private getMLModelDescription(score: number): string {
    if (score >= 90) return 'High ML model confidence with strong feature correlation';
    if (score >= 80) return 'Good ML model confidence with reliable predictions';
    if (score >= 70) return 'Moderate ML model confidence with acceptable accuracy';
    if (score >= 60) return 'Lower ML model confidence due to limited training data';
    if (score >= 50) return 'Reduced ML model confidence requiring manual validation';
    return 'Low ML model confidence, relying on traditional valuation methods';
  }

  private calculateAdjustmentQuality(adjustments: PriceAdjustment[]): number {
    if (adjustments.length === 0) return 50;

    const avgConfidence = adjustments.reduce((sum, adj) => sum + adj.confidence, 0) / adjustments.length;
    
    // Bonus for having multiple adjustment categories
    const categories = new Set(adjustments.map(adj => adj.category));
    const categoryBonus = Math.min(20, categories.size * 4);
    
    return Math.min(100, (avgConfidence * 80) + categoryBonus);
  }

  private getAdjustmentQualityDescription(score: number): string {
    if (score >= 90) return 'High-confidence adjustments with comprehensive factor analysis';
    if (score >= 80) return 'Reliable adjustments with good factor coverage';
    if (score >= 70) return 'Adequate adjustments with standard factor analysis';
    if (score >= 60) return 'Basic adjustments with limited factor analysis';
    if (score >= 50) return 'Minimal adjustments with uncertainty in factors';
    return 'Insufficient adjustment data for reliable valuation';
  }

  private generateRecommendations(input: {
    dataQuality: number;
    marketDataAvailability: number;
    vehicleDataCompleteness: number;
    mlModelConfidence: number;
    overallConfidence: number;
  }): string[] {
    const recommendations: string[] = [];

    // Overall confidence recommendations
    if (input.overallConfidence >= 85) {
      recommendations.push('High confidence valuation - suitable for all purposes');
    } else if (input.overallConfidence >= 70) {
      recommendations.push('Good confidence valuation - suitable for most purposes');
    } else if (input.overallConfidence >= 55) {
      recommendations.push('Moderate confidence - consider additional data sources');
    } else {
      recommendations.push('Low confidence - additional verification strongly recommended');
    }

    // Specific improvement recommendations
    if (input.dataQuality < 70) {
      recommendations.push('Improve data quality by verifying vehicle information');
    }

    if (input.marketDataAvailability < 70) {
      recommendations.push('Expand market search radius to find more comparable vehicles');
    }

    if (input.vehicleDataCompleteness < 70) {
      recommendations.push('Provide additional vehicle details, photos, and service history');
    }

    if (input.mlModelConfidence < 70) {
      recommendations.push('Consider manual validation of ML model predictions');
    }

    // Confidence-specific usage recommendations
    if (input.overallConfidence < 60) {
      recommendations.push('Recommend professional appraisal for important decisions');
      recommendations.push('Use valuation as rough estimate only');
    } else if (input.overallConfidence < 80) {
      recommendations.push('Consider getting second opinion for major transactions');
    }

    return recommendations;
  }

  /**
   * Calculate confidence trend over time
   */
  calculateConfidenceTrend(historicalConfidenceScores: number[]): {
    trend: 'improving' | 'stable' | 'declining';
    changePercent: number;
    recommendation: string;
  } {
    if (historicalConfidenceScores.length < 2) {
      return {
        trend: 'stable',
        changePercent: 0,
        recommendation: 'Insufficient historical data for trend analysis'
      };
    }

    const recent = historicalConfidenceScores.slice(-3);
    const older = historicalConfidenceScores.slice(0, -3);
    
    const recentAvg = recent.reduce((sum, score) => sum + score, 0) / recent.length;
    const olderAvg = older.length > 0 
      ? older.reduce((sum, score) => sum + score, 0) / older.length
      : recentAvg;

    const changePercent = ((recentAvg - olderAvg) / olderAvg) * 100;

    let trend: 'improving' | 'stable' | 'declining';
    let recommendation: string;

    if (changePercent > 5) {
      trend = 'improving';
      recommendation = 'Confidence is improving - data quality is getting better';
    } else if (changePercent < -5) {
      trend = 'declining';
      recommendation = 'Confidence is declining - review data sources and methodology';
    } else {
      trend = 'stable';
      recommendation = 'Confidence is stable - current methodology is consistent';
    }

    return { trend, changePercent, recommendation };
  }
}