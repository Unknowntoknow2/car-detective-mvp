
import React, { useState, useEffect } from 'react';
import { useValuationResult } from '@/hooks/useValuationResult';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAICondition } from '@/hooks/useAICondition';
import { useValuationId } from './result/useValuationId';
import { LoadingState } from './result/LoadingState';
import { ErrorAlert } from './result/ErrorAlert';
import { ValuationData } from './result/ValuationData';
import { DownloadSection } from './result/DownloadSection';
import { useValuationPdf } from './result/useValuationPdf';

interface PredictionResultProps {
  valuationId: string;
  manualValuation?: {
    make: string;
    model: string;
    year: number;
    mileage: number;
    condition?: string;
    zipCode?: string;
    valuation?: number;
  };
}

export function PredictionResult({ valuationId, manualValuation }: PredictionResultProps) {
  const [retryCount, setRetryCount] = useState(0);
  
  // Get valuation ID (from prop or localStorage)
  const { localValuationId } = useValuationId(valuationId);

  const { 
    data, 
    isLoading, 
    error, 
    isError,
    refetch 
  } = useValuationResult(localValuationId || '');
  
  const { 
    conditionData, 
    isLoading: isLoadingCondition 
  } = useAICondition(localValuationId);

  // Force a retry if there was a Supabase error
  useEffect(() => {
    if (error && retryCount < 3 && !manualValuation) {
      const timer = setTimeout(() => {
        console.log(`Retrying valuation fetch (attempt ${retryCount + 1}/3)...`);
        refetch();
        setRetryCount(prev => prev + 1);
      }, 1000 * (retryCount + 1)); // Exponential backoff
      
      return () => clearTimeout(timer);
    }
  }, [error, retryCount, refetch, manualValuation]);

  // Apply AI condition override if it exists and has high confidence
  const getValuationWithAIOverride = () => {
    if (!data) return null;
    
    // Create a copy of the data
    const valuationWithOverride = { ...data };
    
    // Apply AI condition override if available and confidence score is high enough
    if (conditionData && conditionData.confidenceScore >= 70) {
      valuationWithOverride.condition = conditionData.condition;
      
      // For TypeScript, we need to handle the aiCondition property safely
      if ('aiCondition' in valuationWithOverride) {
        valuationWithOverride.aiCondition = conditionData;
      } else {
        // Add the property if it doesn't exist
        (valuationWithOverride as any).aiCondition = conditionData;
      }
    }
    
    return valuationWithOverride;
  };

  // Handle manual valuation data if provided and no database data was found
  const valuationData = getValuationWithAIOverride() || (manualValuation && error ? {
    id: 'manual-' + Date.now(),
    make: manualValuation.make,
    model: manualValuation.model,
    year: manualValuation.year,
    mileage: manualValuation.mileage,
    condition: manualValuation.condition || 'Good',
    zipCode: manualValuation.zipCode || '',
    estimatedValue: manualValuation.valuation || 20000,
    confidenceScore: 75,
    priceRange: [
      manualValuation.valuation ? Math.round(manualValuation.valuation * 0.95) : 19000,
      manualValuation.valuation ? Math.round(manualValuation.valuation * 1.05) : 21000
    ] as [number, number],
    adjustments: [
      { 
        factor: 'Base Condition', 
        impact: 0, 
        description: 'Baseline vehicle value' 
      },
      { 
        factor: 'Market Demand', 
        impact: 1.5, 
        description: 'Current market conditions' 
      }
    ],
    createdAt: new Date().toISOString()
  } : null);

  // Setup PDF download functionality
  const { isDownloading, handleDownloadPdf } = useValuationPdf({
    valuationData,
    conditionData
  });

  // Show loading state during initial data fetch
  if (isLoading && !manualValuation) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error state if fetch failed and no manual data is available
  if ((error && !valuationData) || (isError && !valuationData)) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>{error?.message || "Failed to load valuation data"}</p>
          <div className="mt-2">
            <button 
              onClick={() => refetch()} 
              className="px-3 py-1 text-sm bg-white text-red-600 border border-red-600 rounded hover:bg-red-50"
            >
              {retryCount >= 3 ? "Try Again" : <div className="flex items-center"><Loader2 className="h-3 w-3 mr-2 animate-spin" /> Retrying...</div>}
            </button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (!valuationData) {
    return (
      <ErrorAlert 
        title="No Valuation Data" 
        description="We couldn't find valuation data for this vehicle. Please try again with different information."
      />
    );
  }

  // Ensure priceRange is a tuple with exactly two elements
  const priceRange: [number, number] = valuationData.priceRange && valuationData.priceRange.length >= 2 
    ? [valuationData.priceRange[0], valuationData.priceRange[1]] 
    : [
        Math.round(valuationData.estimatedValue * 0.95),
        Math.round(valuationData.estimatedValue * 1.05)
      ];

  // Determine if the AI condition was used
  const hasAiCondition = conditionData || ('aiCondition' in valuationData);
  const isAIVerified = !!(hasAiCondition && 
    ((conditionData?.confidenceScore >= 70) || 
     ('aiCondition' in valuationData && 
      valuationData.aiCondition && 
      'confidenceScore' in valuationData.aiCondition && 
      valuationData.aiCondition.confidenceScore >= 70)));

  return (
    <div className="space-y-6">
      <ValuationData
        estimatedValue={valuationData.estimatedValue}
        confidenceScore={valuationData.confidenceScore || 75}
        priceRange={priceRange}
        adjustments={valuationData.adjustments}
        isAIVerified={isAIVerified}
        conditionData={conditionData || ('aiCondition' in valuationData ? valuationData.aiCondition : null)}
      />
      
      <DownloadSection 
        valuationId={localValuationId || ''}
        onDownload={handleDownloadPdf}
        isDownloading={isDownloading}
      />
    </div>
  );
}
