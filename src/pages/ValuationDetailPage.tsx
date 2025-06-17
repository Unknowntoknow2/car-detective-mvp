
import React from 'react';
import { useParams } from 'react-router-dom';
import { useValuationResult } from '@/hooks/useValuationResult';
import UnifiedValuationResult from '@/components/valuation/valuation-core/ValuationResult';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

export default function ValuationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { result, isLoading, error } = useValuationResult(id);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 text-center">
          <div className="text-lg font-semibold">Loading valuation details...</div>
        </div>
      </MainLayout>
    );
  }

  if (error || !result) {
    return (
      <MainLayout>
        <Alert variant="destructive" className="mt-8 max-w-xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Valuation</AlertTitle>
          <AlertDescription>
            {error || 'Could not load valuation details. Please try again.'}
          </AlertDescription>
        </Alert>
      </MainLayout>
    );
  }

  const vehicleInfo = {
    make: result.make,
    model: result.model,
    year: result.year,
    mileage: result.mileage || 0,
    condition: result.condition || 'Good',
  };

  const priceRange: [number, number] = result.price_range
    ? Array.isArray(result.price_range)
      ? [result.price_range[0], result.price_range[1]]
      : [result.price_range.low, result.price_range.high]
    : [0, 0];

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Valuation Details</h1>
        
        <UnifiedValuationResult
          displayMode="full"
          vehicleInfo={vehicleInfo}
          estimatedValue={result.estimatedValue}
          confidenceScore={result.confidenceScore}
          priceRange={priceRange}
          adjustments={result.adjustments || []}
        />
      </div>
    </MainLayout>
  );
}
