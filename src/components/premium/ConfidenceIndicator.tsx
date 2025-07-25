/**
 * Confidence Indicator Component
 * Premium visualization of valuation confidence metrics
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { ConfidenceBreakdown } from '@/valuation/types/core';

interface ConfidenceIndicatorProps {
  score: number;
  breakdown: ConfidenceBreakdown;
}

export function ConfidenceIndicator({ score, breakdown }: ConfidenceIndicatorProps) {
  const confidenceLevel = (() => {
    if (score >= 85) return {
      level: 'High',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: CheckCircle,
      description: 'Suitable for all purposes'
    };
    if (score >= 70) return {
      level: 'Medium',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      icon: AlertTriangle,
      description: 'Good for most purposes'
    };
    return {
      level: 'Low',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: AlertTriangle,
      description: 'Consider additional verification'
    };
  })();

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-4">
      {/* Main Confidence Score */}
      <Card className={`${confidenceLevel.bgColor} ${confidenceLevel.borderColor} border-2`}>
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <confidenceLevel.icon className={`h-8 w-8 ${confidenceLevel.color}`} />
            </div>
            
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {score}%
              </div>
              <Badge className={`${confidenceLevel.color} font-medium`}>
                <Shield className="h-3 w-3 mr-1" />
                {confidenceLevel.level.toUpperCase()} CONFIDENCE
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600">
              {confidenceLevel.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-700">Confidence Factors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Data Quality */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Data Quality</span>
              <span className={`text-sm font-semibold ${getScoreColor(breakdown.dataQuality)}`}>
                {breakdown.dataQuality}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getProgressColor(breakdown.dataQuality)}`}
                style={{ width: `${breakdown.dataQuality}%` }}
              />
            </div>
          </div>

          {/* Market Data Availability */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Market Data</span>
              <span className={`text-sm font-semibold ${getScoreColor(breakdown.marketDataAvailability)}`}>
                {breakdown.marketDataAvailability}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getProgressColor(breakdown.marketDataAvailability)}`}
                style={{ width: `${breakdown.marketDataAvailability}%` }}
              />
            </div>
          </div>

          {/* Vehicle Data Completeness */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Vehicle Info</span>
              <span className={`text-sm font-semibold ${getScoreColor(breakdown.vehicleDataCompleteness)}`}>
                {breakdown.vehicleDataCompleteness}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getProgressColor(breakdown.vehicleDataCompleteness)}`}
                style={{ width: `${breakdown.vehicleDataCompleteness}%` }}
              />
            </div>
          </div>

          {/* ML Model Confidence */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">ML Model</span>
              <span className={`text-sm font-semibold ${getScoreColor(breakdown.mlModelConfidence)}`}>
                {breakdown.mlModelConfidence}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getProgressColor(breakdown.mlModelConfidence)}`}
                style={{ width: `${breakdown.mlModelConfidence}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Factors */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-700">Key Factors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {breakdown.factors.map((factor, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className={`w-2 h-2 rounded-full ${
                  factor.impact === 'high' ? 'bg-green-500' :
                  factor.impact === 'medium' ? 'bg-yellow-500' : 'bg-gray-400'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {factor.factor}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {factor.score}/100
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {factor.description}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recommendations */}
      {breakdown.recommendations.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700">Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {breakdown.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">{recommendation}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}