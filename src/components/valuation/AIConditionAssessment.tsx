
import React from 'react';
import { ConditionBadge } from '@/components/ui/condition-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Camera, CheckCircle, Loader2, RefreshCw } from 'lucide-react';
import { AICondition } from '@/types/photo';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AIConditionAssessmentProps {
  conditionData: AICondition | null;
  isLoading: boolean;
  onRetry?: () => void;
  error?: string | null;
}

export function AIConditionAssessment({ 
  conditionData, 
  isLoading, 
  onRetry,
  error
}: AIConditionAssessmentProps) {
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
          <div className="space-y-2">
            <p>Our AI is analyzing your vehicle photos to assess its condition.</p>
            <div className="h-2 w-full bg-muted rounded overflow-hidden">
              <div className="h-full bg-primary/40 animate-pulse"></div>
            </div>
            <p className="text-xs">This may take up to 30 seconds.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50/30 border border-red-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            Analysis Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-700 mb-2">{error}</p>
          {onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="mt-2 flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              Retry Analysis
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!conditionData) {
    return null;
  }

  const handleCopyDetails = () => {
    if (!conditionData) return;
    
    const detailsText = `
      Condition: ${conditionData.condition}
      Confidence Score: ${conditionData.confidenceScore}%
      Summary: ${conditionData.aiSummary}
      Issues: ${conditionData.issuesDetected?.join(', ') || 'None detected'}
    `;
    
    navigator.clipboard.writeText(detailsText.trim());
    toast.success("Condition details copied to clipboard");
  };

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
          
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto h-6 w-6 p-0"
            onClick={handleCopyDetails}
            title="Copy condition details"
          >
            <span className="sr-only">Copy details</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3 w-3"
            >
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg>
          </Button>
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
            
            <div className="mt-3 flex items-center text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
              AI Trust Score: <span className="font-medium ml-1">{conditionData.confidenceScore}%</span>
            </div>
          </>
        ) : (
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Our AI couldn't verify your vehicle's condition with high confidence. For better results, try uploading clearer photos from multiple angles.
              </p>
              
              <div className="flex items-center text-xs text-muted-foreground">
                AI Trust Score: <span className="font-medium ml-1">{conditionData.confidenceScore}%</span>
                <span className="text-amber-500 ml-2">(Low confidence)</span>
              </div>
              
              {onRetry && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onRetry}
                  className="mt-1"
                >
                  Upload Better Photos
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
