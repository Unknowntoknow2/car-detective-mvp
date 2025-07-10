import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

interface DataIntegrityPanelProps {
  dataSource?: {
    marketListings: number;
    calculationMethod: string;
    dataSourcesUsed: string[];
    confidenceBreakdown: string[];
    timestamp: string;
  };
  vehicleData?: {
    baseMSRP: number;
    msrpSource: string;
    dataCompleteness: {
      hasVin: boolean;
      hasRealLocation: boolean;
      hasActualMileage: boolean;
      usedRealMSRP: boolean;
      marketListingsCount: number;
      hasMarketRange: boolean;
    };
  };
  confidenceScore: number;
}

export const DataIntegrityPanel: React.FC<DataIntegrityPanelProps> = ({
  dataSource,
  vehicleData,
  confidenceScore
}) => {
  if (!dataSource && !vehicleData) return null;

  const getDataQualityIcon = (score: number) => {
    if (score >= 70) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (score >= 50) return <Info className="w-4 h-4 text-yellow-600" />;
    return <XCircle className="w-4 h-4 text-red-600" />;
  };

  const getDataQualityColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMSRPSourceDescription = (source: string) => {
    switch (source) {
      case 'trim_id_normalized': return 'Specific trim data with inflation adjustment';
      case 'database_fallback_normalized': return 'Vehicle database with inflation adjustment';
      case 'make_fallback': return 'Estimated based on manufacturer averages';
      case 'error_fallback': return 'Emergency fallback estimate';
      default: return source;
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          {getDataQualityIcon(confidenceScore)}
          Data Quality Report
          <Badge variant={confidenceScore >= 70 ? "default" : confidenceScore >= 50 ? "secondary" : "destructive"}>
            {confidenceScore}% Complete
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Data Sources Used */}
        {dataSource?.dataSourcesUsed && (
          <div>
            <h4 className="font-medium text-sm mb-2">Data Sources</h4>
            <div className="grid grid-cols-2 gap-2">
              {dataSource.dataSourcesUsed.map((source, index) => (
                <div key={index} className="text-xs bg-white rounded p-2">
                  <Badge variant="outline" className="text-xs">
                    {source}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Market Data Status */}
        {dataSource && (
          <div>
            <h4 className="font-medium text-sm mb-2">Market Analysis</h4>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>Comparable listings:</span>
                <span className={dataSource.marketListings >= 3 ? 'text-green-600' : 'text-red-600'}>
                  {dataSource.marketListings || 0}
                  {dataSource.marketListings >= 3 && ' ✓'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Calculation method:</span>
                <span className="capitalize">{(dataSource.calculationMethod || 'unknown').replace('_', ' ')}</span>
              </div>
            </div>
          </div>
        )}

        {/* MSRP Transparency */}
        {vehicleData && vehicleData.baseMSRP && (
          <div>
            <h4 className="font-medium text-sm mb-2">Base Value Source</h4>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>MSRP:</span>
                <span>${(vehicleData.baseMSRP || 0).toLocaleString()}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {getMSRPSourceDescription(vehicleData.msrpSource || 'unknown')}
              </div>
              {vehicleData.dataCompleteness && !vehicleData.dataCompleteness.usedRealMSRP && (
                <div className="flex items-center gap-1 text-amber-600">
                  <AlertTriangle className="w-3 h-3" />
                  <span className="text-xs">Using estimated MSRP</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Confidence Breakdown */}
        {dataSource?.confidenceBreakdown && (
          <div>
            <h4 className="font-medium text-sm mb-2">Confidence Breakdown</h4>
            <div className="space-y-1">
              {dataSource.confidenceBreakdown.map((item, index) => (
                <div key={index} className="text-xs text-muted-foreground">
                  • {item}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data Completeness Warnings */}
        {vehicleData?.dataCompleteness && (
          <div>
            <h4 className="font-medium text-sm mb-2">Data Quality Issues</h4>
            <div className="space-y-1">
              {!vehicleData.dataCompleteness.hasActualMileage && (
                <div className="flex items-center gap-1 text-amber-600 text-xs">
                  <AlertTriangle className="w-3 h-3" />
                  <span>No actual mileage provided</span>
                </div>
              )}
              {!vehicleData.dataCompleteness.hasRealLocation && (
                <div className="flex items-center gap-1 text-amber-600 text-xs">
                  <AlertTriangle className="w-3 h-3" />
                  <span>No location data for regional adjustments</span>
                </div>
              )}
              {vehicleData.dataCompleteness.marketListingsCount < 3 && (
                <div className="flex items-center gap-1 text-red-600 text-xs">
                  <XCircle className="w-3 h-3" />
                  <span>Insufficient market data for accurate pricing</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Last Updated */}
        {dataSource?.timestamp && (
          <div className="pt-2 border-t text-xs text-muted-foreground">
            Calculated: {new Date(dataSource.timestamp).toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataIntegrityPanel;