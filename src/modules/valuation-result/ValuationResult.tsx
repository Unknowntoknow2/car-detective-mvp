<<<<<<< HEAD

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
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
import { AINSummary } from '@/components/premium/insights/AINSummary';
import { CarfaxSummary } from '@/components/premium/insights/CarfaxSummary';
=======
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useValuationResult } from "@/hooks/useValuationResult";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import { useValuationPdf } from "@/components/valuation/result/useValuationPdf";
import { toast } from "sonner";

// Import components
import MobileLayout from "./MobileLayout";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import { Header } from "./sections/Header";
import Summary from "./sections/Summary";
import { PhotoAnalysis } from "./sections/PhotoAnalysis";
import { Breakdown } from "./sections/Breakdown";
import { Explanation } from "./sections/Explanation";
import { PDFActions } from "./sections/PDFActions";

// Import context and styles
import { ValuationProvider } from "./context/ValuationContext";
import { useValuationLogic } from "./logic";
import styles from "./styles";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface ValuationResultProps {
  valuationId?: string;
  isManualValuation?: boolean;
  manualValuationData?: any;
}

const ValuationResult: React.FC<ValuationResultProps> = ({
  valuationId: propValuationId,
  isManualValuation = false,
  manualValuationData,
}) => {
<<<<<<< HEAD
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [photoCondition, setPhotoCondition] = useState<AICondition | null>(null);
  
  // Use the ID from props or from URL params
  const id = propValuationId || params.id;
  
  // Check if this is a premium valuation from URL params
  const isPremiumFromUrl = searchParams.get('premium') === 'true';
  
  // Fetch valuation data
  const { data, isLoading, error, refetch } = useValuationData(id || '');
  
  // Determine if this is premium (from data or URL)
  const isPremium = data?.isPremium || data?.premium_unlocked || isPremiumFromUrl;
  
  // PDF generation helpers
  const { isDownloading, handleDownloadPdf } = useValuationPdfHelper({
    valuationData: data,
    conditionData: photoCondition,
    isPremium
  });
  
  const [isEmailSending, setIsEmailSending] = useState(false);
  
  // Handle email sending
=======
  useEffect(() => {
    console.log("PREMIUM RESULT: ValuationResult component mounted");
    console.log("PREMIUM RESULT: Props:", {
      valuationId,
      isManualValuation,
      hasManualData: !!manualValuationData,
    });
  }, [valuationId, isManualValuation, manualValuationData]);

  const [isEmailSending, setIsEmailSending] = useState(false);

  // Fetch valuation data
  const {
    data: valuation,
    isLoading,
    error,
  } = useValuationResult(valuationId || "");

  useEffect(() => {
    if (isLoading) {
      console.log("PREMIUM RESULT: Loading valuation data...");
    } else if (error) {
      console.error("PREMIUM RESULT: Error loading valuation data:", error);
    } else if (valuation) {
      console.log("PREMIUM RESULT: Valuation data loaded:", valuation);
    }
  }, [isLoading, valuation, error]);

  // Check premium status
  const {
    isPremium,
    isLoading: isPremiumLoading,
    createCheckoutSession,
  } = usePremiumStatus(valuationId);

  useEffect(() => {
    console.log("PREMIUM RESULT: Premium status:", {
      isPremium,
      isLoading: isPremiumLoading,
    });
  }, [isPremium, isPremiumLoading]);

  // Combine manual data with fetched data
  const valuationData = isManualValuation && manualValuationData
    ? manualValuationData
    : valuation;

  // Use derived valuation logic
  const {
    priceRange,
    marketTrend,
    recommendation,
    recommendationText,
    confidenceLevel,
    confidenceColor,
  } = useValuationLogic(valuationData);

  useEffect(() => {
    if (valuationData) {
      console.log("PREMIUM RESULT: Derived valuation logic:", {
        priceRange,
        marketTrend,
        recommendation,
        confidenceLevel,
      });
    }
  }, [valuationData, priceRange, marketTrend, recommendation, confidenceLevel]);

  // PDF generation logic
  const {
    isGenerating,
    handleDownloadPdf,
  } = useValuationPdf({
    valuationData,
    conditionData: valuationData?.aiCondition || null,
  });

  const handleUpgrade = async () => {
    if (!valuationId) {
      console.error("PREMIUM RESULT: Cannot upgrade - missing valuationId");
      toast.error("Unable to process premium upgrade without a valuation ID");
      return;
    }

    try {
      console.log(
        "PREMIUM RESULT: Initiating premium upgrade for valuationId:",
        valuationId,
      );
      const result = await createCheckoutSession(valuationId);
      console.log("PREMIUM RESULT: Checkout session result:", result);

      if (result.success && result.url) {
        console.log("PREMIUM RESULT: Redirecting to checkout URL:", result.url);
        globalThis.location.href = result.url;
      } else if (result.alreadyUnlocked) {
        console.log("PREMIUM RESULT: Premium features already unlocked");
        toast.success("Premium features are already unlocked!");
        // Refresh the page to show premium content
        globalThis.location.reload();
      } else {
        console.error(
          "PREMIUM RESULT: Failed to create checkout session:",
          result.error,
        );
        toast.error(result.error || "Failed to create checkout session");
      }
    } catch (err: any) {
      console.error("PREMIUM RESULT: Error creating checkout:", err);
      toast.error("An error occurred while processing your request");
    }
  };

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  const handleEmailPdf = async () => {
    setIsEmailSending(true);
    try {
<<<<<<< HEAD
      // Implement email sending logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Email sent successfully!');
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send email. Please try again.');
=======
      setIsEmailSending(true);
      // This would call an API endpoint to send the PDF via email
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
      toast.success("PDF report sent to your email");
    } catch (err) {
      toast.error("Failed to send PDF report");
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    } finally {
      setIsEmailSending(false);
    }
  };
<<<<<<< HEAD
  
  // Handle premium upgrade
  const handleUpgrade = () => {
    navigate('/premium');
  };
  
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
=======

  const downloadPdfHandler = async () => {
    if (isGenerating) return;
    await handleDownloadPdf();
  };

  // Loading state
  if (isLoading && !isManualValuation) {
    return <LoadingState />;
  }

  // Error state
  if ((error || !valuationData) && !isManualValuation) {
    return <ErrorState error={error} />;
  }

  if (!valuationData) {
    return null;
  }

  const showPremiumContent = isPremium || isManualValuation;

  // Extract valuation data
  const {
    make = "",
    model = "",
    year = 0,
    mileage = 0,
    condition = "Good",
    estimatedValue = 0,
    confidenceScore = 75,
    adjustments = [],
    explanation = "",
    fuelType,
    transmission,
    bestPhotoUrl,
    photoScore,
    aiCondition,
  } = valuationData;

  // Additional info for badge display
  const additionalInfo: Record<string, string> = {};
  if (fuelType) additionalInfo.fuelType = fuelType;
  if (transmission) additionalInfo.transmission = transmission;

  // Create context value
  const contextValue = {
    valuationData,
    isPremium: showPremiumContent,
    isLoading,
    error,
    estimatedValue,
    onUpgrade: handleUpgrade,
    onDownloadPdf: downloadPdfHandler,
    onEmailPdf: handleEmailPdf,
    isDownloading: isGenerating,
    isEmailSending,
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  };

  return (
<<<<<<< HEAD
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
        
        {/* Premium AIN Summary */}
        {isPremium && (
          <AINSummary
            vin={data.vin || ''}
            vehicleData={{
              year: data.year,
              make: data.make,
              model: data.model,
              mileage: data.mileage,
              estimatedValue: estimatedValue
            }}
          />
        )}
        
        {/* Premium CARFAX Summary */}
        {isPremium && (
          <CarfaxSummary />
        )}
        
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
          vin={data.vin || ''}
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
=======
    <ValuationProvider value={contextValue}>
      <MobileLayout
        isPremium={showPremiumContent}
        isLoading={isLoading}
        onUpgrade={handleUpgrade}
        onDownloadPdf={downloadPdfHandler}
        estimatedValue={estimatedValue}
        isDownloading={isGenerating}
      >
        <AnimatePresence>
          <div className={styles.container}>
            {/* Header Section */}
            <Header
              make={make}
              model={model}
              year={year}
              mileage={mileage}
              condition={condition}
              estimatedValue={estimatedValue}
              isPremium={showPremiumContent}
              additionalInfo={additionalInfo}
            />

            {/* Summary Section */}
            <Summary
              confidenceScore={confidenceScore}
              priceRange={priceRange}
              marketTrend={marketTrend}
              recommendationText={recommendationText}
            />

            {/* Main Content */}
            <div className={styles.grid.container}>
              {/* Left Column - Photo Analysis */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <PhotoAnalysis
                  photoUrl={bestPhotoUrl}
                  photoScore={photoScore}
                  condition={aiCondition}
                  isPremium={showPremiumContent}
                  onUpgrade={handleUpgrade}
                />
              </motion.div>

              {/* Right Column - Price Breakdown */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Breakdown
                  basePrice={estimatedValue -
                    adjustments.reduce((sum, adj) => sum + adj.impact, 0)}
                  adjustments={adjustments}
                  estimatedValue={estimatedValue}
                />
              </motion.div>

              {/* Full Width - Explanation (GPT) */}
              <motion.div
                className={styles.grid.fullWidth}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Explanation
                  explanation={explanation}
                  isPremium={showPremiumContent}
                  onUpgrade={handleUpgrade}
                />
              </motion.div>

              {/* Full Width - PDF Actions */}
              <motion.div
                className={styles.grid.fullWidth + " mb-20 sm:mb-0"} // Add bottom margin on mobile for action bar
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <PDFActions
                  isPremium={showPremiumContent}
                  onDownloadPdf={downloadPdfHandler}
                  onEmailPdf={handleEmailPdf}
                  onUpgrade={handleUpgrade}
                  isDownloading={isGenerating}
                  isEmailSending={isEmailSending}
                />
              </motion.div>
            </div>
          </div>
        </AnimatePresence>
      </MobileLayout>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    </ValuationProvider>
  );
};

export default ValuationResult;
export { ValuationResult };
