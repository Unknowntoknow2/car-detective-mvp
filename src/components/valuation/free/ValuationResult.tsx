
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ManualVehicleInfo } from '@/hooks/useManualValuation';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import ValuationResult from '@/components/valuation/ValuationResult';

interface ValuationResultProps {
  valuationData: ManualVehicleInfo | null;
  valuationId?: string;
}

export function ValuationResult({ valuationData, valuationId }: ValuationResultProps) {
  if (!valuationData) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          No valuation data is available. Please try submitting the form again.
        </AlertDescription>
      </Alert>
    );
  }

  // If we have a valuationId, use the main ValuationResult component
  if (valuationId) {
    return (
      <ValuationResult 
        valuationId={valuationId}
        isManualValuation={true}
      />
    );
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format mileage with commas
  const formatMileage = (mileage: number) => {
    return mileage.toLocaleString();
  };

  // Calculate confidence level description
  const getConfidenceLevel = (score: number = 75) => {
    if (score >= 90) return 'Very High';
    if (score >= 80) return 'High';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Moderate';
    return 'Low';
  };

  // Fall back to the simplified display if no valuationId is provided
  return (
    <Card className="bg-white border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-primary" />
          <CardTitle>Your free valuation is ready</CardTitle>
        </div>
        <CardDescription>
          Based on current market data and vehicle information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground mb-2">Estimated Value</p>
          <p className="text-4xl font-bold text-primary">
            {valuationData.valuation ? formatCurrency(valuationData.valuation) : 'Not Available'}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {valuationData.year} {valuationData.make} {valuationData.model} with {formatMileage(valuationData.mileage)} miles
          </p>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <h3 className="text-sm font-medium mb-3">Vehicle Details</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Make:</p>
              <p className="font-medium">{valuationData.make}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Model:</p>
              <p className="font-medium">{valuationData.model}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Year:</p>
              <p className="font-medium">{valuationData.year}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Mileage:</p>
              <p className="font-medium">{formatMileage(valuationData.mileage)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Condition:</p>
              <p className="font-medium capitalize">{valuationData.condition}</p>
            </div>
            {valuationData.confidenceScore && (
              <div>
                <p className="text-muted-foreground">Confidence:</p>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="font-normal">
                    {getConfidenceLevel(valuationData.confidenceScore)}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            For a detailed analysis with CARFAX® history and more accurate pricing, try our premium valuation.
          </p>
          <Button variant="outline" className="w-full" onClick={() => window.location.href = '/premium'}>
            Get Premium Valuation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
