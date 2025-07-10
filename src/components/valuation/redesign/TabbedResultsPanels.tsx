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
import type { ValuationResult } from '@/utils/valuation/unifiedValuationEngine';

// Import existing components to reuse logic
import { InteractiveValueBreakdown } from './InteractiveValueBreakdown';
import { MarketListingsGrid } from './MarketListingsGrid';
import { DataIntegrityPanel } from '../DataIntegrityPanel';

interface TabbedResultsPanelsProps {
  result: ValuationResult;
}

export function TabbedResultsPanels({ result }: TabbedResultsPanelsProps) {
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
      id: 'market',
      label: 'Market Data',
      icon: MapPin,
      description: 'Live listings and comparisons'
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
              <TabsList className="grid w-full grid-cols-4 bg-background/50 backdrop-blur-sm">
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

              <TabsContent value="market" className="space-y-6 mt-0">
                <MarketTab result={result} />
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
function OverviewTab({ result }: { result: ValuationResult }) {
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

function AnalysisTab({ result }: { result: ValuationResult }) {
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

function MarketTab({ result }: { result: ValuationResult }) {
  // Map the existing marketSearchStatus to the expected type
  const mappedStatus = result.marketSearchStatus === 'fallback' ? 'no_results' : result.marketSearchStatus;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <MarketListingsGrid 
        listings={result.listings || []}
        listingCount={result.listingCount}
        marketSearchStatus={mappedStatus}
      />
    </motion.div>
  );
}

function SourcesTab({ result }: { result: ValuationResult }) {
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
          baseMSRP: result.vehicle.msrp || 0
        }}
      />
    </motion.div>
  );
}