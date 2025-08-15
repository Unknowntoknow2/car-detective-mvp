import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ChevronDown, 
  ChevronRight, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Clock, 
  Database,
  Filter,
  Target,
  TrendingUp
} from 'lucide-react';
import { ListingAuditResult } from '@/services/valuation/listingAuditService';
import { AnalysisMetrics } from '@/utils/valuation/listingInclusionAnalyzer';

interface ProcessAuditStep {
  id: string;
  step: string;
  status: 'completed' | 'pending' | 'failed' | 'skipped';
  timestamp: string;
  details?: string;
  confidence?: number;
  subSteps?: ProcessAuditStep[];
  metadata?: Record<string, any>;
}

interface ProcessAuditTrailProps {
  steps: ProcessAuditStep[];
  listingAudits?: ListingAuditResult[];
  analysisMetrics?: AnalysisMetrics;
  fallbackMethod?: string;
  finalConfidence?: number;
}

export const ProcessAuditTrail: React.FC<ProcessAuditTrailProps> = ({
  steps,
  listingAudits = [],
  analysisMetrics,
  fallbackMethod,
  finalConfidence
}) => {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [showListingDetails, setShowListingDetails] = useState(false);

  const toggleStep = (stepId: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const getStatusIcon = (status: ProcessAuditStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'skipped':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: ProcessAuditStep['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'skipped':
        return <Badge variant="secondary">Skipped</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const getExclusionReasonColor = (reason?: string) => {
    if (!reason) return 'text-gray-500';
    if (reason.includes('quality')) return 'text-red-600';
    if (reason.includes('radius')) return 'text-yellow-600';
    if (reason.includes('outlier')) return 'text-orange-600';
    if (reason.includes('stale')) return 'text-purple-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Main Process Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Valuation Process Audit Trail
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.id}>
                <Collapsible 
                  open={expandedSteps.has(step.id)}
                  onOpenChange={() => toggleStep(step.id)}
                >
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between p-0 h-auto"
                    >
                      <div className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(step.status)}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">{step.step}</h4>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(step.status)}
                              {expandedSteps.has(step.id) ? 
                                <ChevronDown className="h-4 w-4" /> : 
                                <ChevronRight className="h-4 w-4" />
                              }
                            </div>
                          </div>
                          {step.details && (
                            <p className="text-sm text-muted-foreground mt-1">{step.details}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>{new Date(step.timestamp).toLocaleString()}</span>
                            {step.confidence && (
                              <span>Confidence: {Math.round(step.confidence)}%</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="ml-7 mt-2 p-3 bg-gray-50 rounded">
                      {step.subSteps && step.subSteps.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="font-medium text-sm">Sub-steps:</h5>
                          {step.subSteps.map((subStep, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              {getStatusIcon(subStep.status)}
                              <span>{subStep.step}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(subStep.timestamp).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {step.metadata && (
                        <div className="mt-3">
                          <h5 className="font-medium text-sm mb-2">Metadata:</h5>
                          <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                            {JSON.stringify(step.metadata, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Metrics Summary */}
      {analysisMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Listing Analysis Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-600">
                  {analysisMetrics.totalListings}
                </div>
                <div className="text-sm text-blue-800">Total Listings</div>
              </div>
              
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">
                  {analysisMetrics.includedListings}
                </div>
                <div className="text-sm text-green-800">Included in Comp Set</div>
              </div>
              
              <div className="text-center p-3 bg-red-50 rounded">
                <div className="text-2xl font-bold text-red-600">
                  {analysisMetrics.totalListings - analysisMetrics.includedListings}
                </div>
                <div className="text-sm text-red-800">Excluded</div>
              </div>
              
              <div className="text-center p-3 bg-purple-50 rounded">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(analysisMetrics.averageQualityScore)}
                </div>
                <div className="text-sm text-purple-800">Avg Quality Score</div>
              </div>
            </div>

            {/* Exclusion Breakdown */}
            <div className="mt-4 p-3 border rounded">
              <h4 className="font-medium text-sm mb-2">Exclusion Reasons:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div>Quality: <span className="font-medium">{analysisMetrics.excludedByQuality}</span></div>
                <div>Radius: <span className="font-medium">{analysisMetrics.excludedByRadius}</span></div>
                <div>Outlier: <span className="font-medium">{analysisMetrics.excludedByOutlier}</span></div>
                <div>Stale: <span className="font-medium">{analysisMetrics.excludedByStale}</span></div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Individual Listing Audits */}
      {listingAudits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Individual Listing Audits ({listingAudits.length})
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowListingDetails(!showListingDetails)}
              >
                {showListingDetails ? 'Hide Details' : 'Show Details'}
              </Button>
            </CardTitle>
          </CardHeader>
          
          {showListingDetails && (
            <CardContent>
              <div className="space-y-4">
                {listingAudits.map((audit, index) => (
                  <div key={index} className="border rounded p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-sm">
                          {audit.vehicleInfo.year} {audit.vehicleInfo.make} {audit.vehicleInfo.model}
                        </h4>
                        <p className="text-xs text-muted-foreground">{audit.source}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          ${audit.advertisedPrice?.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Quality: {audit.qualityScore}/100
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      <div>
                        VIN: <span className="font-mono">{audit.vin?.substring(0, 8)}...</span>
                      </div>
                      <div>
                        Miles: <span className="font-medium">{audit.odometer?.toLocaleString()}</span>
                      </div>
                      <div>
                        Photos: <span className="font-medium">{audit.photoCount}</span>
                      </div>
                      <div>
                        Trust: <span className="font-medium capitalize">{audit.trustTier}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {audit.includedInCompSet ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Included
                          </Badge>
                        ) : (
                          <Badge variant="destructive">Excluded</Badge>
                        )}
                        
                        {audit.matchToSubject === 'exact' && (
                          <Badge variant="secondary">Exact VIN Match</Badge>
                        )}
                      </div>
                      
                      {audit.exclusionReason && (
                        <span className={`text-xs ${getExclusionReasonColor(audit.exclusionReason)}`}>
                          {audit.exclusionReason}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Fallback & Final Result Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Final Result Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 border rounded">
              <div className="text-sm text-muted-foreground">Method Used</div>
              <div className="font-medium">
                {fallbackMethod === 'none' ? 'Market Data' : 
                 fallbackMethod === 'depreciation-curve' ? 'Depreciation Model' :
                 fallbackMethod === 'broadened-search' ? 'Broadened Search' :
                 'Hybrid Approach'}
              </div>
            </div>
            
            <div className="p-3 border rounded">
              <div className="text-sm text-muted-foreground">Final Confidence</div>
              <div className="font-medium text-lg">
                {finalConfidence ? `${Math.round(finalConfidence)}%` : 'N/A'}
              </div>
            </div>
            
            <div className="p-3 border rounded">
              <div className="text-sm text-muted-foreground">Data Quality</div>
              <div className="font-medium">
                {analysisMetrics ? 
                  `${analysisMetrics.includedListings}/${analysisMetrics.totalListings} listings used` :
                  'N/A'
                }
              </div>
            </div>
          </div>
          
          {fallbackMethod && fallbackMethod !== 'none' && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  Fallback Method Applied
                </span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Insufficient market data available. Used {fallbackMethod} to generate valuation.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessAuditTrail;