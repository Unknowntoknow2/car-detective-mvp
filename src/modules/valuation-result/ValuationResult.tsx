
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useValuationResult } from '@/hooks/useValuationResult';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { useValuationPdf } from '@/components/valuation/result/useValuationPdf';
import { toast } from 'sonner';

// Import components
import MobileLayout from './MobileLayout';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import { Header } from './sections/Header';
import Summary from './sections/Summary';
import { PhotoAnalysis } from './sections/PhotoAnalysis';
import { Breakdown } from './sections/Breakdown';
import { Explanation } from './sections/Explanation';
import { PDFActions } from './sections/PDFActions';

// Import context and styles
import { ValuationProvider } from './context/ValuationContext';
import { useValuationLogic } from './logic';
import styles from './styles';

interface ValuationResultProps {
  valuationId?: string;
  isManualValuation?: boolean;
  manualValuationData?: any;
}

export const ValuationResult: React.FC<ValuationResultProps> = ({
  valuationId,
  isManualValuation = false,
  manualValuationData
}) => {
  useEffect(() => {
    console.log('PREMIUM RESULT: ValuationResult component mounted');
    console.log('PREMIUM RESULT: Props:', { valuationId, isManualValuation, hasManualData: !!manualValuationData });
  }, [valuationId, isManualValuation, manualValuationData]);

  const [isEmailSending, setIsEmailSending] = useState(false);
  
  // Fetch valuation data
  const { 
    data: valuation, 
    isLoading, 
    error 
  } = useValuationResult(valuationId || '');

  useEffect(() => {
    if (isLoading) {
      console.log('PREMIUM RESULT: Loading valuation data...');
    } else if (error) {
      console.error('PREMIUM RESULT: Error loading valuation data:', error);
    } else if (valuation) {
      console.log('PREMIUM RESULT: Valuation data loaded:', valuation);
    }
  }, [isLoading, valuation, error]);
  
  // Check premium status
  const { 
    isPremium, 
    isLoading: isPremiumLoading, 
    createCheckoutSession
  } = usePremiumStatus(valuationId);

  useEffect(() => {
    console.log('PREMIUM RESULT: Premium status:', { isPremium, isLoading: isPremiumLoading });
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
    confidenceColor
  } = useValuationLogic(valuationData);

  useEffect(() => {
    if (valuationData) {
      console.log('PREMIUM RESULT: Derived valuation logic:', { 
        priceRange, marketTrend, recommendation, confidenceLevel 
      });
    }
  }, [valuationData, priceRange, marketTrend, recommendation, confidenceLevel]);
  
  // PDF generation logic
  const { 
    isDownloading, 
    handleDownloadPdf 
  } = useValuationPdf({
    valuationData,
    conditionData: valuationData?.aiCondition || null
  });

  const handleUpgrade = async () => {
    if (!valuationId) {
      console.error('PREMIUM RESULT: Cannot upgrade - missing valuationId');
      toast.error("Unable to process premium upgrade without a valuation ID");
      return;
    }
    
    try {
      console.log('PREMIUM RESULT: Initiating premium upgrade for valuationId:', valuationId);
      const result = await createCheckoutSession(valuationId);
      console.log('PREMIUM RESULT: Checkout session result:', result);
      
      if (result.success && result.url) {
        console.log('PREMIUM RESULT: Redirecting to checkout URL:', result.url);
        window.location.href = result.url;
      } else if (result.alreadyUnlocked) {
        console.log('PREMIUM RESULT: Premium features already unlocked');
        toast.success("Premium features are already unlocked!");
        // Refresh the page to show premium content
        window.location.reload();
      } else {
        console.error('PREMIUM RESULT: Failed to create checkout session:', result.error);
        toast.error(result.error || "Failed to create checkout session");
      }
    } catch (err: any) {
      console.error("PREMIUM RESULT: Error creating checkout:", err);
      toast.error("An error occurred while processing your request");
    }
  };
  
  const handleEmailPdf = async () => {
    try {
      setIsEmailSending(true);
      // This would call an API endpoint to send the PDF via email
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      toast.success("PDF report sent to your email");
    } catch (err) {
      toast.error("Failed to send PDF report");
    } finally {
      setIsEmailSending(false);
    }
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
    make = '',
    model = '',
    year = 0,
    mileage = 0,
    condition = 'Good',
    estimatedValue = 0,
    confidenceScore = 75,
    adjustments = [],
    explanation = '',
    fuelType,
    transmission,
    bestPhotoUrl,
    photoScore,
    aiCondition
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
    onDownloadPdf: handleDownloadPdf,
    onEmailPdf: handleEmailPdf,
    isDownloading,
    isEmailSending
  };
  
  return (
    <ValuationProvider value={contextValue}>
      <MobileLayout
        isPremium={showPremiumContent}
        isLoading={isLoading}
        onUpgrade={handleUpgrade}
        onDownloadPdf={handleDownloadPdf}
        estimatedValue={estimatedValue}
        isDownloading={isDownloading}
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
                  basePrice={estimatedValue - adjustments.reduce((sum, adj) => sum + adj.impact, 0)}
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
                  onDownloadPdf={handleDownloadPdf}
                  onEmailPdf={handleEmailPdf}
                  onUpgrade={handleUpgrade}
                  isDownloading={isDownloading}
                  isEmailSending={isEmailSending}
                />
              </motion.div>
            </div>
          </div>
        </AnimatePresence>
      </MobileLayout>
    </ValuationProvider>
  );
};

export default ValuationResult;
