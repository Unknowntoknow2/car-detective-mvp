
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AICondition } from '@/types/photo';
import { AIConditionBadge } from './AIConditionBadge';

interface Adjustment {
  name: string;
  value: number;
  description?: string;
  percentAdjustment: number;
}

interface ValuationAuditData {
  basePrice: number;
  adjustments: Adjustment[];
  totalAdjustment: number;
  estimatedValue: number;
  timestamp: string;
  inputData: {
    year: number;
    make: string;
    model: string;
    mileage: number;
    condition: string;
  };
}

interface ValuationAuditTrailProps {
  auditTrail: ValuationAuditData;
  photoUrl?: string;
  aiCondition?: AICondition | null;
}

export function ValuationAuditTrail({ auditTrail, photoUrl, aiCondition }: ValuationAuditTrailProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  return (
    <Card className="bg-muted/10">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Valuation Breakdown</CardTitle>
          <div className="flex items-center gap-2">
            {aiCondition && (
              <AIConditionBadge
                condition={aiCondition.condition}
                confidenceScore={aiCondition.confidenceScore}
              />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-start">
          {photoUrl && (
            <div className="md:col-span-2">
              <div className="rounded-md overflow-hidden bg-muted/20 border">
                <img 
                  src={photoUrl} 
                  alt="Vehicle photo" 
                  className="w-full h-auto object-cover aspect-video"
                />
              </div>
              {aiCondition && aiCondition.issuesDetected && aiCondition.issuesDetected.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Issues detected:</p>
                  <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-0.5">
                    {aiCondition.issuesDetected.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          <div className={`space-y-4 ${photoUrl ? 'md:col-span-5' : 'md:col-span-7'}`}>
            <div>
              <p className="text-sm font-medium mb-1">Base Value</p>
              <p className="text-xl font-bold">{formatCurrency(auditTrail.basePrice)}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Adjustments</p>
              <ul className="space-y-2">
                {auditTrail.adjustments.map((adjustment, index) => (
                  <li key={index} className="grid grid-cols-2 text-sm border-b border-muted pb-2">
                    <div>
                      <p className="font-medium">{adjustment.name}</p>
                      <p className="text-xs text-muted-foreground">{adjustment.description}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${adjustment.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(adjustment.value)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatPercentage(adjustment.percentAdjustment)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="pt-2 border-t border-muted">
              <div className="grid grid-cols-2 text-sm">
                <p className="font-medium">Total Adjustments</p>
                <p className={`font-medium text-right ${auditTrail.totalAdjustment >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(auditTrail.totalAdjustment)}
                </p>
              </div>
            </div>
            
            <div className="pt-2 border-t border-muted">
              <div className="grid grid-cols-2 text-base">
                <p className="font-bold">Final Valuation</p>
                <p className="font-bold text-right text-primary">
                  {formatCurrency(auditTrail.estimatedValue)}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Based on data from {new Date(auditTrail.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
