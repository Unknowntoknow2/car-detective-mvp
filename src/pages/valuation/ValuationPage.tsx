
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UnifiedLookupTabs } from '@/components/lookup/UnifiedLookupTabs';
import { ValuationEngineTestComponent } from '@/components/test/ValuationEngineTestComponent';
// import { OpenAIMarketSearchTestComponent } from '@/components/test/OpenAIMarketSearchTestComponent';
// import { ListingAnchoringValidationComponent } from '@/components/test/ListingAnchoringValidationComponent';
import { UIResultsDisplayValidationComponent } from '@/components/test/UIResultsDisplayValidationComponent';
import { PDFShareValidationComponent } from '@/components/test/PDFShareValidationComponent';


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
          <p className="text-center text-muted-foreground">Component temporarily disabled due to missing dependencies</p>
        </CardContent>
      </Card>

      {/* Listing Anchoring Validation Test */}
      <Card className="border-dashed border-2 border-green-300 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-700">🎯 Listing Anchoring + Confidence Logic Validation (Prompt 2.3)</CardTitle>
          <p className="text-green-600 text-sm">
            SECOND: Validate that the valuation engine correctly uses real listings for price anchoring and confidence scoring.
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Component temporarily disabled due to missing dependencies</p>
        </CardContent>
      </Card>

      {/* UI Results Display Validation Test */}
      <Card className="border-dashed border-2 border-purple-300 bg-purple-50">
        <CardHeader>
          <CardTitle className="text-purple-700">🎯 UI Results Page Display Validation (Prompt 2.4)</CardTitle>
          <p className="text-purple-600 text-sm">
            THIRD: Validate that ResultsPage correctly renders valuation results, market listings, confidence scores, and PDF/share functionality.
          </p>
        </CardHeader>
        <CardContent>
          <UIResultsDisplayValidationComponent />
        </CardContent>
      </Card>

      {/* PDF Export & Share Validation Test */}
      <Card className="border-dashed border-2 border-indigo-300 bg-indigo-50">
        <CardHeader>
          <CardTitle className="text-indigo-700">📄 PDF Export & Share Link Verification (Prompt 2.5)</CardTitle>
          <p className="text-indigo-600 text-sm">
            FOURTH: Validate PDF generation, sharing logic, QR code routing, and fallback handling.
          </p>
        </CardHeader>
        <CardContent>
          <PDFShareValidationComponent />
        </CardContent>
      </Card>

      {/* Test Component for Phase 1B */}
      <Card className="border-dashed border-2 border-orange-300 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-orange-700">🚧 Complete Valuation Test</CardTitle>
          <p className="text-orange-600 text-sm">
            SIXTH: If all validations pass, test the complete valuation engine.
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
