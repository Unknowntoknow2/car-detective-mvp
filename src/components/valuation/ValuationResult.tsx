
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ValuationContext } from './context/ValuationContext';
import ValuationResultLayout from './ValuationResultLayout';
import { LoadingState, ErrorState } from './index';
import { useValuationData } from './hooks/useValuationData';
import { ReportData } from '@/utils/pdf/types';
import { ValuationResultProps } from './types';

export function ValuationResult({ valuationId, isManualValuation, manualValuationData }: ValuationResultProps) {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const valuationIdFromParams = id || searchParams.get('valuationId') || valuationId || '';
  const { valuationData, isLoading, error } = useValuationData(valuationIdFromParams);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (valuationData) {
      setIsPremium(valuationData.isPremium || false);
    }
  }, [valuationData]);

  const handleUpgrade = () => {
    console.log('Upgrade clicked');
    window.location.href = '/premium';
  };

  const reportData: ReportData = {
    make: valuationData?.make || 'Unknown',
    model: valuationData?.model || 'Vehicle',
    year: valuationData?.year || 2020,
    mileage: valuationData?.mileage || 0,
    condition: valuationData?.condition || 'Good',
    estimatedValue: valuationData?.estimatedValue || 0,
    confidenceScore: valuationData?.confidenceScore || 85,
    zipCode: valuationData?.zipCode || '',
    adjustments: [],
    generatedAt: new Date().toISOString(),
    vin: valuationData?.vin,
    aiCondition: {
      condition: valuationData?.condition || 'Good',
      confidenceScore: valuationData?.confidenceScore || 85,
      issuesDetected: [],
      summary: 'Vehicle condition assessment based on provided information.'
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error.toString()} />;
  }

  return (
    <ValuationContext.Provider
      value={{
        valuationData,
        isPremium,
        isLoading,
        error,
        estimatedValue: valuationData?.estimatedValue || 0,
        onUpgrade: handleUpgrade,
        isDownloading: false,
        isEmailSending: false,
        onDownloadPdf: async () => { console.log('Download PDF clicked'); },
        onEmailPdf: async () => { console.log('Email PDF clicked'); }
      }}
    >
      <ValuationResultLayout />
    </ValuationContext.Provider>
  );
}

export default ValuationResult;
