
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UnifiedLookupTabs } from '@/components/lookup/UnifiedLookupTabs';
import { ValuationEngineTestComponent } from '@/components/test/ValuationEngineTestComponent';
import { OpenAIMarketSearchTestComponent } from '@/components/test/OpenAIMarketSearchTestComponent';
import { MarketSearchTest } from '@/components/debug/MarketSearchTest';


export default function ValuationPage() {
  const { vin } = useParams<{ vin?: string }>();

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">

      {/* OpenAI Market Search Validation Test */}
      <Card className="border-dashed border-2 border-blue-300 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-700">🔍 OpenAI Market Search Validation (Prompt 2.2)</CardTitle>
          <p className="text-blue-600 text-sm">
            FIRST: Validate OpenAI-powered live web search for vehicle listings.
          </p>
        </CardHeader>
        <CardContent>
          <OpenAIMarketSearchTestComponent />
        </CardContent>
      </Card>

      {/* Market Search Debug Test */}
      <Card className="border-dashed border-2 border-red-300 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700">🧪 Market Search Debug</CardTitle>
          <p className="text-red-600 text-sm">
            SECOND: If OpenAI validation passes, test the full market search flow.
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
