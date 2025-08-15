import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Camera, TrendingUp, Shield, CheckCircle2 } from 'lucide-react';
import { MissingDataAnalysis, MissingFieldImpact } from '@/utils/valuation/missingFieldAnalyzer';

interface MissingInfoPromptProps {
  analysis: MissingDataAnalysis;
  vehicleInfo?: {
    make?: string;
    model?: string;
    year?: number;
  };
  onCompleteField?: (fieldId: string) => void;
  onCompleteValuation?: () => void;
  className?: string;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'verification':
      return <Camera className="h-4 w-4" />;
    case 'condition':
      return <TrendingUp className="h-4 w-4" />;
    case 'history':
      return <Shield className="h-4 w-4" />;
    case 'legal':
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <CheckCircle2 className="h-4 w-4" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'destructive';
    case 'medium':
      return 'secondary';
    default:
      return 'outline';
  }
};

export const MissingInfoPrompt: React.FC<MissingInfoPromptProps> = ({
  analysis,
  vehicleInfo,
  onCompleteField,
  onCompleteValuation,
  className
}) => {
  const { missingFields, currentAccuracyRange, improvedAccuracyRange, confidenceBoost } = analysis;

  if (missingFields.length === 0) {
    return (
      <Card className={`border-success bg-success/5 ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-success">
            <CheckCircle2 className="h-5 w-5" />
            Valuation Complete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-success-foreground">
            Your valuation data is complete! We have everything needed for maximum accuracy.
          </p>
          {onCompleteValuation && (
            <Button 
              onClick={onCompleteValuation}
              className="mt-4 w-full"
            >
              View Final Valuation
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  const vehicleDescription = vehicleInfo 
    ? `${vehicleInfo.year || ''} ${vehicleInfo.make || ''} ${vehicleInfo.model || ''}`.trim()
    : 'your vehicle';

  const topFields = missingFields.slice(0, 3);

  return (
    <Card className={`border-warning bg-gradient-to-br from-warning/5 to-secondary/5 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            Almost Ready — {topFields.length} Details Needed
          </span>
          <Badge variant="outline" className="text-sm">
            {analysis.completionPercentage}% Complete
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            To provide the most accurate value for your <span className="font-medium">{vehicleDescription}</span> 
            {analysis.isPremiumRequired && ' and unlock premium features like AI photo grading'}, 
            we still need:
          </p>
        </div>

        <div className="space-y-4">
          {topFields.map((field, index) => (
            <div 
              key={field.field}
              className="flex items-start gap-3 p-3 rounded-lg border bg-card/50 hover:bg-card/70 transition-colors"
            >
              <div className="mt-1">
                {getCategoryIcon(field.category)}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm">{field.impactDescription}</p>
                    <p className="text-xs text-muted-foreground">{field.helpText}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={getPriorityColor(field.priority) as any}
                      className="text-xs whitespace-nowrap"
                    >
                      {field.valueImpact}
                    </Badge>
                  </div>
                </div>
                {onCompleteField && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onCompleteField(field.field)}
                    className="text-xs h-7"
                  >
                    Add This Info
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Accuracy Range:</span>
            <div className="flex items-center gap-2">
              <span className="text-warning">{currentAccuracyRange}</span>
              <span className="text-muted-foreground">→</span>
              <span className="text-success font-medium">{improvedAccuracyRange}</span>
            </div>
          </div>
          {confidenceBoost > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              Completing these fields improves accuracy by {Math.round(confidenceBoost)}%
            </p>
          )}
        </div>

        {analysis.isPremiumRequired && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Camera className="h-4 w-4 text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-primary">AI Photo Analysis Available</p>
                <p className="text-xs text-muted-foreground">
                  Upload 3–8 clear photos to enable our industry-leading AI condition scoring
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="pt-2">
          {onCompleteValuation ? (
            <Button 
              onClick={onCompleteValuation}
              className="w-full"
              size="lg"
            >
              Complete My Valuation Now
            </Button>
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              Complete the missing fields above to get your final, defendable valuation
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};