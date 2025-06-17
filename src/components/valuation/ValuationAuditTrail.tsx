
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Info, Clock } from 'lucide-react';
import { AICondition } from '@/types/photo';

interface AuditStep {
  id: string;
  step: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  details?: string;
  confidence?: number;
}

interface ValuationAuditTrailProps {
  steps: AuditStep[];
  aiCondition?: AICondition;
}

export const ValuationAuditTrail: React.FC<ValuationAuditTrailProps> = ({
  steps,
  aiCondition,
}) => {
  const getStatusIcon = (status: AuditStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: AuditStep['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const aiConfidenceScore = aiCondition?.confidence || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Valuation Audit Trail
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start gap-3 pb-4 border-b last:border-b-0">
              <div className="flex-shrink-0 mt-1">
                {getStatusIcon(step.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{step.step}</h4>
                  {getStatusBadge(step.status)}
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
          ))}
          
          {aiCondition && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h5 className="font-medium text-sm text-blue-900 mb-2">AI Assessment Summary</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Condition Analysis:</span>
                  <span className="font-medium text-blue-900">{aiCondition.condition || aiCondition.description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">AI Confidence:</span>
                  <span className="font-medium text-blue-900">{Math.round(aiConfidenceScore)}%</span>
                </div>
                {aiCondition.issuesDetected && aiCondition.issuesDetected.length > 0 && (
                  <div className="mt-2">
                    <span className="text-blue-700">Issues Detected:</span>
                    <ul className="list-disc list-inside ml-2 mt-1">
                      {aiCondition.issuesDetected.map((issue: string, i: number) => (
                        <li key={i} className="text-blue-800">{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ValuationAuditTrail;
