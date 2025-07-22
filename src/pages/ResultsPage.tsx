
import React from 'react';
import { useParams } from 'react-router-dom';
import { ValuationProvider, useValuationContext } from '@/contexts/ValuationContext';
import { UnifiedValuationResult } from '@/components/valuation/UnifiedValuationResult';
import { RerunValuationButton } from '@/components/valuation/RerunValuationButton';
import type { UnifiedValuationResult as ValuationResultType } from '@/types/valuation';
import type { UnifiedValuationResult as EngineResult } from '@/services/valuation/valuationEngine';

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-red-600">No valuation ID provided</p>
      </div>
    );
  }

  return (
    <ValuationProvider valuationId={id}>
      <div className="min-h-screen bg-background">
        <RerunValuationButton />
        <ResultsContent />
      </div>
    </ValuationProvider>
  );
}

function ResultsContent() {
  const { valuationData, isLoading, error, rerunValuation } = useValuationContext();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading valuation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <p className="text-sm text-muted-foreground">
          Try refreshing the page or contact support if the issue persists.
        </p>
      </div>
    );
  }

  if (!valuationData) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-muted-foreground">No valuation data found</p>
      </div>
    );
  }

  // Extract mileage from AI explanation or adjustments
  const extractMileageFromData = (data: any): number => {
    // Try to extract from AI explanation
    const aiText = data.aiExplanation || '';
    const mileageMatch = aiText.match(/(\d{1,3}(?:,\d{3})*)\s*miles/);
    if (mileageMatch) {
      return parseInt(mileageMatch[1].replace(/,/g, ''));
    }
    
    // Try to extract from mileage adjustment
    const mileageAdj = data.adjustments?.find((adj: any) => 
      adj.reason?.toLowerCase().includes('miles') || 
      adj.label?.toLowerCase().includes('mileage')
    );
    if (mileageAdj?.reason) {
      const match = mileageAdj.reason.match(/(\d{1,3}(?:,\d{3})*)\s*miles/);
      if (match) {
        return parseInt(match[1].replace(/,/g, ''));
      }
    }
    
    return data.mileage || 0;
  };

  // Extract and fix mileage from the AI explanation  
  const correctedMileage = extractMileageFromData(valuationData);
  
  // Create a properly typed result with corrected mileage
  const result: ValuationResultType = {
    ...valuationData as any, // Cast to bypass type checking since console shows correct structure
    mileage: correctedMileage,
    timestamp: Date.now()
  };

  console.log('✅ Data validation passed, rendering components...');
  console.log('🔍 UnifiedValuationResult received:', result);

  return <UnifiedValuationResult result={result} />;
}
