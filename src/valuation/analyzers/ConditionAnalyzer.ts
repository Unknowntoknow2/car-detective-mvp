/**
 * Condition Analyzer - AI-powered vehicle condition assessment
 */

import { ConditionAnalysisInput, ConditionAnalysisResult, VehiclePhoto, DamageDetection } from '../types/core';

export class ConditionAnalyzer {
  private conditionScoreMap = {
    'excellent': 100,
    'very_good': 85,
    'good': 75,
    'fair': 60,
    'poor': 40
  };

  analyze(input: ConditionAnalysisInput): ConditionAnalysisResult {
    const baseScore = this.conditionScoreMap[input.condition as keyof typeof this.conditionScoreMap] || 75;
    
    let adjustedScore = baseScore;
    let confidence = 0.7;
    const factors: string[] = [`Base condition: ${input.condition}`];
    const recommendations: string[] = [];

    // Photo analysis adjustment
    if (input.photos && input.photos.length > 0) {
      const photoAnalysis = this.analyzePhotos(input.photos);
      adjustedScore = Math.min(adjustedScore, photoAnalysis.score);
      confidence = Math.max(confidence, photoAnalysis.confidence);
      factors.push(...photoAnalysis.factors);
      recommendations.push(...photoAnalysis.recommendations);
    }

    // Service history adjustment
    if (input.serviceHistory && input.serviceHistory.length > 0) {
      const serviceAnalysis = this.analyzeServiceHistory(input.serviceHistory);
      adjustedScore += serviceAnalysis.adjustment;
      factors.push(`Service history: ${serviceAnalysis.description}`);
      if (serviceAnalysis.adjustment > 0) {
        recommendations.push('Well-maintained vehicle with good service records');
      }
    }

    // Accident history adjustment
    if (input.accidentHistory && input.accidentHistory.length > 0) {
      const accidentAnalysis = this.analyzeAccidentHistory(input.accidentHistory);
      adjustedScore -= accidentAnalysis.penalty;
      factors.push(`Accident history: ${accidentAnalysis.description}`);
      recommendations.push('Consider detailed inspection due to accident history');
    }

    // Calculate adjustment factor
    const adjustmentFactor = Math.max(0.4, Math.min(1.2, adjustedScore / 100));

    return {
      score: Math.max(20, Math.min(100, adjustedScore)),
      adjustmentFactor,
      confidence: Math.max(0.5, Math.min(0.95, confidence)),
      factors,
      recommendations
    };
  }

  private analyzePhotos(photos: VehiclePhoto[]): {
    score: number;
    confidence: number;
    factors: string[];
    recommendations: string[];
  } {
    let totalScore = 0;
    let totalConfidence = 0;
    const factors: string[] = [];
    const recommendations: string[] = [];

    for (const photo of photos) {
      if (photo.aiScore) {
        totalScore += photo.aiScore;
        totalConfidence += 0.8; // AI analysis confidence
        
        if (photo.damageDetected && photo.damageDetected.length > 0) {
          const damages = this.categorizeDamage(photo.damageDetected);
          factors.push(`${photo.category}: ${damages.description}`);
          if (damages.severity === 'major') {
            recommendations.push(`Address ${damages.description} in ${photo.category}`);
          }
        } else {
          factors.push(`${photo.category}: No significant damage detected`);
        }
      }
    }

    const avgScore = photos.length > 0 ? totalScore / photos.length : 75;
    const avgConfidence = photos.length > 0 ? totalConfidence / photos.length : 0.5;

    if (photos.length >= 8) {
      recommendations.push('Comprehensive photo documentation available');
    } else {
      recommendations.push('Consider providing more photos for better accuracy');
    }

    return {
      score: avgScore,
      confidence: avgConfidence,
      factors,
      recommendations
    };
  }

  private categorizeDamage(damages: DamageDetection[]): {
    severity: string;
    description: string;
  } {
    const majorDamages = damages.filter(d => d.severity === 'major');
    const moderateDamages = damages.filter(d => d.severity === 'moderate');
    const minorDamages = damages.filter(d => d.severity === 'minor');

    if (majorDamages.length > 0) {
      return {
        severity: 'major',
        description: `Major ${majorDamages.map(d => d.type).join(', ')}`
      };
    } else if (moderateDamages.length > 0) {
      return {
        severity: 'moderate',
        description: `Moderate ${moderateDamages.map(d => d.type).join(', ')}`
      };
    } else {
      return {
        severity: 'minor',
        description: `Minor ${minorDamages.map(d => d.type).join(', ')}`
      };
    }
  }

  private analyzeServiceHistory(serviceHistory: any[]): {
    adjustment: number;
    description: string;
  } {
    const recentServices = serviceHistory.filter(s => {
      const serviceDate = new Date(s.date);
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
      return serviceDate > twoYearsAgo;
    });

    const majorServices = serviceHistory.filter(s => 
      s.serviceType.includes('engine') || 
      s.serviceType.includes('transmission') ||
      s.serviceType.includes('brake')
    );

    let adjustment = 0;
    let description = '';

    if (recentServices.length >= 3) {
      adjustment += 3;
      description += 'Regular recent maintenance';
    }

    if (majorServices.length > 0) {
      adjustment += 2;
      description += description ? ', major services completed' : 'Major services completed';
    }

    const verifiedServices = serviceHistory.filter(s => s.verified);
    if (verifiedServices.length / serviceHistory.length > 0.8) {
      adjustment += 2;
      description += description ? ', verified records' : 'Verified service records';
    }

    return { adjustment, description: description || 'Limited service history' };
  }

  private analyzeAccidentHistory(accidentHistory: any[]): {
    penalty: number;
    description: string;
  } {
    let penalty = 0;
    const descriptions: string[] = [];

    for (const accident of accidentHistory) {
      switch (accident.severity) {
        case 'minor':
          penalty += 2;
          descriptions.push('minor accident');
          break;
        case 'moderate':
          penalty += 5;
          descriptions.push('moderate accident');
          break;
        case 'major':
          penalty += 10;
          descriptions.push('major accident');
          break;
        case 'total_loss':
          penalty += 20;
          descriptions.push('total loss claim');
          break;
      }
    }

    return {
      penalty,
      description: descriptions.join(', ') || 'accident history'
    };
  }
}