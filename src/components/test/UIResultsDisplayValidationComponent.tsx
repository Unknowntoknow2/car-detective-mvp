/**
 * Prompt 2.4 Validation Component: UI Results Page Display Validation
 * 
 * Tests that the ResultsPage and child components correctly render:
 * - Real market listings (if available)
 * - Estimated value from valuation engine
 * - Confidence score with proper color coding
 * - Adjustments display
 * - Fallback method messaging  
 * - Share & PDF export options
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  validateUIResultsDisplay, 
  validateAllUITestCases, 
  UIValidationResult,
  UI_TEST_CASES 
} from '@/utils/valuation/validateUIResultsDisplay';
import { Play, CheckCircle, XCircle, AlertTriangle, ExternalLink } from 'lucide-react';

export function UIResultsDisplayValidationComponent() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<UIValidationResult[]>([]);
  const [selectedVin, setSelectedVin] = useState<string>('');

  const runSingleTest = async (vin: string) => {
    setIsRunning(true);
    try {
      const result = await validateUIResultsDisplay(vin);
      setResults([result]);
      setSelectedVin(vin);
    } catch (error) {
      console.error('UI validation test failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    try {
      const allResults = await validateAllUITestCases();
      setResults(allResults);
      setSelectedVin('');
    } catch (error) {
      console.error('UI validation tests failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircle className="h-5 w-5 text-green-600" />
    ) : (
      <XCircle className="h-5 w-5 text-red-600" />
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-amber-600";
    return "text-red-600";
  };

  const overallPassed = results.length > 0 && results.every(r => r.passed);
  const averageScore = results.length > 0 ? 
    Math.round(results.reduce((sum, r) => sum + r.overallScore, 0) / results.length) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-green-700 mb-2">
          🎯 Prompt 2.4: UI Results Page Display Validation
        </h3>
        <p className="text-sm text-green-600 mb-4">
          Validates that ResultsPage correctly renders valuation results, market listings, 
          confidence scores, fallback messaging, and PDF/share functionality.
        </p>
      </div>

      {/* Test Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {UI_TEST_CASES.map((testCase) => (
          <Card key={testCase.vin} className="border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{testCase.name}</CardTitle>
              <p className="text-xs text-muted-foreground">{testCase.description}</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Expected Listings:</span>
                  <span className="font-medium">{testCase.expectedListings}</span>
                </div>
                <div className="flex justify-between">
                  <span>Expected Confidence:</span>
                  <span className="font-medium">{testCase.expectedConfidence}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Expected Fallback:</span>
                  <span className="font-medium">{testCase.expectedFallback ? 'Yes' : 'No'}</span>
                </div>
              </div>
              <Button 
                onClick={() => runSingleTest(testCase.vin)}
                disabled={isRunning}
                size="sm"
                className="w-full mt-3"
              >
                <Play className="h-3 w-3 mr-1" />
                Test {testCase.name}
              </Button>
              <Button 
                onClick={() => window.open(`/results/${testCase.vin}`, '_blank')}
                variant="outline"
                size="sm"
                className="w-full mt-2"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View Results Page
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Run All Tests */}
      <div className="flex justify-center">
        <Button 
          onClick={runAllTests}
          disabled={isRunning}
          size="lg"
          className="bg-green-600 hover:bg-green-700"
        >
          <Play className="h-4 w-4 mr-2" />
          {isRunning ? 'Running All Tests...' : 'Run All UI Validation Tests'}
        </Button>
      </div>

      {/* Results Summary */}
      {results.length > 0 && (
        <Card className={`border-2 ${overallPassed ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(overallPassed)}
              Prompt 2.4 Validation Results
              <Badge variant={overallPassed ? "default" : "destructive"}>
                {overallPassed ? 'PASSED' : 'FAILED'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {results.filter(r => r.passed).length}/{results.length}
                </p>
                <p className="text-sm text-muted-foreground">Tests Passed</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${getScoreColor(averageScore)}`}>
                  {averageScore}%
                </p>
                <p className="text-sm text-muted-foreground">Average Score</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {results.reduce((sum, r) => sum + r.listingsCount, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Listings</p>
              </div>
            </div>

            {/* Success Criteria Checklist */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">✅ Success Criteria:</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  {getStatusIcon(results.every(r => r.valuationDisplayed))}
                  <span>UI fully reflects valuation engine output</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(results.every(r => r.listingsGridRendered))}
                  <span>Market listings grid renders accurately</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(results.every(r => r.confidenceBarShown))}
                  <span>Confidence and fallback status shown transparently</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(results.every(r => r.pdfDownloadAvailable && r.shareButtonAvailable))}
                  <span>PDF and share features are live and interactive</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(results.every(r => r.errorHandling))}
                  <span>No crash on missing or malformed results</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Detailed Test Results</h3>
          {results.map((result, index) => (
            <Card key={index} className={`border ${result.passed ? 'border-green-200' : 'border-red-200'}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.passed)}
                    <span>{result.testCase}</span>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">{result.vin}</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${getScoreColor(result.overallScore)}`}>
                      {result.overallScore}%
                    </span>
                    <Badge variant={result.passed ? "default" : "destructive"}>
                      {result.passed ? 'PASSED' : 'FAILED'}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Validation Checks */}
                  <div>
                    <h4 className="font-medium mb-2">Validation Checks:</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center justify-between">
                        <span>1. Valuation Output</span>
                        {getStatusIcon(result.valuationDisplayed)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span>2. Market Listings ({result.listingsCount})</span>
                        {getStatusIcon(result.listingsGridRendered)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span>3. Confidence Display</span>
                        {getStatusIcon(result.confidenceBarShown)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span>4. PDF/Share Actions</span>
                        {getStatusIcon(result.pdfDownloadAvailable && result.shareButtonAvailable)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span>5. Edge Case Handling</span>
                        {getStatusIcon(result.errorHandling)}
                      </div>
                    </div>
                  </div>

                  {/* Issues */}
                  <div>
                    <h4 className="font-medium mb-2">
                      Issues Found: 
                      <span className="ml-1 text-red-600">({result.issues.length})</span>
                    </h4>
                    {result.issues.length > 0 ? (
                      <div className="space-y-1">
                        {result.issues.map((issue, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm text-red-600">
                            <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                            <span>{issue}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-green-600">No issues found ✅</p>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Overall Score</span>
                    <span className={getScoreColor(result.overallScore)}>
                      {result.overallScore}%
                    </span>
                  </div>
                  <Progress 
                    value={result.overallScore} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Instructions */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-700">🔍 How to Use This Validation</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-600 text-sm space-y-2">
          <p><strong>Step 1:</strong> Run individual tests to validate specific VIN scenarios</p>
          <p><strong>Step 2:</strong> Click "View Results Page" to manually inspect the UI components</p>
          <p><strong>Step 3:</strong> Run "All Tests" to get comprehensive validation results</p>
          <p><strong>Step 4:</strong> Verify the Success Criteria checklist shows all ✅</p>
          <p><strong>Expected:</strong> All tests should pass with 90%+ scores and no critical issues</p>
        </CardContent>
      </Card>
    </div>
  );
}