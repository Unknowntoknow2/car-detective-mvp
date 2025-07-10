
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

  // Add error boundary and defensive rendering
  console.log('🔍 UnifiedValuationResult received:', result);
  
  if (!result) {
    console.error('❌ No result data provided to UnifiedValuationResult');
    return (
      <div className="container mx-auto p-6 text-center bg-red-50 border border-red-200 rounded">
        <p className="text-red-600">No valuation data available</p>
        <p className="text-sm text-red-500 mt-2">Debug: result is null or undefined</p>
      </div>
    );
  }

  if (!result.finalValue || typeof result.finalValue !== 'number') {
    console.error('❌ Invalid finalValue in result:', result.finalValue);
    return (
      <div className="container mx-auto p-6 text-center bg-red-50 border border-red-200 rounded">
        <p className="text-red-600">Invalid valuation data</p>
        <p className="text-sm text-red-500 mt-2">Debug: finalValue = {JSON.stringify(result.finalValue)}</p>
      </div>
    );
  }

  console.log('✅ Data validation passed, rendering components...');

  return (
    <div className="bg-gradient-to-br from-background via-background/98 to-primary/5">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Debug Section */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <h4 className="font-semibold">Component Debug:</h4>
          <p>Final Value: ${result.finalValue?.toLocaleString()}</p>
          <p>Vehicle: {result.vehicle.year} {result.vehicle.make} {result.vehicle.model}</p>
          <p>Confidence: {result.confidenceScore}%</p>
        </div>
        
        {/* Hero Section */}
        <section>
          <VehicleHeroCard
            vehicle={{
              year: result.vehicle.year,
              make: result.vehicle.make,
              model: result.vehicle.model,
              trim: result.vehicle.trim || '',
              fuelType: result.vehicle.fuelType,
              transmission: 'Unknown',
              mileage: result.mileage || 0,
              condition: 'Good',
              zipCode: result.zip || ''
            }}
            estimatedValue={result.finalValue}
            confidenceScore={result.confidenceScore}
            timestamp={result.timestamp?.toString() || new Date().toISOString()}
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

          {/* Confidence Ring */}
          <ConfidenceRing
            score={result.confidenceScore}
            factors={{
              vinAccuracy: 85,
              marketData: result.listingCount > 0 ? 80 : 45,
              fuelCostMatch: 90,
              msrpQuality: result.sources?.includes('msrp_db_lookup') ? 95 : 65
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
    </div>
  );
};

export default UnifiedValuationResult;
