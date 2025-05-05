
import React from 'react';
import { AIConditionResult } from '@/utils/getConditionAnalysis';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface AIConditionAssessmentProps {
  conditionData: AIConditionResult | null;
  isLoading: boolean;
}

export function AIConditionAssessment({ conditionData, isLoading }: AIConditionAssessmentProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg my-4">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400 mr-2" />
        <p className="text-sm text-gray-500">Analyzing condition with AI...</p>
      </div>
    );
  }

  if (!conditionData) {
    return null; // Don't show anything if there's no data
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent': return 'bg-green-50 text-green-600 border-green-200';
      case 'Good': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'Fair': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'Poor': return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <Card className="my-4 border border-blue-100 bg-blue-50/30">
      <CardContent className="pt-6">
        <div className="flex items-start gap-2">
          <div className="bg-blue-100 p-2 rounded-full">
            {conditionData.confidenceScore > 70 ? (
              <Shield className="h-5 w-5 text-blue-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-800">AI Condition Assessment</h3>
            <div className="flex items-center mt-2 gap-2">
              <Badge 
                variant="outline" 
                className={`${getConditionColor(conditionData.condition)} font-medium`}
              >
                {conditionData.condition}
              </Badge>
              <span className="text-xs text-gray-500">
                {conditionData.confidenceScore}% confidence
              </span>
            </div>
            
            {conditionData.issuesDetected.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-medium text-gray-700 mb-1">Issues detected:</p>
                <ul className="text-xs text-gray-600 list-disc pl-5 space-y-1">
                  {conditionData.issuesDetected.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {conditionData.aiSummary && (
              <p className="text-xs text-gray-600 mt-2">
                {conditionData.aiSummary}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
