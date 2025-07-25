import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ChevronDown, 
  ChevronRight, 
  Clock, 
  Database, 
  Search, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  Eye,
  Bug
} from 'lucide-react';
import { PrioritizedValuationData } from '@/utils/followUpDataPrioritization';

interface AuditPanelProps {
  valuationData: {
    id: string;
    vin: string;
    estimatedValue: number;
    confidenceScore: number;
    marketListings: any[];
    valuationMethod?: string;
    isUsingFallbackMethod?: boolean;
  };
  prioritizedData?: PrioritizedValuationData;
  debugMode?: boolean;
}

export function ValuationAuditPanel({ 
  valuationData, 
  prioritizedData,
  debugMode = false 
}: AuditPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  if (!debugMode) {
    return null;
  }

  const auditSections = [
    {
      id: 'data-sources',
      title: 'Data Sources',
      icon: Database,
      color: 'blue',
      items: [
        {
          label: 'Market Listings',
          value: `${valuationData.marketListings.length} found`,
          status: valuationData.marketListings.length > 0 ? 'success' : 'warning'
        },
        {
          label: 'Valuation Method',
          value: valuationData.valuationMethod || 'standard',
          status: valuationData.isUsingFallbackMethod ? 'warning' : 'success'
        },
        {
          label: 'Follow-up Data',
          value: prioritizedData?.followUpCompleted ? 'Completed' : 'Pending',
          status: prioritizedData?.followUpCompleted ? 'success' : 'info'
        }
      ]
    },
    {
      id: 'confidence-breakdown',
      title: 'Confidence Analysis',
      icon: TrendingUp,
      color: 'green',
      items: [
        {
          label: 'Overall Score',
          value: `${valuationData.confidenceScore}%`,
          status: valuationData.confidenceScore >= 80 ? 'success' : 
                  valuationData.confidenceScore >= 60 ? 'warning' : 'error'
        },
        {
          label: 'Data Quality',
          value: prioritizedData?.dataSource === 'user_followup' ? 'High' : 'Medium',
          status: prioritizedData?.dataSource === 'user_followup' ? 'success' : 'warning'
        },
        {
          label: 'Market Coverage',
          value: valuationData.marketListings.length >= 5 ? 'Good' : 'Limited',
          status: valuationData.marketListings.length >= 5 ? 'success' : 'warning'
        }
      ]
    },
    {
      id: 'field-prioritization',
      title: 'Field Prioritization',
      icon: Search,
      color: 'purple',
      items: prioritizedData ? [
        {
          label: 'Mileage Source',
          value: prioritizedData.prioritizedFields.mileage.source.replace('_', ' '),
          status: prioritizedData.prioritizedFields.mileage.confidence === 'high' ? 'success' : 'warning'
        },
        {
          label: 'Condition Source',
          value: prioritizedData.prioritizedFields.condition.source.replace('_', ' '),
          status: prioritizedData.prioritizedFields.condition.confidence === 'high' ? 'success' : 'warning'
        },
        {
          label: 'Location Source',
          value: prioritizedData.prioritizedFields.zipCode.source.replace('_', ' '),
          status: prioritizedData.prioritizedFields.zipCode.confidence === 'high' ? 'success' : 'warning'
        }
      ] : []
    },
    {
      id: 'processing-timeline',
      title: 'Processing Timeline',
      icon: Clock,
      color: 'orange',
      items: [
        {
          label: 'VIN Decode',
          value: 'Completed',
          status: 'success'
        },
        {
          label: 'Market Search',
          value: valuationData.marketListings.length > 0 ? 'Found Results' : 'No Results',
          status: valuationData.marketListings.length > 0 ? 'success' : 'warning'
        },
        {
          label: 'Valuation Engine',
          value: 'Completed',
          status: 'success'
        }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card className="border-dashed border-2 border-gray-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bug className="h-5 w-5 text-gray-600" />
            <CardTitle className="text-lg">Valuation Audit Panel</CardTitle>
            <Badge variant="outline" className="text-xs">
              Debug Mode
            </Badge>
          </div>
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

      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {auditSections.map((section) => {
                const IconComponent = section.icon;
                const sectionExpanded = activeSection === section.id;
                
                return (
                  <div key={section.id} className="border rounded-lg">
                    <button
                      onClick={() => setActiveSection(sectionExpanded ? null : section.id)}
                      className="w-full p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <IconComponent className={`h-4 w-4 text-${section.color}-500`} />
                        <span className="font-medium text-sm">{section.title}</span>
                        <Badge variant="secondary" className="text-xs">
                          {section.items.length}
                        </Badge>
                      </div>
                      {sectionExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    
                    {sectionExpanded && (
                      <div className="px-3 pb-3 border-t bg-gray-50/50">
                        <div className="space-y-2 mt-2">
                          {section.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between text-sm"
                            >
                              <div className="flex items-center gap-2">
                                {getStatusIcon(item.status)}
                                <span className="text-gray-700">{item.label}</span>
                              </div>
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${getStatusColor(item.status)}`}
                              >
                                {item.value}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* Raw Data Section */}
              <div className="border rounded-lg">
                <button
                  onClick={() => setActiveSection(activeSection === 'raw-data' ? null : 'raw-data')}
                  className="w-full p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-sm">Raw Data Inspector</span>
                  </div>
                  {activeSection === 'raw-data' ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                
                {activeSection === 'raw-data' && (
                  <div className="px-3 pb-3 border-t bg-gray-50/50">
                    <pre className="text-xs bg-white p-2 rounded mt-2 overflow-auto max-h-40 border">
                      {JSON.stringify({
                        valuationId: valuationData.id,
                        vin: valuationData.vin,
                        estimatedValue: valuationData.estimatedValue,
                        confidenceScore: valuationData.confidenceScore,
                        marketListingsCount: valuationData.marketListings.length,
                        prioritizedData: prioritizedData
                      }, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}