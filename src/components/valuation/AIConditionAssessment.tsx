
import React from 'react';
import { AlertTriangle, Check, Info } from 'lucide-react';
import { AIConditionResult } from '@/utils/getConditionAnalysis';

interface AIConditionAssessmentProps {
  conditionData: AIConditionResult;
  isLoading?: boolean;
}

export function AIConditionAssessment({ conditionData, isLoading = false }: AIConditionAssessmentProps) {
  if (isLoading) {
    return (
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg animate-pulse">
        <p className="text-gray-500">Loading AI Condition...</p>
      </div>
    );
  }

  if (!conditionData) {
    return null;
  }

  const { condition, confidenceScore, issuesDetected, aiSummary } = conditionData;
  const isHighConfidence = confidenceScore >= 70;

  return (
    <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <Info className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-800">AI Condition Assessment</h3>
        <span className="text-sm text-gray-500">Verified from Uploaded Photos</span>
      </div>
      
      <div className="flex items-center mb-2">
        {isHighConfidence ? (
          <div className="flex items-center px-2 py-1 bg-green-50 text-green-700 rounded-full text-sm mr-2">
            <Check className="w-4 h-4 mr-1" />
            AI Verified Condition
          </div>
        ) : (
          <div className="flex items-center px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-sm mr-2">
            <AlertTriangle className="w-4 h-4 mr-1" />
            Low Confidence Assessment
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">Condition:</p>
          <p className="text-base font-semibold">{condition} (AI)</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">Confidence:</p>
          <p className="text-base font-semibold">{confidenceScore}%</p>
        </div>
      </div>
      
      {issuesDetected && issuesDetected.length > 0 && (
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-600 mb-1">Issues Detected:</p>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {issuesDetected.map((issue, index) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
        </div>
      )}
      
      {aiSummary && (
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">Summary:</p>
          <p className="text-sm text-gray-700">{aiSummary}</p>
        </div>
      )}
    </div>
  );
}
