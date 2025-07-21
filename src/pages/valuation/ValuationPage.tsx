
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UnifiedLookupTabs } from '@/components/lookup/UnifiedLookupTabs';
import { ValuationEngineTestComponent } from '@/components/test/ValuationEngineTestComponent';
import { MarketSearchTest } from '@/components/debug/MarketSearchTest';
import { EdgeFunctionTest } from '@/components/debug/EdgeFunctionTest';

export default function ValuationPage() {
  const { vin } = useParams<{ vin?: string }>();

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Edge Function Test - FIRST PRIORITY */}
      <Card className="border-dashed border-2 border-blue-300 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-700">🚀 Function Deployment Test</CardTitle>
          <p className="text-blue-600 text-sm">
            FIRST: Test if the openai-web-search function is properly deployed.
          </p>
        </CardHeader>
        <CardContent>
          <EdgeFunctionTest />
        </CardContent>
      </Card>

      {/* Market Search Debug Test */}
      <Card className="border-dashed border-2 border-red-300 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700">🧪 Market Search Debug</CardTitle>
          <p className="text-red-600 text-sm">
            SECOND: If function test passes, test the full market search flow.
          </p>
        </CardHeader>
        <CardContent>
          <MarketSearchTest />
        </CardContent>
      </Card>

      {/* Test Component for Phase 1B */}
      <Card className="border-dashed border-2 border-orange-300 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-orange-700">🚧 Complete Valuation Test</CardTitle>
          <p className="text-orange-600 text-sm">
            THIRD: If market search works, test the complete valuation engine.
          </p>
        </CardHeader>
        <CardContent>
          <ValuationEngineTestComponent />
        </CardContent>
      </Card>

      {/* Main Valuation Interface */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Valuation</CardTitle>
        </CardHeader>
        <CardContent>
          <UnifiedLookupTabs />
        </CardContent>
      </Card>
    </div>
  );
}
