
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConditionBadge } from '@/components/ui/condition-badge';
import { Loader2, ShieldCheck, AlertTriangle } from 'lucide-react';

interface AIConditionAssessmentProps {
  conditionData: {
    condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null;
    confidenceScore: number;
    issuesDetected?: string[];
    aiSummary?: string;
  } | null;
  isLoading: boolean;
}

export function AIConditionAssessment({ conditionData, isLoading }: AIConditionAssessmentProps) {
  if (!conditionData && !isLoading) return null;

  return (
    <Card className="mt-4 border border-primary/10">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">AI Condition Assessment</CardTitle>
        </div>
        {!isLoading && conditionData && (
          <ConditionBadge 
            condition={conditionData.condition} 
            confidenceScore={conditionData.confidenceScore}
          />
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4 flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
            <span className="ml-2 text-sm">Analyzing vehicle condition...</span>
          </div>
        ) : conditionData ? (
          <div className="space-y-4">
            <p className="text-sm">{conditionData.aiSummary || `Vehicle appears to be in ${conditionData.condition?.toLowerCase() || 'unknown'} condition.`}</p>
            
            {conditionData.issuesDetected && conditionData.issuesDetected.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <h4 className="text-sm font-medium">Detected Issues</h4>
                </div>
                <ul className="pl-6 space-y-1 text-sm text-slate-600 list-disc">
                  {conditionData.issuesDetected.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-slate-600">AI Trust Score:</span>
                <span className={`text-sm font-medium ${
                  conditionData.confidenceScore >= 90 ? 'text-green-600' :
                  conditionData.confidenceScore >= 80 ? 'text-blue-600' :
                  conditionData.confidenceScore >= 70 ? 'text-amber-600' :
                  'text-red-600'
                }`}>
                  {conditionData.confidenceScore}%
                </span>
              </div>
              
              <div className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600">
                Photo-Based Analysis
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-600 py-2">
            No AI condition assessment available. Upload photos of your vehicle to get an AI-powered condition assessment.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
