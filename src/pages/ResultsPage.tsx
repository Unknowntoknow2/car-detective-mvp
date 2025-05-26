
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout';
import { useSearchParams, useParams } from 'react-router-dom';
import { ValuationResultPremium } from '@/components/valuation/result/ValuationResultPremium';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { useValuationResult } from '@/hooks/useValuationResult';
import { ValuationResponse } from '@/types/vehicle';

export default function ResultsPage() {
  const [searchParams] = useSearchParams();
  const { id } = useParams<{ id: string }>();
  
  // Get valuationId from URL params or search params, ensure it's clean
  const rawValuationId = id || searchParams.get('valuationId');
  const valuationId = rawValuationId && rawValuationId !== ':id' && rawValuationId !== '%3Aid' 
    ? decodeURIComponent(rawValuationId) 
    : null;
  
  const [error, setError] = useState<string | null>(null);
  
  console.log('ResultsPage - Route ID:', id);
  console.log('ResultsPage - Search param valuationId:', searchParams.get('valuationId'));
  console.log('ResultsPage - Final cleaned valuationId:', valuationId);
  
  // Fetch valuation data only if we have a valid ID
  const { data, isLoading, error: fetchError } = useValuationResult(valuationId || '');
  
  // Check premium access
  const { hasPremiumAccess } = usePremiumAccess(valuationId || undefined);
  
  const handleUpgrade = () => {
    window.location.href = `/premium?valuationId=${valuationId}`;
  };
  
  useEffect(() => {
    if (!valuationId) {
      setError('No valuation ID or VIN provided in URL.');
    } else if (fetchError) {
      // Properly handle different error types
      let errorMessage = 'Failed to load valuation data';
      if (typeof fetchError === 'string') {
        errorMessage = fetchError;
      } else if (fetchError && typeof fetchError === 'object' && 'message' in fetchError) {
        errorMessage = (fetchError as { message: string }).message;
      }
      setError(errorMessage);
    } else {
      setError(null);
    }
  }, [valuationId, fetchError]);

  // Convert ValuationResult to ValuationResponse
  const convertToValuationResponse = (data: any): ValuationResponse => {
    return {
      make: data.make || '',
      model: data.model || '',
      year: data.year || 0,
      estimatedValue: data.estimatedValue || data.estimated_value || 0,
      confidenceScore: data.confidenceScore || data.confidence_score || 0,
      valuationId: data.valuationId || data.id || '',
      condition: data.condition || 'Unknown',
      mileage: data.mileage || 0,
      vin: data.vin || '',
      zipCode: data.zipCode || data.zip_code || '',
      fuelType: data.fuelType || data.fuel_type || '',
      transmission: data.transmission || '',
      bodyType: data.bodyType || data.body_type || '',
      color: data.color || '',
      trim: data.trim || '',
      price_range: data.price_range || {
        low: Math.round((data.estimatedValue || 0) * 0.95),
        high: Math.round((data.estimatedValue || 0) * 1.05)
      },
      isPremium: hasPremiumAccess,
      aiCondition: data.aiCondition || {
        condition: data.condition || 'Unknown',
        confidenceScore: data.confidenceScore || 75,
        issuesDetected: []
      },
      userId: data.userId || ''
    };
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <main className="py-8">
          <div className="container mx-auto px-4 flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading valuation results...</p>
            </div>
          </div>
        </main>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <main className="py-8">
        {error ? (
          <div className="container mx-auto px-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        ) : data ? (
          <div className="container mx-auto px-4">
            <ValuationResultPremium
              valuationId={valuationId || undefined}
              data={convertToValuationResponse(data)}
              isPremium={hasPremiumAccess}
              onUpgrade={handleUpgrade}
            />
          </div>
        ) : (
          <div className="container mx-auto px-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Data Found</AlertTitle>
              <AlertDescription>The valuation data could not be found.</AlertDescription>
            </Alert>
          </div>
        )}
      </main>
    </MainLayout>
  );
}
