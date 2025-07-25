import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Database, 
  Globe, 
  User, 
  Shield, 
  Clock,
  Info,
  ChevronDown,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { PrioritizedValuationData } from '@/utils/followUpDataPrioritization';

interface DataSourceTransparencyProps {
  prioritizedData?: PrioritizedValuationData;
  marketListings: any[];
  valuationMethod?: string;
  isUsingFallbackMethod?: boolean;
}

export function DataSourceTransparency({ 
  prioritizedData, 
  marketListings, 
  valuationMethod,
  isUsingFallbackMethod 
}: DataSourceTransparencyProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const dataSourceSummary = getDataSourceSummary();
  const sourceBreakdown = getSourceBreakdown();

  function getDataSourceSummary() {
    const sources = [];
    
    if (prioritizedData?.followUpCompleted) {
      sources.push({
        type: 'User Provided',
        icon: User,
        color: 'green',
        confidence: 'High',
        description: 'Enhanced data provided through follow-up questions'
      });
    }

    if (marketListings.length > 0) {
      sources.push({
        type: 'Live Market Data',
        icon: Globe,
        color: 'blue',
        confidence: 'High',
        description: `${marketListings.length} live market listings`
      });
    }

    if (isUsingFallbackMethod) {
      sources.push({
        type: 'Pricing Models',
        icon: Database,
        color: 'orange',
        confidence: 'Medium',
        description: 'Industry pricing models and depreciation curves'
      });
    }

    return sources;
  }

  function getSourceBreakdown() {
    const breakdown = {
      userProvided: {
        fields: [] as Array<{
          field: string;
          value: string | number;
          confidence: 'high' | 'medium' | 'low';
        }>,
        confidence: 'High',
        description: 'Data provided directly by you for maximum accuracy'
      },
      marketData: {
        sources: [] as Array<{
          name: string;
          count: number;
          type: string;
        }>,
        confidence: marketListings.length >= 5 ? 'High' : 'Medium',
        description: 'Real-time market listings from verified sources'
      },
      systemDefaults: {
        fields: [] as Array<{
          field: string;
          value: string | number;
          confidence: 'high' | 'medium' | 'low';
        }>,
        confidence: 'Low',
        description: 'Industry averages used when specific data unavailable'
      }
    };

    if (prioritizedData) {
      Object.entries(prioritizedData.prioritizedFields).forEach(([field, data]) => {
        if (data.source === 'user_followup') {
          breakdown.userProvided.fields.push({
            field: field.replace(/([A-Z])/g, ' $1').toLowerCase(),
            value: data.value,
            confidence: data.confidence
          });
        } else if (data.source === 'system_default') {
          breakdown.systemDefaults.fields.push({
            field: field.replace(/([A-Z])/g, ' $1').toLowerCase(),
            value: data.value,
            confidence: data.confidence
          });
        }
      });
    }

    // Group market listings by source
    const sourceCounts = marketListings.reduce((acc, listing) => {
      const source = listing.source || 'Unknown';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {});

    breakdown.marketData.sources = Object.entries(sourceCounts).map(([source, count]) => ({
      name: source,
      count,
      type: getSourceType(source)
    }));

    return breakdown;
  }

  function getSourceType(source: string): string {
    const lowerSource = source.toLowerCase();
    if (lowerSource.includes('dealer') || lowerSource.includes('cargurus') || lowerSource.includes('autotrader')) {
      return 'Tier 1 - Premium';
    }
    if (lowerSource.includes('cars.com') || lowerSource.includes('carmax')) {
      return 'Tier 2 - Retail';
    }
    return 'Tier 3 - General';
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence.toLowerCase()) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSourceIcon = (IconComponent: any, color: string) => {
    const colorClasses: Record<string, string> = {
      green: 'text-green-600',
      blue: 'text-blue-600',
      orange: 'text-orange-600',
      gray: 'text-gray-600'
    };
    
    return <IconComponent className={`h-4 w-4 ${colorClasses[color] || 'text-gray-600'}`} />;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Data Sources & Transparency
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Source Summary */}
        <div className="grid gap-3">
          {dataSourceSummary.map((source, index) => {
            const IconComponent = source.icon;
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getSourceIcon(IconComponent, source.color)}
                  <div>
                    <div className="font-medium text-sm">{source.type}</div>
                    <div className="text-xs text-muted-foreground">{source.description}</div>
                  </div>
                </div>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getConfidenceColor(source.confidence)}`}
                >
                  {source.confidence}
                </Badge>
              </div>
            );
          })}
        </div>

        {/* Method Disclosure */}
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-sm">Valuation Method</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {isUsingFallbackMethod 
              ? 'Using market intelligence and pricing models due to limited live market data.'
              : valuationMethod === 'live_search' 
                ? 'Primary method: Live market data analysis with comparable vehicle matching.'
                : 'Hybrid approach combining live market data with pricing models for comprehensive accuracy.'
            }
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="space-y-4 border-t pt-4">
            {/* User Provided Data */}
            {sourceBreakdown.userProvided.fields.length > 0 && (
              <div>
                <button
                  onClick={() => setActiveSection(activeSection === 'user' ? null : 'user')}
                  className="w-full flex items-center justify-between p-2 hover:bg-muted rounded"
                >
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-sm">User-Provided Data</span>
                    <Badge variant="secondary" className={getConfidenceColor('high')}>
                      High Confidence
                    </Badge>
                  </div>
                  {activeSection === 'user' ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                
                {activeSection === 'user' && (
                  <div className="ml-6 mt-2 space-y-2">
                    {sourceBreakdown.userProvided.fields.map((field, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="capitalize">{field.field}</span>
                        <span className="font-medium">{field.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Market Data Sources */}
            {sourceBreakdown.marketData.sources.length > 0 && (
              <div>
                <button
                  onClick={() => setActiveSection(activeSection === 'market' ? null : 'market')}
                  className="w-full flex items-center justify-between p-2 hover:bg-muted rounded"
                >
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-sm">Market Data Sources</span>
                    <Badge variant="secondary" className={getConfidenceColor(sourceBreakdown.marketData.confidence)}>
                      {sourceBreakdown.marketData.confidence} Confidence
                    </Badge>
                  </div>
                  {activeSection === 'market' ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                
                {activeSection === 'market' && (
                  <div className="ml-6 mt-2 space-y-2">
                    {sourceBreakdown.marketData.sources.map((source, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <div>
                          <span className="font-medium">{source.name}</span>
                          <div className="text-xs text-muted-foreground">{source.type}</div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {source.count} listings
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* System Defaults */}
            {sourceBreakdown.systemDefaults.fields.length > 0 && (
              <div>
                <button
                  onClick={() => setActiveSection(activeSection === 'defaults' ? null : 'defaults')}
                  className="w-full flex items-center justify-between p-2 hover:bg-muted rounded"
                >
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-orange-600" />
                    <span className="font-medium text-sm">System Defaults</span>
                    <Badge variant="secondary" className={getConfidenceColor('low')}>
                      Low Confidence
                    </Badge>
                  </div>
                  {activeSection === 'defaults' ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                
                {activeSection === 'defaults' && (
                  <div className="ml-6 mt-2 space-y-2">
                    {sourceBreakdown.systemDefaults.fields.map((field, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="capitalize">{field.field}</span>
                        <span className="text-muted-foreground">{field.value}</span>
                      </div>
                    ))}
                    <div className="text-xs text-orange-600 mt-2">
                      💡 Complete follow-up questions to improve these values
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Data Freshness */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Market data refreshed within the last 24 hours</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}