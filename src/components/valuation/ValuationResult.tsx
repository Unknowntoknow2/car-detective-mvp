
import React, { useState } from 'react';
import { AIConditionAssessment } from './AIConditionAssessment';
import { useAICondition } from '@/hooks/useAICondition';
import { ChatBubble } from '@/components/chat/ChatBubble';
import { useValuationResult } from '@/hooks/useValuationResult';
import { ValuationResultProps } from '@/types/valuation-result';
import { ValuationHeader } from './result/ValuationHeader';
import { ExplanationSection } from './result/ExplanationSection';
import { ActionButtons } from './result/ActionButtons';
import { ErrorAlert } from './result/ErrorAlert';
import { LoadingState } from './result/LoadingState';
import { useValuationData } from './result/useValuationData';
import { usePdfDownload } from './result/usePdfDownload';
import { useValuationId } from './result/useValuationId';

const ValuationResult: React.FC<ValuationResultProps> = ({
  valuationId,
  make: propMake,
  model: propModel,
  year: propYear,
  mileage: propMileage,
  condition: propCondition,
  location: propLocation,
  valuation: propValuation,
  isManualValuation = false,
}) => {
  // Fallback data if no valuation ID is provided
  const [fallbackData] = useState({
    make: propMake || '',
    model: propModel || '',
    year: propYear || 0,
    mileage: propMileage || 0,
    condition: propCondition || '',
    location: propLocation || '',
    valuation: propValuation || 0
  });
  
  // Get valuation ID (from prop or localStorage)
  const { localValuationId } = useValuationId(valuationId);
  
  // Fetch valuation data from Supabase if valuationId is provided
  const { data: valuationDataResult, isLoading: isLoadingValuation } = 
    useValuationResult(localValuationId || '');
    
  const { conditionData, isLoading: isLoadingCondition } = 
    useAICondition(localValuationId);

  // Use valuation data or fallback to props
  const valuationData = valuationDataResult;
  const make = valuationData?.make || fallbackData.make;
  const model = valuationData?.model || fallbackData.model;
  const year = valuationData?.year || fallbackData.year;
  const mileage = valuationData?.mileage || fallbackData.mileage;
  const condition = valuationData?.condition || fallbackData.condition;
  const location = valuationData?.zipCode || fallbackData.location;
  const valuation = valuationData?.estimatedValue || fallbackData.valuation;

  // Get explanation data
  const { explanation, loading, error, handleRegenerateExplanation } = useValuationData({
    make,
    model,
    year,
    mileage,
    condition,
    location,
    valuation,
  });

  // Set up PDF download
  const { isDownloading, handleDownloadPdf } = usePdfDownload({
    valuationId: localValuationId,
    make,
    model,
    year,
    mileage,
    condition,
    location,
    valuation,
    explanation,
    confidenceScore: valuationDataResult?.confidenceScore,
    conditionData,
    adjustments: valuationDataResult?.adjustments,
  });

  // If we're still loading valuation data and have an ID, show loading state
  if (isLoadingValuation && localValuationId) {
    return <LoadingState />;
  }

  // If we have no data at all, show error
  if (!make || !model || !year || !mileage) {
    return (
      <ErrorAlert 
        title="Missing vehicle information" 
        description="Unable to display valuation result due to missing vehicle information."
      />
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <ValuationHeader
        year={year}
        make={make}
        model={model}
        mileage={mileage}
        condition={condition}
        location={location}
        valuation={valuation}
      />
      
      {/* AI Condition Assessment */}
      {localValuationId && (
        <AIConditionAssessment 
          conditionData={conditionData} 
          isLoading={isLoadingCondition} 
        />
      )}
      
      <ExplanationSection
        explanation={explanation}
        loading={loading}
        error={error}
        onRegenerate={handleRegenerateExplanation}
      />
      
      <ActionButtons
        onDownload={handleDownloadPdf}
        isDownloading={isDownloading}
        disabled={loading || !!error}
        valuationId={localValuationId}
      />

      {/* Add Car Detective Chat Bubble */}
      {localValuationId && (
        <ChatBubble 
          valuationId={localValuationId} 
          initialMessage="Tell me about my car's valuation"
        />
      )}
    </div>
  );
};

export default ValuationResult;
