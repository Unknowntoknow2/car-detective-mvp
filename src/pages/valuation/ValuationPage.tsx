
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UnifiedLookupTabs } from '@/components/lookup/UnifiedLookupTabs';
import { ValuationEngineTestComponent } from '@/components/test/ValuationEngineTestComponent';
import { MarketSearchTest } from '@/components/debug/MarketSearchTest';

export default function ValuationPage() {
  const { vin } = useParams<{ vin?: string }>();

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Market Search Debug Test - TEMPORARY */}
      <Card className="border-dashed border-2 border-red-300 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700">🧪 Market Search Debug</CardTitle>
          <p className="text-red-600 text-sm">
            Debugging market search functionality. Remove this after fixing the issue.
          </p>
        </CardHeader>
        <CardContent>
          <MarketSearchTest />
        </CardContent>
      </Card>

      {/* Test Component for Phase 1B - Remove this after testing */}
      <Card className="border-dashed border-2 border-orange-300 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-orange-700">🚧 Phase 1B Testing</CardTitle>
          <p className="text-orange-600 text-sm">
            Testing the unified valuation engine integration. This will be removed once testing is complete.
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
