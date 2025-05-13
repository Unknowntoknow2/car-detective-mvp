
import React, { useState, useEffect } from 'react';
import { AIConditionAssessment } from './AIConditionAssessment';
import { UnifiedValuationHeader } from './header';
import { ValuationResults } from './ValuationResults';
import { ExplanationSection } from './result/ExplanationSection';
import { useValuationData } from './result/useValuationData';
import { useAICondition } from '@/hooks/useAICondition';
import { Card, CardContent } from '@/components/ui/card';
import { getConditionValueImpact } from '@/utils/valuation/conditionHelpers';
import { generateValuationExplanation } from '@/utils/generateValuationExplanation';

export interface VehicleInfoProps {
  make: string;
  model: string;
  year: number;
  mileage?: number;
  condition?: string;
  trim?: string;
  vin?: string;
}

interface UnifiedValuationResultProps {
  valuationId: string;
  displayMode?: 'compact' | 'full';
  vehicleInfo: VehicleInfoProps;
  estimatedValue: number;
  confidenceScore?: number;
  priceRange?: [number, number];
  adjustments?: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
  onDownloadPdf?: () => Promise<void> | void;
  onEmailReport?: () => Promise<void> | void;
}

export function UnifiedValuationResult({
  valuationId,
  displayMode = 'full',
  vehicleInfo,
  estimatedValue,
  confidenceScore = 75,
  priceRange: propsPriceRange,
  adjustments = [],
  onDownloadPdf,
  onEmailReport
}: UnifiedValuationResultProps) {
  const { conditionData, isLoading: isLoadingCondition } = useAICondition(valuationId);
  const [explanation, setExplanation] = useState<string>('');
  const [isLoadingExplanation, setIsLoadingExplanation] = useState<boolean>(false);
  const [explanationError, setExplanationError] = useState<string>('');
  
  // Calculate price range if not provided
  const priceRange: [number, number] = propsPriceRange || [
    Math.round(estimatedValue * 0.95),
    Math.round(estimatedValue * 1.05)
  ];
  
  // Add condition adjustment if not already in the adjustments array
  useEffect(() => {
    if (vehicleInfo.condition && !adjustments.some(adj => adj.factor === 'Condition')) {
      const conditionImpact = getConditionValueImpact(vehicleInfo.condition);
      adjustments.push({
        factor: 'Condition',
        impact: conditionImpact,
        description: `${vehicleInfo.condition} condition`
      });
    }
  }, [vehicleInfo.condition, adjustments]);
  
  // Fetch explanation on initial load
  useEffect(() => {
    const fetchExplanation = async () => {
      if (!vehicleInfo.make || !vehicleInfo.model) return;
      
      setIsLoadingExplanation(true);
      setExplanationError('');
      try {
        const result = await generateValuationExplanation({
          make: vehicleInfo.make,
          model: vehicleInfo.model,
          year: vehicleInfo.year,
          mileage: vehicleInfo.mileage || 0,
          condition: vehicleInfo.condition || 'Good',
          location: 'your area',
          valuation: estimatedValue,
        });
        setExplanation(result);
      } catch (e: any) {
        console.error(e);
        setExplanationError('Failed to load explanation.');
      } finally {
        setIsLoadingExplanation(false);
      }
    };
    
    fetchExplanation();
  }, [vehicleInfo, estimatedValue]);
  
  const handleRegenerateExplanation = async () => {
    setIsLoadingExplanation(true);
    setExplanationError('');
    try {
      const result = await generateValuationExplanation({
        make: vehicleInfo.make,
        model: vehicleInfo.model,
        year: vehicleInfo.year,
        mileage: vehicleInfo.mileage || 0,
        condition: vehicleInfo.condition || 'Good',
        location: 'your area',
        valuation: estimatedValue,
      });
      setExplanation(result);
    } catch (e: any) {
      console.error(e);
      setExplanationError('Failed to regenerate explanation.');
    } finally {
      setIsLoadingExplanation(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <UnifiedValuationHeader
        vehicleInfo={vehicleInfo}
        estimatedValue={estimatedValue}
        confidenceScore={confidenceScore}
        photoCondition={conditionData}
        isPremium={displayMode === 'full'}
      />
      
      {displayMode === 'full' && (
        <>
          <AIConditionAssessment
            conditionData={conditionData}
            isLoading={isLoadingCondition}
            bestPhotoUrl={conditionData?.photoUrl}
          />
          
          <ValuationResults
            estimatedValue={estimatedValue}
            confidenceScore={confidenceScore}
            adjustments={adjustments}
            priceRange={priceRange}
            vehicleInfo={vehicleInfo}
            valuationId={valuationId}
            onEmailReport={onEmailReport}
          />
          
          <ExplanationSection
            explanation={explanation}
            loading={isLoadingExplanation}
            error={explanationError}
            onRegenerate={handleRegenerateExplanation}
          />
        </>
      )}
      
      {displayMode === 'compact' && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              View the full report for detailed condition analysis, market comparisons, and value adjustments.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default UnifiedValuationResult;
