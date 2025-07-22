
import React from 'react';
import { motion } from 'framer-motion';
import type { UnifiedValuationResult as ValuationResultType } from '@/types/valuation';
import { useUserPlan } from '@/hooks/useUserPlan';
import { useValuationContext } from '@/contexts/ValuationContext';

// Import new redesigned components
import { VehicleHeroCard } from './redesign/VehicleHeroCard';
import { ValueShowcase } from './redesign/ValueShowcase';
import { ConfidenceRing } from './redesign/ConfidenceRing';
import { TabbedResultsPanels } from './redesign/TabbedResultsPanels';
import { PremiumFeatureOverlay } from './redesign/PremiumFeatureOverlay';
import { ConfidenceExplanationBadge } from './ConfidenceExplanationBadge';
import { MarketTrendSection } from './MarketTrendSection';
import { TitleRecallPanel } from './TitleRecallPanel';

interface UnifiedValuationResultProps {
  result: ValuationResultType;
}

export const UnifiedValuationResult: React.FC<UnifiedValuationResultProps> = ({
  result
}) => {
  const { isPremium: userIsPremium } = useUserPlan();
  const { isPremium: contextIsPremium, onUpgrade } = useValuationContext();
  
  // Use context premium status if available, otherwise fall back to user plan
  const isPremium = contextIsPremium || userIsPremium;

  // Enhanced validation with better error messages
  console.log('🔍 UnifiedValuationResult received result:', result);
  
  if (!result) {
    console.error('❌ No result data provided to UnifiedValuationResult');
    return (
      <div className="container mx-auto p-6 text-center bg-red-50 border border-red-200 rounded">
        <p className="text-red-600">No valuation data available</p>
        <p className="text-sm text-red-500 mt-2">Please try refreshing the page or contact support</p>
      </div>
    );
  }

  if (!result.finalValue || typeof result.finalValue !== 'number' || result.finalValue <= 0) {
    console.error('❌ Invalid finalValue in result:', result.finalValue);
    return (
      <div className="container mx-auto p-6 text-center bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-yellow-600">Invalid valuation amount</p>
        <p className="text-sm text-yellow-500 mt-2">Estimated value: {JSON.stringify(result.finalValue)}</p>
      </div>
    );
  }

  // Ensure mileage is displayed correctly
  const displayMileage = result.mileage || 0;
  const hasValidListings = result.listings && result.listings.length > 0;
  
  // Enhanced confidence recommendations based on data quality
  const confidenceRecommendations = [];
  
  if (result.confidenceScore < 70) {
    confidenceRecommendations.push('Complete additional vehicle details in the follow-up form');
  }
  
  if (!hasValidListings) {
    confidenceRecommendations.push('Limited market data available - consider checking back later');
  }
  
  if (displayMileage === 0) {
    confidenceRecommendations.push('Add accurate mileage for more precise valuation');
  }

  console.log('✅ Data validation passed, rendering components with:', {
    finalValue: result.finalValue,
    mileage: displayMileage,
    listingCount: result.listingCount,
    confidenceScore: result.confidenceScore,
    marketSearchStatus: result.marketSearchStatus
  });

  return (
    <div className="bg-gradient-to-br from-background via-background/98 to-primary/5">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Enhanced Confidence Badge with market data status */}
        <div className="flex justify-center mb-4">
          <ConfidenceExplanationBadge
            confidenceScore={result.confidenceScore}
            marketSearchStatus={result.marketSearchStatus as "success" | "fallback" | "error" || 'success'}
            listingCount={result.listingCount}
            sources={result.sources}
            onRetrySearch={() => {
              console.log('Retry market search requested');
              window.location.reload(); // Simple retry for now
            }}
          />
        </div>
        
        {/* Hero Section with consistent data */}
        <section>
          <VehicleHeroCard
            vehicle={{
              year: result.vehicle.year,
              make: result.vehicle.make,
              model: result.vehicle.model,
              trim: result.vehicle.trim || '',
              fuelType: result.vehicle.fuelType || 'gasoline',
              transmission: 'Automatic', // Default since not in result
              mileage: displayMileage,
              condition: 'Good', // Default since not in result
              zipCode: result.zip || ''
            }}
            estimatedValue={result.finalValue}
            confidenceScore={result.confidenceScore}
            timestamp={new Date(result.timestamp || Date.now()).toISOString()}
            isPremium={isPremium}
          />
        </section>

        {/* Value & Confidence Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Value Showcase */}
          <ValueShowcase
            estimatedValue={result.finalValue}
            priceRange={result.listingRange ? {
              min: result.listingRange.min,
              max: result.listingRange.max
            } : undefined}
            confidenceScore={result.confidenceScore}
          />

          {/* Enhanced Confidence Ring with market data factors */}
          <ConfidenceRing
            score={result.confidenceScore}
            factors={{
              vinAccuracy: 85,
              marketData: hasValidListings ? Math.min(90, 60 + (result.listingCount * 5)) : 30,
              mileageAccuracy: displayMileage > 0 ? 90 : 50,
              vehicleDetails: result.vehicle.trim ? 85 : 70
            }}
            recommendations={confidenceRecommendations}
            onImproveClick={() => {
              const followUpForm = document.getElementById('follow-up-form');
              if (followUpForm) {
                followUpForm.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />
        </div>

        {/* Market Data Status Indicator */}
        {result.marketSearchStatus === 'error' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              ⚠️ Limited market data available. Valuation based on vehicle specifications and historical data.
            </p>
          </div>
        )}

        {/* Title & Recall Intelligence Panel */}
        {result.titleRecallInfo && (
          <TitleRecallPanel titleRecallInfo={result.titleRecallInfo} />
        )}

        {/* Main Content Tabs with enhanced data */}
        <TabbedResultsPanels 
          result={{
            ...result,
            vin: result.vin || '',
            mileage: displayMileage,
            aiExplanation: result.aiExplanation || `Your ${result.vehicle.year} ${result.vehicle.make} ${result.vehicle.model} is valued at $${result.finalValue.toLocaleString()}.`,
            marketSearchStatus: (result.marketSearchStatus as "success" | "fallback" | "error") || 'success'
          }}
          onUpgrade={onUpgrade}
          isPremium={isPremium}
          valuationId={result.id}
        />

        {/* Premium Features Section */}
        <PremiumFeatureOverlay
          isPremium={isPremium}
          features={[
            {
              id: 'pdf_download',
              title: 'PDF Reports',
              description: 'Download detailed valuation reports with market analysis and professional formatting',
              icon: () => <span>📄</span>,
              preview: 'Professional PDF with charts, market data, and detailed analysis'
            },
            {
              id: 'advanced_sharing',
              title: 'Advanced Sharing',
              description: 'QR codes, social media sharing, and custom shareable links',
              icon: () => <span>🔗</span>,
              preview: 'Share via WhatsApp, Twitter, email with custom QR codes'
            },
            {
              id: 'market_alerts',
              title: 'Market Alerts',
              description: 'Get notified when similar vehicles hit the market',
              icon: () => <span>📊</span>,
              preview: 'Email alerts for new listings and price changes',
              comingSoon: true
            },
            {
              id: 'dealer_network',
              title: 'Dealer Network',
              description: 'Connect with verified dealers and get real offers',
              icon: () => <span>🤝</span>,
              preview: 'Direct offers from our certified dealer partners'
            }
          ]}
          onUpgrade={onUpgrade}
        />
      </div>
    </div>
  );
};

export default UnifiedValuationResult;
