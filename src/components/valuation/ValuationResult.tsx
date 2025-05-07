
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { AICondition } from '@/types/photo';

interface ValuationResultProps {
  estimatedValue: number;
  confidenceScore: number;
  carDetails: {
    year: number;
    make: string;
    model: string;
    trim?: string;
    mileage: number;
    condition: string;
    location: string;
  };
  conditionData?: AICondition | null;
  isPremium?: boolean;
}

export function ValuationResult({
  estimatedValue,
  confidenceScore,
  carDetails,
  conditionData,
  isPremium = false
}: ValuationResultProps) {
  // Format the estimated value for display
  const formattedValue = formatCurrency(estimatedValue);
  
  // Calculate confidence score color and label
  const getConfidenceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-green-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-500';
  };
  
  const getConfidenceLabel = (score: number) => {
    if (score >= 90) return 'Very High';
    if (score >= 70) return 'High';
    if (score >= 50) return 'Moderate';
    return 'Low';
  };
  
  // Filter out AI detected issues if available
  const detectedIssues = conditionData?.issuesDetected?.filter(Boolean) || [];
  
  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-white to-primary/5 border-b">
        <div className="flex flex-col sm:flex-row justify-between">
          <div>
            <h4 className="text-sm font-medium text-primary/80">Estimated Value</h4>
            <CardTitle className="text-3xl font-bold text-primary">
              {formattedValue}
            </CardTitle>
          </div>
          
          <div className="mt-4 sm:mt-0 sm:text-right">
            <h4 className="text-sm font-medium text-primary/80">Confidence</h4>
            <CardTitle className={`text-xl ${getConfidenceColor(confidenceScore)}`}>
              {getConfidenceLabel(confidenceScore)} ({confidenceScore}%)
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Vehicle Details</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4">
              <div>
                <p className="text-sm text-slate-500">Year</p>
                <p className="font-medium">{carDetails.year}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Make</p>
                <p className="font-medium">{carDetails.make}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Model</p>
                <p className="font-medium">{carDetails.model}</p>
              </div>
              {carDetails.trim && (
                <div>
                  <p className="text-sm text-slate-500">Trim</p>
                  <p className="font-medium">{carDetails.trim}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-slate-500">Mileage</p>
                <p className="font-medium">{carDetails.mileage.toLocaleString()} miles</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Condition</p>
                <p className="font-medium">{carDetails.condition}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Location</p>
                <p className="font-medium">{carDetails.location}</p>
              </div>
            </div>
          </div>
          
          {conditionData && (
            <div>
              <h3 className="text-lg font-semibold mb-3">AI Condition Assessment</h3>
              <div className="p-4 bg-muted rounded-md">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium">Assessed Condition:</p>
                  <p>{conditionData.condition || 'Not assessed'}</p>
                </div>
                
                {detectedIssues.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium mb-2">Issues Detected:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {detectedIssues.map((issue, index) => (
                        <li key={index} className="text-sm">{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {conditionData.aiSummary && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <p className="font-medium mb-1">AI Summary:</p>
                    <p className="text-sm text-slate-700">{conditionData.aiSummary}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {isPremium && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Premium Valuation</h3>
              <p className="text-sm text-blue-700">
                This is a premium valuation report with enhanced data accuracy and additional market insights.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
