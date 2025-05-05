
import React from 'react';
import { ConditionBadge } from '@/components/ui/condition-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Camera, CheckCircle, Loader2 } from 'lucide-react';
import { AICondition } from '@/types/photo';

interface AIConditionAssessmentProps {
  conditionData: AICondition | null;
  isLoading: boolean;
}

export function AIConditionAssessment({ conditionData, isLoading }: AIConditionAssessmentProps) {
  if (isLoading) {
    return (
      <Card className="bg-muted/30 border border-muted">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Analyzing vehicle condition...
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Our AI is analyzing your vehicle photos to assess its condition.
        </CardContent>
      </Card>
    );
  }

  if (!conditionData) {
    return null;
  }

  return (
    <Card className="bg-muted/10 border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Camera className="h-4 w-4 text-primary" />
          AI Condition Assessment
          <ConditionBadge 
            condition={conditionData.condition} 
            confidenceScore={conditionData.confidenceScore}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {conditionData.confidenceScore >= 70 ? (
          <>
            <p className="text-sm font-medium mb-2">
              {conditionData.aiSummary || `Your vehicle appears to be in ${conditionData.condition} condition based on the photos provided.`}
            </p>
            
            {conditionData.issuesDetected && conditionData.issuesDetected.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-1">Issues detected:</p>
                <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
                  {conditionData.issuesDetected.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Our AI couldn't verify your vehicle's condition with high confidence. For better results, try uploading clearer photos from multiple angles.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
