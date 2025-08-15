import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, CheckCircle2 } from 'lucide-react';
import { MissingDataAnalysis } from '@/utils/valuation/missingFieldAnalyzer';

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

const getFieldDisplayName = (fieldId: string) => {
  const names: Record<string, string> = {
    mileage: 'Current Mileage',
    accidents: 'Accident History Confirmation', 
    photos: 'Exterior Photos',
    condition: 'Overall Condition Rating',
    zip_code: 'ZIP Code Location',
    title_status: 'Title Status',
    serviceHistory: 'Service Records',
    modifications: 'Modifications Status',
    tire_condition: 'Tire Condition',
    exterior_condition: 'Exterior Condition',
    interior_condition: 'Interior Condition'
  };
  return names[fieldId] || fieldId;
};

const getFieldExplanation = (fieldId: string) => {
  const explanations: Record<string, string> = {
    mileage: 'Mileage is one of the top 3 factors in market value; can shift price by thousands.',
    accidents: 'This lets us adjust your value based on verified damage records.',
    photos: 'Our AI can detect wear, scratches, and dents to improve accuracy.',
    condition: 'Overall condition directly affects market positioning and buyer appeal.',
    zip_code: 'Local market conditions vary significantly by region and affect pricing.',
    title_status: 'Title issues can severely impact marketability and resale value.',
    serviceHistory: 'Well-documented maintenance records increase buyer confidence and value.',
    modifications: 'Aftermarket changes can increase or decrease value depending on quality.',
    tire_condition: 'Tire replacement costs are immediate buyer expenses that affect negotiation.',
    exterior_condition: 'Exterior appearance affects first impressions and resale value.',
    interior_condition: 'Interior wear reflects vehicle care and influences buyer decisions.'
  };
  return explanations[fieldId] || 'This information helps improve valuation accuracy.';
};

export const MissingInfoPrompt: React.FC<MissingInfoPromptProps> = ({
  analysis,
  vehicleInfo,
  onCompleteField,
  onCompleteValuation,
  className
}) => {
  const { missingFields, currentAccuracyRange, improvedAccuracyRange } = analysis;

  if (missingFields.length === 0) {
    return (
      <Card className={`border-success bg-success/5 ${className}`}>
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <CheckCircle2 className="h-8 w-8 text-success mx-auto" />
            <div>
              <p className="font-semibold text-success">Valuation Complete</p>
              <p className="text-sm text-success/80">
                Your valuation data is complete! We have everything needed for maximum accuracy.
              </p>
            </div>
            {onCompleteValuation && (
              <Button 
                onClick={onCompleteValuation}
                className="mt-4"
                size="lg"
              >
                View Final Valuation
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const topFields = missingFields.slice(0, 3);
  const hasCarfaxIntegration = missingFields.some(f => ['accidents', 'title_status', 'serviceHistory'].includes(f.field));

  return (
    <Card className={className}>
      <CardContent className="pt-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">
            We're almost ready — just a few details left to finalize your valuation.
          </h3>
          <p className="text-muted-foreground">
            To provide the most accurate value{hasCarfaxIntegration && ' (and unlock Carfax/AutoCheck integration)'}, we still need:
          </p>
        </div>

        <div className="space-y-4">
          {topFields.map((field, index) => (
            <div key={field.field} className="space-y-1">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    <span className="text-primary">{getFieldDisplayName(field.field)}</span> — {getFieldExplanation(field.field)}
                  </p>
                </div>
                {onCompleteField && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onCompleteField(field.field)}
                    className="ml-3 text-xs shrink-0"
                  >
                    Add Info
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm font-medium">
            Completing these fields can reduce your valuation range from <span className="text-warning">{currentAccuracyRange}</span> to <span className="text-success">{improvedAccuracyRange}</span>.
          </p>
        </div>

        {analysis.isPremiumRequired && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Camera className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-primary text-sm">
                  <strong>Tip:</strong> Uploading 3–8 clear photos enables our AI condition scoring for unmatched accuracy.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="pt-2">
          <Button 
            onClick={onCompleteValuation}
            className="w-full"
            size="lg"
          >
            Complete My Valuation Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};