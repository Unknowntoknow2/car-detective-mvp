import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  MapPin, 
  FileCheck,
  Bot,
  Database,
  Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { UnifiedValuationResult } from '@/types/valuation';

// Import existing components to reuse logic
import { InteractiveValueBreakdown } from './InteractiveValueBreakdown';
import { MarketListingsGrid } from './MarketListingsGrid';
import { DataIntegrityPanel } from '../DataIntegrityPanel';
import { MarketTrendSection } from '../MarketTrendSection';

interface TabbedResultsPanelsProps {
  result: UnifiedValuationResult;
  onUpgrade: () => void;
  isPremium: boolean;
  valuationId: string;
}

export function TabbedResultsPanels({ result, onUpgrade, isPremium, valuationId }: TabbedResultsPanelsProps) {
  // Add defensive checks
  if (!result) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">Loading results data...</p>
      </Card>
    );
  }
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: BarChart3,
      description: 'Key metrics and summary'
    },
    {
      id: 'analysis',
      label: 'Analysis',
      icon: TrendingUp,
      description: 'Value breakdown and AI insights'
    },
    {
      id: 'enhanced-listings',
      label: 'Live Market',
      icon: Search,
      description: 'Facebook & Craigslist listings'
    },
    {
      id: 'market',
      label: 'Market Data',
      icon: MapPin,
      description: 'Live listings and comparisons'
    },
    {
      id: 'forecast',
      label: 'Forecast',
      icon: TrendingUp,
      description: 'Price trends and predictions'
    },
    {
      id: 'sources',
      label: 'Sources',
      icon: Database,
      description: 'Data sources and audit trail'
    }
  ];

  const getTabBadge = (tabId: string) => {
    switch (tabId) {
      case 'market':
        return result.listingCount > 0 ? (
          <Badge variant="default" className="ml-2 text-xs">
            {result.listingCount}
          </Badge>
        ) : null;
      case 'analysis':
        return result.aiExplanation ? (
          <Badge variant="secondary" className="ml-2 text-xs">
            AI
          </Badge>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-background/95">
        <CardContent className="p-0">
          <Tabs defaultValue="overview" className="w-full">
            {/* Modern Tab List */}
            <div className="border-b bg-muted/30 px-6 py-4">
              <TabsList className="grid w-full grid-cols-6 bg-background/50 backdrop-blur-sm">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="flex flex-col md:flex-row items-center gap-2 p-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        <span className="font-medium">{tab.label}</span>
                        {getTabBadge(tab.id)}
                      </div>
                      <span className="text-xs text-muted-foreground hidden lg:block">
                        {tab.description}
                      </span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              <TabsContent value="overview" className="space-y-6 mt-0">
                <OverviewTab result={result} />
              </TabsContent>

              <TabsContent value="analysis" className="space-y-6 mt-0">
                <AnalysisTab result={result} />
              </TabsContent>

              <TabsContent value="enhanced-listings" className="space-y-6 mt-0">
                <EnhancedListingsTab result={result} />
              </TabsContent>

              <TabsContent value="market" className="space-y-6 mt-0">
                <MarketTab result={result} />
              </TabsContent>

              <TabsContent value="forecast" className="space-y-6 mt-0">
                <ForecastTab 
                  result={result} 
                  valuationId={valuationId}
                  isPremium={isPremium}
                  onUpgrade={onUpgrade}
                />
              </TabsContent>

              <TabsContent value="sources" className="space-y-6 mt-0">
                <SourcesTab result={result} />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Individual Tab Components
function OverviewTab({ result }: { result: UnifiedValuationResult }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-700">
              ${result.finalValue.toLocaleString()}
            </div>
            <div className="text-sm text-green-600">Market Value</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">{result.confidenceScore}%</div>
            <div className="text-sm text-blue-600">Confidence</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <Search className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-700">
              {result.listingCount || 0}
            </div>
            <div className="text-sm text-purple-600">Market Listings</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Summary */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Valuation Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vehicle:</span>
              <span className="font-medium">
                {result.vehicle.year} {result.vehicle.make} {result.vehicle.model}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Condition:</span>
              <span className="font-medium capitalize">Not specified</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Market Status:</span>
              <Badge variant={result.marketSearchStatus === 'success' ? 'default' : 'secondary'}>
                {result.marketSearchStatus === 'success' ? 'Live Data' : 'Estimated'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function AnalysisTab({ result }: { result: UnifiedValuationResult }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <InteractiveValueBreakdown 
        adjustments={result.adjustments}
        finalValue={result.finalValue}
        confidenceScore={result.confidenceScore}
      />

      {/* AI Explanation */}
      {result.aiExplanation && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">AI Analysis</h3>
              <Badge variant="secondary" className="text-xs">Powered by AI</Badge>
            </div>
            <div className="prose prose-sm max-w-none text-muted-foreground">
              {result.aiExplanation}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

function MarketTab({ result }: { result: UnifiedValuationResult }) {
  // Map the existing marketSearchStatus to the expected type
  const mappedStatus = result.marketSearchStatus === 'fallback' ? 'no_results' as const : 
                      result.marketSearchStatus === 'success' ? 'success' as const :
                      result.marketSearchStatus === 'error' ? 'error' as const : 'no_results' as const;
  
  // Extract valuation ID from result
  const valuationId = (result as any).id || 
                     (result as any).valuationId || 
                     (result as any).vin || 
                     'unknown';
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Market Forecast Section */}
      <MarketTrendSection
        valuationId={valuationId}
        make={result.vehicle.make}
        model={result.vehicle.model}
        year={result.vehicle.year}
        estimatedValue={result.finalValue}
        isPremium={true} // Always show for now - TODO: Get real premium status from user context
        onUpgrade={() => window.location.href = '/premium'}
      />
      
      {/* Market Listings Grid */}
      <MarketListingsGrid 
        listings={result.listings || []}
        listingCount={result.listingCount}
        marketSearchStatus={mappedStatus}
      />
    </motion.div>
  );
}

function SourcesTab({ result }: { result: UnifiedValuationResult }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <DataIntegrityPanel 
        confidenceScore={result.confidenceScore}
        vehicleData={{
          dataCompleteness: {
            hasVin: true,
            hasRealLocation: false,
            hasActualMileage: false,
            usedRealMSRP: false,
            marketListingsCount: result.listingCount || 0,
            hasMarketRange: Boolean(result.listingRange)
          },
          msrpSource: 'estimated',
          baseMSRP: (result.vehicle as any).msrp || 0
        }}
      />
    </motion.div>
  );
}

// Forecast Tab Component
function ForecastTab({ 
  result, 
  valuationId, 
  isPremium, 
  onUpgrade 
}: { 
  result: UnifiedValuationResult; 
  valuationId: string; 
  isPremium: boolean; 
  onUpgrade: () => void; 
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <MarketTrendSection
        valuationId={valuationId}
        make={result.vehicle.make}
        model={result.vehicle.model}
        year={result.vehicle.year}
        estimatedValue={result.finalValue}
        isPremium={isPremium}
        onUpgrade={onUpgrade}
      />
    </motion.div>
  );
}

// Enhanced Listings Tab Component
function EnhancedListingsTab({ result }: { result: UnifiedValuationResult }) {
  const enhancedListings = result.listings?.filter(listing => 
    ['facebook', 'craigslist'].includes(listing.source?.toLowerCase() || '')
  ) || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Live Market Listings
          </h3>
          <p className="text-sm text-muted-foreground">
            Real-time listings from Facebook Marketplace and Craigslist for enhanced price validation.
          </p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          {enhancedListings.length} Enhanced
        </Badge>
      </div>

      {enhancedListings.length > 0 ? (
        <div className="space-y-3">
          {enhancedListings.slice(0, 8).map((listing, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs capitalize">
                      {listing.source}
                    </Badge>
                    {listing.dealer_name && (
                      <Badge variant="secondary" className="text-xs">
                        {listing.dealer_name}
                      </Badge>
                    )}
                    {listing.is_cpo && (
                      <Badge variant="default" className="text-xs">
                        CPO
                      </Badge>
                    )}
                  </div>
                  <p className="font-medium">
                    {result.vehicle.year} {result.vehicle.make} {result.vehicle.model}
                    {listing.trim && ` ${listing.trim}`}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    {listing.mileage && (
                      <span>{listing.mileage.toLocaleString()} miles</span>
                    )}
                    {listing.location && (
                      <span>{listing.location}</span>
                    )}
                    {listing.condition && (
                      <span className="capitalize">{listing.condition}</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">
                    ${listing.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {listing.fetched_at ? new Date(listing.fetched_at).toLocaleDateString() : 'Recent'}
                  </p>
                  {listing.listing_url && listing.listing_url !== '#' && (
                    <a 
                      href={listing.listing_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      View Listing →
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8">
          <div className="text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h4 className="font-medium mb-2">No Enhanced Listings Found</h4>
            <p className="text-sm text-muted-foreground">
              No Facebook Marketplace or Craigslist listings were found for this vehicle.
              The valuation is based on standard market data sources.
            </p>
          </div>
        </Card>
      )}
    </motion.div>
  );
}