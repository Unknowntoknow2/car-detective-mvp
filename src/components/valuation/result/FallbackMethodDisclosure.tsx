import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface FallbackMethodDisclosureProps {
  confidenceScore: number;
  explanation: string;
}

export function FallbackMethodDisclosure({ confidenceScore, explanation }: FallbackMethodDisclosureProps) {
  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <AlertTriangle className="h-5 w-5" />
          Fallback Pricing Method
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-orange-700">
          <p>{explanation}</p>
        </div>
        
        <div className="text-xs text-orange-600 space-y-1">
          <p><strong>Note:</strong> Confidence is limited to {Math.min(confidenceScore, 60)}% when using fallback pricing.</p>
          <p>This valuation is based on MSRP-adjusted depreciation modeling rather than current market data.</p>
        </div>
      </CardContent>
    </Card>
  );
}