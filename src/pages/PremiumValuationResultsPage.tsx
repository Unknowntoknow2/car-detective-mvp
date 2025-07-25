/**
 * Premium Vehicle Valuation Results Page
 * Enterprise-grade React component with audit-ready design
 */

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, TrendingDown, DollarSign, MapPin, Calendar, 
  CheckCircle, AlertTriangle, Info, Download, Share, 
  Eye, FileText, BarChart3, PieChart, Activity, Star,
  Shield, Zap, Target, Award
} from 'lucide-react';
import { ValuationResult } from '@/valuation/types/core';
import { createValuationEngine } from '@/valuation';
import { PremiumValuationChart } from '@/components/premium/PremiumValuationChart';
import { MarketComparison } from '@/components/premium/MarketComparison';
import { ConfidenceIndicator } from '@/components/premium/ConfidenceIndicator';
import { AdjustmentBreakdown } from '@/components/premium/AdjustmentBreakdown';
import { ExportOptions } from '@/components/premium/ExportOptions';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { formatCurrency } from '@/utils/formatCurrency';

interface PremiumResultsPageProps {
  className?: string;
}

export function PremiumResultsPage({ className }: PremiumResultsPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [valuation, setValuation] = useState<ValuationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      loadValuationData(id);
    } else {
      setError('No valuation ID provided');
      setLoading(false);
    }
  }, [id]);

  const loadValuationData = async (valuationId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real implementation, this would fetch from your backend
      // For now, we'll simulate the data structure
      const mockValuation: ValuationResult = {
        id: valuationId,
        estimatedValue: 24500,
        priceRange: [22500, 26500],
        confidenceScore: 87,
        valuationMethod: 'MARKET_DATA_PRIMARY',
        
        baseValuation: {
          value: 25000,
          source: 'ML_MODEL',
          confidence: 0.85,
          dataPointsUsed: 45
        },
        
        adjustments: [
          {
            factor: 'Vehicle Condition',
            impact: -800,
            percentage: -3.2,
            description: 'Good condition with minor wear (78/100 score)',
            confidence: 0.9,
            category: 'condition'
          },
          {
            factor: 'Mileage',
            impact: 300,
            percentage: 1.2,
            description: 'Below average mileage for year',
            confidence: 0.95,
            category: 'mileage'
          },
          {
            factor: 'Market Conditions',
            impact: 0,
            percentage: 0,
            description: 'Neutral market conditions',
            confidence: 0.8,
            category: 'market'
          }
        ],
        
        marketInsights: {
          avgMarketplacePrice: 24800,
          listingCount: 23,
          priceVariance: 0.15,
          demandIndex: 75,
          timeOnMarket: 28,
          competitivePosition: 'at_market',
          priceRecommendation: 'Vehicle is priced competitively at market average'
        },
        
        confidenceBreakdown: {
          dataQuality: 88,
          marketDataAvailability: 85,
          vehicleDataCompleteness: 90,
          mlModelConfidence: 87,
          overallConfidence: 87,
          factors: [
            {
              factor: 'Market Data Quality',
              score: 88,
              impact: 'high',
              description: '23 comparable vehicles found within 50 miles'
            },
            {
              factor: 'Vehicle Information',
              score: 90,
              impact: 'high',
              description: 'Complete vehicle details with service history'
            },
            {
              factor: 'ML Model Accuracy',
              score: 87,
              impact: 'medium',
              description: 'High confidence prediction based on historical data'
            }
          ],
          recommendations: [
            'High confidence valuation suitable for all purposes',
            'Market data supports accurate pricing assessment',
            'Vehicle details are comprehensive and verified'
          ]
        },
        
        metadata: {
          timestamp: new Date().toISOString(),
          processingTimeMs: 2847,
          version: '2.0.0',
          dataSourcesUsed: ['Cars.com', 'AutoTrader', 'CarGurus']
        }
      };
      
      setValuation(mockValuation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load valuation data');
    } finally {
      setLoading(false);
    }
  };

  const confidenceLevel = useMemo(() => {
    if (!valuation) return 'unknown';
    if (valuation.confidenceScore >= 85) return 'high';
    if (valuation.confidenceScore >= 70) return 'medium';
    return 'low';
  }, [valuation?.confidenceScore]);

  const confidenceColor = {
    high: 'text-green-600 bg-green-50 border-green-200',
    medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    low: 'text-red-600 bg-red-50 border-red-200',
    unknown: 'text-gray-600 bg-gray-50 border-gray-200'
  }[confidenceLevel];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="large" />
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">Analyzing Vehicle Data</h3>
            <p className="text-gray-600">Processing market data and calculating valuation...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !valuation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Valuation Not Found</h3>
                <p className="text-gray-600">{error || 'The requested valuation could not be loaded.'}</p>
              </div>
              <Button onClick={() => navigate('/')} variant="outline">
                Return Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 ${className}`}>
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Premium Valuation Report</h1>
                <p className="text-gray-600">Enterprise-grade vehicle assessment</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className={`${confidenceColor} font-medium`}>
                <Shield className="h-3 w-3 mr-1" />
                {confidenceLevel.toUpperCase()} CONFIDENCE
              </Badge>
              <ExportOptions valuation={valuation} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Executive Summary */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Executive Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Primary Valuation */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="text-center lg:text-left">
                    <div className="inline-flex items-center space-x-2 mb-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                        Estimated Market Value
                      </span>
                    </div>
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {formatCurrency(valuation.estimatedValue)}
                    </div>
                    <div className="text-lg text-gray-600">
                      Range: {formatCurrency(valuation.priceRange[0])} - {formatCurrency(valuation.priceRange[1])}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-600 mb-1">Market Position</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {valuation.marketInsights.competitivePosition.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-600 mb-1">Demand Index</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {valuation.marketInsights.demandIndex}/100
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confidence Indicator */}
                <div className="lg:col-span-1">
                  <ConfidenceIndicator 
                    score={valuation.confidenceScore}
                    breakdown={valuation.confidenceBreakdown}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="adjustments" className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>Adjustments</span>
              </TabsTrigger>
              <TabsTrigger value="market" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Market</span>
              </TabsTrigger>
              <TabsTrigger value="confidence" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Confidence</span>
              </TabsTrigger>
              <TabsTrigger value="audit" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Audit Trail</span>
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <PremiumValuationChart valuation={valuation} />
                    <MarketComparison marketInsights={valuation.marketInsights} />
                  </div>
                </TabsContent>

                <TabsContent value="adjustments" className="space-y-6">
                  <AdjustmentBreakdown 
                    baseValue={valuation.baseValuation.value}
                    adjustments={valuation.adjustments}
                    finalValue={valuation.estimatedValue}
                  />
                </TabsContent>

                <TabsContent value="market" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Activity className="h-5 w-5 text-blue-600" />
                          <span>Market Activity</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="text-sm font-medium text-gray-600 mb-1">Available Listings</div>
                            <div className="text-2xl font-bold text-gray-900">
                              {valuation.marketInsights.listingCount}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-600 mb-1">Avg. Time on Market</div>
                            <div className="text-2xl font-bold text-gray-900">
                              {valuation.marketInsights.timeOnMarket} days
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <PieChart className="h-5 w-5 text-green-600" />
                          <span>Price Analysis</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="text-sm font-medium text-gray-600 mb-1">Market Average</div>
                            <div className="text-2xl font-bold text-gray-900">
                              {formatCurrency(valuation.marketInsights.avgMarketplacePrice)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-600 mb-1">Price Variance</div>
                            <div className="text-2xl font-bold text-gray-900">
                              {(valuation.marketInsights.priceVariance * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Zap className="h-5 w-5 text-orange-600" />
                          <span>Demand Metrics</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="text-sm font-medium text-gray-600 mb-1">Demand Index</div>
                            <div className="text-2xl font-bold text-gray-900">
                              {valuation.marketInsights.demandIndex}/100
                            </div>
                          </div>
                          <div>
                            <Progress 
                              value={valuation.marketInsights.demandIndex} 
                              className="h-2" 
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="confidence" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Confidence Factors</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {valuation.confidenceBreakdown.factors.map((factor, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-900">
                                  {factor.factor}
                                </span>
                                <Badge variant={factor.impact === 'high' ? 'default' : 'secondary'}>
                                  {factor.score}/100
                                </Badge>
                              </div>
                              <Progress value={factor.score} className="h-2" />
                              <p className="text-xs text-gray-600">{factor.description}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {valuation.confidenceBreakdown.recommendations.map((rec, index) => (
                            <Alert key={index}>
                              <Info className="h-4 w-4" />
                              <AlertDescription>{rec}</AlertDescription>
                            </Alert>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="audit" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Valuation Audit Trail</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="font-medium text-gray-600">Valuation ID</div>
                            <div className="font-mono text-gray-900">{valuation.id}</div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-600">Generated</div>
                            <div className="text-gray-900">
                              {new Date(valuation.metadata.timestamp).toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-600">Processing Time</div>
                            <div className="text-gray-900">{valuation.metadata.processingTimeMs}ms</div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-600">Engine Version</div>
                            <div className="text-gray-900">v{valuation.metadata.version}</div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <div className="font-medium text-gray-600 mb-2">Data Sources</div>
                          <div className="flex flex-wrap gap-2">
                            {valuation.metadata.dataSourcesUsed.map((source, index) => (
                              <Badge key={index} variant="outline">
                                {source}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}