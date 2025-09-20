import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ExternalLink, Target, BarChart3 } from 'lucide-react';
import type { UnifiedValuationResult } from '@/types/valuation';

interface MarketBreakdownPanelProps {
  result: UnifiedValuationResult;
}

interface GroupedListing {
  title: string;
  price: number;
  mileage: number;
  source: string;
  trustWeight: number;
  url?: string;
  tier: number;
}

export function MarketBreakdownPanel({ result }: MarketBreakdownPanelProps) {
  const {
    marketAnchoredPrice,
    marketListings = [],
    sourceBreakdown,
    sourceContributions = [],
    confidenceScore,
    listingCount
  } = result;

  // Return early if no market data available
  if (!marketListings || marketListings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            📊 Market Listings Used in Valuation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No Market Data Available</p>
            <p className="text-sm">This valuation was calculated using our base depreciation model.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Helper functions
  const groupListingsByTier = (listings: any[]) => {
    const grouped: Record<number, GroupedListing[]> = { 1: [], 2: [], 3: [] };
    
    listings.forEach(listing => {
      const tier = listing.source_tier || listing.tier || 3; // Default to Tier 3 if not specified
      const groupedListing: GroupedListing = {
        title: `${listing.year || result.vehicle.year} ${listing.make || result.vehicle.make} ${listing.model || result.vehicle.model}`,
        price: listing.price || 0,
        mileage: listing.mileage || 0,
        source: listing.source || 'Unknown Source',
        trustWeight: listing.trustWeight || (tier === 1 ? 1.0 : tier === 2 ? 0.85 : 0.7),
        url: listing.url || listing.listing_url,
        tier
      };
      
      if (grouped[tier]) {
        grouped[tier].push(groupedListing);
      }
    });
    
    return grouped;
  };

  const computeTierAverages = (listings: any[]) => {
    const tierStats: Record<number, { count: number; avgPrice: number; totalTrust: number }> = {};
    
    [1, 2, 3].forEach(tier => {
      const tierListings = listings.filter(l => (l.source_tier || l.tier || 3) === tier);
      tierStats[tier] = {
        count: tierListings.length,
        avgPrice: tierListings.length > 0 
          ? tierListings.reduce((sum, l) => sum + (l.price || 0), 0) / tierListings.length 
          : 0,
        totalTrust: tierListings.reduce((sum, l) => sum + (l.trustWeight || (tier === 1 ? 1.0 : tier === 2 ? 0.85 : 0.7)), 0)
      };
    });
    
    return tierStats;
  };

  const getTierBadgeColor = (tier: number) => {
    switch (tier) {
      case 1: return 'bg-green-100 text-green-800 border-green-200';
      case 2: return 'bg-blue-100 text-blue-800 border-blue-200';
      case 3: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTierLabel = (tier: number) => {
    switch (tier) {
      case 1: return 'Tier 1 - Premium Sources';
      case 2: return 'Tier 2 - Verified Dealers';
      case 3: return 'Tier 3 - Regional Sources';
      default: return 'Other Sources';
    }
  };

  const listingsByTier = groupListingsByTier(marketListings);
  const tierAverages = computeTierAverages(marketListings);
  const totalSourceCount = sourceBreakdown?.urls?.length || 
    [...new Set(marketListings.map(l => l.source))].length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          📊 Market Listings Used in Valuation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                ${marketAnchoredPrice?.toLocaleString() || 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Weighted Market Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{listingCount}</div>
              <div className="text-sm text-muted-foreground">Total Listings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{confidenceScore}%</div>
              <div className="text-sm text-muted-foreground">Confidence Score</div>
            </div>
          </div>

          {/* Market Type Breakdown - P2P vs Retail Insights */}
          {sourceBreakdown && (sourceBreakdown.retail > 0 || sourceBreakdown.p2p > 0) && (
            <div className="bg-secondary/50 rounded-lg p-4">
              <h4 className="font-semibold mb-3 text-center">🏪 Market Type Analysis</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-600">{sourceBreakdown.retail}</div>
                  <div className="text-sm text-muted-foreground">Retail Dealers</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-orange-600">{sourceBreakdown.p2p}</div>
                  <div className="text-sm text-muted-foreground">Private Party</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-600">{sourceBreakdown.auction || 0}</div>
                  <div className="text-sm text-muted-foreground">Auctions</div>
                </div>
              </div>
              {sourceBreakdown.p2p > 0 && (
                <div className="mt-3 text-center text-sm text-muted-foreground">
                  💡 Private-party listings often reflect negotiable asking prices 10-20% below retail
                </div>
              )}
            </div>
          )}

          {/* Summary Description */}
          <div className="text-sm text-muted-foreground">
            <p>
              AIN used <strong>{marketListings.length}</strong> trusted real-time listings 
              across <strong>{totalSourceCount}</strong> sources to calculate your vehicle's value.
            </p>
            {marketAnchoredPrice && (
              <p className="mt-1">
                Weighted market value: <strong>${marketAnchoredPrice.toLocaleString()}</strong> 
                @ {confidenceScore}% confidence
              </p>
            )}
          </div>

          {/* Tier Summary Table */}
          <div>
            <h4 className="font-semibold mb-3">📈 Tier Summary</h4>
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-medium">Tier</th>
                    <th className="text-center p-3 font-medium">Listings</th>
                    <th className="text-right p-3 font-medium">Avg Price</th>
                    <th className="text-right p-3 font-medium">Trust %</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map(tier => {
                    const stats = tierAverages[tier];
                    const trustPercentage = Math.round((stats.totalTrust / Math.max(stats.count, 1)) * 100);
                    
                    return (
                      <tr key={tier} className="border-t">
                        <td className="p-3">
                          <Badge className={getTierBadgeColor(tier)}>
                            Tier {tier}
                          </Badge>
                        </td>
                        <td className="p-3 text-center">{stats.count}</td>
                        <td className="p-3 text-right font-medium">
                          {stats.avgPrice > 0 ? `$${Math.round(stats.avgPrice).toLocaleString()}` : 'N/A'}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <span className="text-xs">{trustPercentage}%</span>
                            <Progress value={trustPercentage} className="w-12 h-2" />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed Listings by Tier */}
          <div className="space-y-4">
            <h4 className="font-semibold">🔍 Detailed Listings</h4>
            
            {[1, 2, 3].map(tier => {
              const tierListings = listingsByTier[tier];
              if (!tierListings || tierListings.length === 0) return null;

              return (
                <div key={tier} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={getTierBadgeColor(tier)}>
                      Tier {tier}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {getTierLabel(tier)} ({tierListings.length} listings)
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {tierListings.slice(0, 6).map((listing, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded border">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{listing.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {listing.mileage > 0 && `${listing.mileage.toLocaleString()} mi • `}
                            {listing.source}
                            {marketListings.find(ml => ml.source === listing.source)?.sellerType === 'private' && (
                              <span className="ml-1 px-1 text-xs bg-orange-100 text-orange-700 rounded">Private</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress 
                              value={listing.trustWeight * 100} 
                              className="w-16 h-1" 
                            />
                            <span className="text-xs text-muted-foreground">
                              {Math.round(listing.trustWeight * 100)}% trust
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-right ml-3">
                          <div className="font-bold text-primary">
                            ${listing.price.toLocaleString()}
                          </div>
                          {listing.url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-0 h-auto text-xs"
                              onClick={() => window.open(listing.url, '_blank')}
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {tierListings.length > 6 && (
                    <div className="text-center mt-3">
                      <span className="text-sm text-muted-foreground">
                        ...and {tierListings.length - 6} more listings
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Enhanced Source Contributions (25+ Dealer + P2P Sources) */}
          {sourceContributions && sourceContributions.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">🏪 Market Source Contributions</h4>
              <div className="text-sm text-muted-foreground mb-3">
                AIN searched <strong>{sourceContributions.length}</strong> individual dealer and P2P sources for maximum market coverage.
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {sourceContributions.slice(0, 9).map((contribution, index) => (
                  <div key={index} className="border rounded p-3 bg-muted/10">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={
                        contribution.tier === 'Tier1' ? 'bg-green-100 text-green-800' :
                        contribution.tier === 'Tier2' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {contribution.tier}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(contribution.trustWeight * 100)}% trust
                      </span>
                    </div>
                    
                    <div className="font-medium text-sm flex items-center gap-1">
                      {contribution.source}
                      {(contribution as any).sellerType === 'private' && (
                        <Badge variant="outline" className="text-orange-600 border-orange-200 text-xs">
                          P2P
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{contribution.domain}</div>
                    
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs">
                        {contribution.listingsUsed} listing{contribution.listingsUsed !== 1 ? 's' : ''}
                      </span>
                      <span className="text-xs font-medium">
                        ${Math.round(contribution.avgPrice).toLocaleString()} avg
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {sourceContributions.length > 9 && (
                <div className="text-center mt-3">
                  <span className="text-sm text-muted-foreground">
                    ...and {sourceContributions.length - 9} more dealer sources analyzed
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Methodology Note */}
          <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded border">
            <strong>📚 Methodology:</strong> Our tier-weighted approach assigns higher trust scores to premium automotive sources (Tier 1), 
            verified dealer networks (Tier 2), and regional marketplaces (Tier 3). The final market value represents a 
            weighted average based on listing reliability and source quality.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MarketBreakdownPanel;