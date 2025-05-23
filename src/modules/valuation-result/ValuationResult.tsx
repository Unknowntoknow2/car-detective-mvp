import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from './sections/Header';
import Summary from './sections/Summary';
import { PhotoAnalysis } from './sections/PhotoAnalysis';
import { Breakdown } from './sections/Breakdown';
import Explanation from './sections/Explanation';
import PDFActions from './sections/PDFActions';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import { useValuationData } from './hooks/useValuationData';
import { useValuationPdfHelper } from './hooks/useValuationPdfHelper';
import { ValuationProvider } from './context/ValuationContext';
import { AICondition } from '@/types/photo';
import { MarketInsightsTab } from '@/components/premium/sections/valuation-tabs/market-analysis/MarketInsightsTab';

interface ValuationResultProps {
  valuationId?: string;
  isManualValuation?: boolean;
  manualValuationData?: any;
}

const ValuationResult: React.FC<ValuationResultProps> = ({
  valuationId: propValuationId,
  isManualValuation = false,
  manualValuationData
}) => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isPremium, setIsPremium] = useState(false);
  const [photoCondition, setPhotoCondition] = useState<AICondition | null>(null);
  
  // Use the ID from props or from URL params
  const id = propValuationId || params.id;
  
  // Fetch valuation data
  const { data, isLoading, error, refetch } = useValuationData(id || '');
  
  // PDF generation helpers
  const { isDownloading, handleDownloadPdf } = useValuationPdfHelper({
    valuationData: data,
    conditionData: photoCondition,
    isPremium
  });
  
  const [isEmailSending, setIsEmailSending] = useState(false);
  
  // Handle email sending
  const handleEmailPdf = async () => {
    setIsEmailSending(true);
    try {
      // Implement email sending logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Email sent successfully!');
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send email. Please try again.');
    } finally {
      setIsEmailSending(false);
    }
  };
  
  // Handle premium upgrade
  const handleUpgrade = () => {
    navigate('/premium');
  };
  
  // Check if this is a premium valuation
  useEffect(() => {
    if (data) {
      setIsPremium(data.isPremium || data.premium_unlocked || false);
    }
  }, [data]);
  
  // Handle photo condition update
  const handlePhotoConditionUpdate = (condition: AICondition) => {
    setPhotoCondition(condition);
  };
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (error || !data) {
    return <ErrorState error={error || 'Valuation not found'} />;
  }
  
  // Calculate estimated value
  const estimatedValue = data.estimatedValue || data.estimated_value || 0;
  
  // Determine price range
  const priceRange = {
    low: data.priceRange ? (Array.isArray(data.priceRange) ? data.priceRange[0] : 
         (data.priceRange as any).min || Math.round(estimatedValue * 0.95)) : 
         Math.round(estimatedValue * 0.95),
    high: data.priceRange ? (Array.isArray(data.priceRange) ? data.priceRange[1] : 
         (data.priceRange as any).max || Math.round(estimatedValue * 1.05)) : 
         Math.round(estimatedValue * 1.05)
  };
  
  return (
    <ValuationProvider
      value={{
        valuationData: data,
        isPremium,
        isLoading,
        error,
        estimatedValue,
        onUpgrade: handleUpgrade,
        onDownloadPdf: handleDownloadPdf,
        onEmailPdf: handleEmailPdf,
        isDownloading,
        isEmailSending
      }}
    >
      <div className="space-y-6">
        <Header
          make={data.make}
          model={data.model}
          year={data.year}
          mileage={data.mileage}
          condition={data.condition}
          estimatedValue={estimatedValue}
          isPremium={isPremium}
        />
        
        <Summary
          confidenceScore={data.confidenceScore || data.confidence_score || 75}
          priceRange={priceRange}
          marketTrend="stable"
          recommendationText="Based on current market conditions, this vehicle is priced competitively."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PhotoAnalysis
            photoUrl={data.bestPhotoUrl || data.photo_url}
            photoScore={data.photoScore}
            condition={photoCondition}
            isPremium={isPremium}
            onUpgrade={handleUpgrade}
          />
          
          <Breakdown
            basePrice={data.basePrice || data.base_price || Math.round(estimatedValue * 0.9)}
            adjustments={data.adjustments || []}
            estimatedValue={estimatedValue}
          />
        </div>
        
        {/* Market Analysis Tab */}
        <MarketInsightsTab
          valuationId={id || ''}
          isPremium={isPremium}
          zipCode={data.zipCode || ''}
          make={data.make}
          model={data.model}
          year={data.year}
          mileage={data.mileage}
          condition={data.condition}
          vin={data.vin}
          onUpgrade={handleUpgrade}
        />
        
        <Explanation
          explanation={data.explanation || data.gptExplanation || "No market analysis available for this vehicle."}
          isPremium={isPremium}
          onUpgrade={handleUpgrade}
        />
        
        <PDFActions
          isPremium={isPremium}
          onDownloadPdf={handleDownloadPdf}
          onEmailPdf={handleEmailPdf}
          onUpgrade={handleUpgrade}
          isDownloading={isDownloading}
          isEmailSending={isEmailSending}
        />
      </div>
    </ValuationProvider>
  );
};

export default ValuationResult;
export { ValuationResult };
