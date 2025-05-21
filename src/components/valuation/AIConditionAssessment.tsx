import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AICondition } from '@/types/photo';
import { Camera, AlertCircle, Award, CheckSquare, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface AIConditionAssessmentProps {
  conditionData: AICondition | null;
  isLoading: boolean;
  bestPhotoUrl?: string;
}

export function AIConditionAssessment({ 
  conditionData, 
  isLoading,
  bestPhotoUrl 
}: AIConditionAssessmentProps) {
  if (isLoading) {
    return (
      <Card className="mt-6 mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Camera className="h-5 w-5" />
            AI Condition Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-8">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Analyzing vehicle condition...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!conditionData || !conditionData.condition) {
    return (
      <Card className="mt-6 mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Camera className="h-5 w-5" />
            AI Condition Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center text-center py-4">
            <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="font-medium">No photo analysis available</p>
            <p className="text-sm text-muted-foreground mt-1">
              Upload photos of your vehicle to get an AI-powered condition assessment.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Map condition to color
  const getConditionColor = (condition: string | null) => {
    switch (condition) {
      case 'Excellent': return 'text-green-600';
      case 'Good': return 'text-blue-600';
      case 'Fair': return 'text-amber-600';
      case 'Poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };
  
  // Map confidence score to description
  const getConfidenceDescription = (score: number) => {
    if (score >= 90) return 'Very High';
    if (score >= 75) return 'High';
    if (score >= 60) return 'Moderate';
    return 'Low';
  };
  
  // Helper to get summary, check both properties for backward compatibility
  const getSummary = (data: AICondition) => {
    return data.summary || '';
  };
  
  return (
    <Card className="mt-6 mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Camera className="h-5 w-5" />
          AI Condition Assessment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Best photo display */}
          {bestPhotoUrl && (
            <div className="lg:col-span-1 relative">
              <div className="aspect-square rounded-md overflow-hidden border border-border">
                <img 
                  src={bestPhotoUrl} 
                  alt="Vehicle condition" 
                  className="w-full h-full object-cover"
                />
              </div>
              <Badge className="absolute top-2 right-2 bg-primary">
                Best Photo
              </Badge>
            </div>
          )}
          
          {/* Condition assessment */}
          <div className={`lg:col-span-${bestPhotoUrl ? '2' : '3'}`}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-lg">
                  <span className={getConditionColor(conditionData.condition)}>
                    {conditionData.condition || 'Unknown'} Condition
                  </span>
                </h3>
                <p className="text-sm text-muted-foreground">
                  Based on AI analysis of your vehicle photos
                </p>
              </div>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">
                        {getConfidenceDescription(conditionData.confidenceScore)}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Confidence score: {conditionData.confidenceScore}%
                      <br />
                      Higher confidence means more reliable assessment
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {/* Progress bar */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Poor</span>
                <span className="text-xs text-muted-foreground">Excellent</span>
              </div>
              <Progress 
                value={conditionData.confidenceScore} 
                className="h-2"
              />
            </div>
            
            {/* AI Summary */}
            {getSummary(conditionData) && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-1">AI Assessment:</h4>
                <p className="text-sm text-muted-foreground">{getSummary(conditionData)}</p>
              </div>
            )}
            
            {/* Issues detected */}
            {conditionData.issuesDetected && conditionData.issuesDetected.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-1">Issues Detected:</h4>
                <ul className="space-y-1">
                  {conditionData.issuesDetected.map((issue, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
