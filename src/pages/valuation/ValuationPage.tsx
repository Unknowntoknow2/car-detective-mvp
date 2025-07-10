
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UnifiedLookupTabs } from '@/components/lookup/UnifiedLookupTabs';
import { ValuationEngineTestComponent } from '@/components/test/ValuationEngineTestComponent';

export default function ValuationPage() {
  const { vin } = useParams<{ vin?: string }>();

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
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
