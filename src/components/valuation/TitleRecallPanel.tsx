import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, ExternalLink, Shield, AlertCircle } from 'lucide-react';

interface TitleRecallPanelProps {
  titleRecallInfo?: {
    titleStatus: 'Clean' | 'Salvage' | 'Rebuilt' | 'Lemon' | 'Flood' | 'Stolen' | 'Unknown';
    brandedDetails?: string;
    recalls: {
      id: string;
      component: string;
      summary: string;
      riskLevel: 'Critical' | 'Important' | 'Informational';
      recallDate: string;
      resolved?: boolean;
    }[];
    oemRepairLinks?: string[];
    lastChecked: string;
  };
}

export const TitleRecallPanel: React.FC<TitleRecallPanelProps> = ({ titleRecallInfo }) => {
  if (!titleRecallInfo) {
    return null;
  }

  const { titleStatus, brandedDetails, recalls, oemRepairLinks } = titleRecallInfo;

  const getTitleStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'clean': return 'text-green-600 bg-green-50 border-green-200';
      case 'salvage':
      case 'flood': return 'text-red-600 bg-red-50 border-red-200';
      case 'rebuilt':
      case 'lemon': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'stolen': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTitleIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'clean': return <CheckCircle className="h-5 w-5" />;
      case 'salvage':
      case 'flood':
      case 'stolen':
      case 'lemon': return <AlertTriangle className="h-5 w-5" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'important': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <Shield className="h-4 w-4 text-blue-500" />;
    }
  };

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'critical': return 'destructive' as const;
      case 'important': return 'secondary' as const;
      default: return 'outline' as const;
    }
  };

  const unresolvedRecalls = recalls.filter(r => !r.resolved);
  const criticalRecalls = unresolvedRecalls.filter(r => r.riskLevel === 'Critical');

  return (
    <div className="space-y-4">
      {/* Title Status Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5" />
            Title Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`flex items-center gap-3 p-3 rounded-lg border ${getTitleStatusColor(titleStatus)}`}>
            {getTitleIcon(titleStatus)}
            <div className="flex-1">
              <div className="font-semibold text-sm">{titleStatus} Title</div>
              {brandedDetails && (
                <div className="text-xs opacity-80 mt-1">{brandedDetails}</div>
              )}
            </div>
            {titleStatus !== 'Clean' && (
              <Badge variant="outline" className="text-xs">
                Value Impact
              </Badge>
            )}
          </div>
          
          {titleStatus === 'Clean' ? (
            <p className="text-sm text-muted-foreground mt-3">
              ✅ Clean title with no reported damage or branding. No value penalties applied.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground mt-3">
              ⚠️ This title status may significantly impact resale value and insurability. 
              Consider inspection before purchase.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Recalls Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="h-5 w-5" />
            Safety Recalls
            {unresolvedRecalls.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unresolvedRecalls.length} Open
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recalls.length === 0 ? (
            <div className="flex items-center gap-3 p-3 rounded-lg border border-green-200 bg-green-50">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-semibold text-sm text-green-800">No Recalls Found</div>
                <div className="text-xs text-green-700">No open safety recalls for this vehicle.</div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Critical Recalls Alert */}
              {criticalRecalls.length > 0 && (
                <div className="p-3 rounded-lg border border-red-200 bg-red-50">
                  <div className="flex items-center gap-2 text-red-800 font-semibold text-sm mb-2">
                    <AlertTriangle className="h-4 w-4" />
                    {criticalRecalls.length} Critical Recall(s) - Immediate Attention Required
                  </div>
                  <p className="text-xs text-red-700">
                    These recalls affect critical safety systems. Vehicle should not be driven until repairs are completed.
                  </p>
                </div>
              )}

              {/* Recall List */}
              <div className="space-y-2">
                {recalls.slice(0, 3).map((recall, index) => (
                  <div key={recall.id} className="p-3 rounded-lg border bg-card">
                    <div className="flex items-start gap-3">
                      {getRiskIcon(recall.riskLevel)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{recall.component}</span>
                          <Badge variant={getRiskBadgeVariant(recall.riskLevel)} className="text-xs">
                            {recall.riskLevel}
                          </Badge>
                          {recall.resolved && (
                            <Badge variant="outline" className="text-xs text-green-600">
                              Resolved
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{recall.summary}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Recall ID: {recall.id}</span>
                          <span>Issued: {new Date(recall.recallDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {recalls.length > 3 && (
                  <div className="text-center py-2">
                    <Badge variant="outline" className="text-xs">
                      +{recalls.length - 3} more recalls
                    </Badge>
                  </div>
                )}
              </div>

              {/* OEM Repair Links */}
              {oemRepairLinks && oemRepairLinks.length > 0 && (
                <div className="pt-3 border-t">
                  <div className="space-y-2">
                    {oemRepairLinks.map((link, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full justify-between"
                        onClick={() => window.open(link, '_blank')}
                      >
                        <span>Schedule Recall Repair</span>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="text-xs text-muted-foreground mt-4 pt-3 border-t">
            Data last checked: {new Date(titleRecallInfo.lastChecked).toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};