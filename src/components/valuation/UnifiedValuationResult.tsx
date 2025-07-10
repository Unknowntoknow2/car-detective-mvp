
import React from 'react';
import { motion } from 'framer-motion';
import type { ValuationResult } from '@/utils/valuation/unifiedValuationEngine';
import { useUserPlan } from '@/hooks/useUserPlan';

// Import new redesigned components
import { VehicleHeroCard } from './redesign/VehicleHeroCard';
import { ValueShowcase } from './redesign/ValueShowcase';
import { ConfidenceRing } from './redesign/ConfidenceRing';
import { TabbedResultsPanels } from './redesign/TabbedResultsPanels';
import { PremiumFeatureOverlay } from './redesign/PremiumFeatureOverlay';

interface UnifiedValuationResultProps {
  result: ValuationResult;
}

export const UnifiedValuationResult: React.FC<UnifiedValuationResultProps> = ({
  result
}) => {
  const { isPremium } = useUserPlan();

  const handleUpgrade = () => {
    // Navigate to upgrade page
    window.location.href = '/premium';
  };

  const confidenceRecommendations = result.confidenceScore < 70 ? [
    'Complete additional vehicle details in the follow-up form',
    'Verify your vehicle\'s VIN for more accurate data',
    'Add recent maintenance records if available',
    'Specify exact trim level and options'
  ] : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-background via-background/98 to-primary/5"
    >
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Vehicle Summary - Spans 2 columns */}
          <div className="xl:col-span-2">
            <VehicleHeroCard
              vehicle={{
                year: result.vehicle.year,
                make: result.vehicle.make,
                model: result.vehicle.model,
                trim: result.vehicle.trim,
                fuelType: result.vehicle.fuelType,
                transmission: undefined,
                mileage: undefined,
                condition: undefined,
                zipCode: undefined
              }}
              estimatedValue={result.finalValue}
              confidenceScore={result.confidenceScore}
              timestamp={new Date().toISOString()}
              isPremium={isPremium}
            />
          </div>

          {/* Confidence Ring - 1 column */}
          <div className="space-y-6">
            <ConfidenceRing
              score={result.confidenceScore}
              factors={{
                vinAccuracy: 85,
                marketData: result.listingCount > 0 ? 80 : 45,
                fuelCostMatch: 90,
                msrpQuality: result.msrpSource?.includes('real') ? 95 : 65
              }}
              recommendations={confidenceRecommendations}
              onImproveClick={() => {
                // Scroll to follow-up form or navigate
                const followUpForm = document.getElementById('follow-up-form');
                if (followUpForm) {
                  followUpForm.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />

            {/* Value Showcase */}
            <ValueShowcase
              estimatedValue={result.finalValue}
              priceRange={result.listingRange ? {
                min: result.listingRange.min,
                max: result.listingRange.max
              } : undefined}
              marketComparison={result.marketComparison}
              confidenceScore={result.confidenceScore}
            />
          </div>
        </div>

        {/* Main Content Tabs */}
        <TabbedResultsPanels result={result} />

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
          onUpgrade={handleUpgrade}
        />
      </div>
    </motion.div>
  );
};

export default UnifiedValuationResult;
