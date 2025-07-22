/**
 * Prompt 2.5 Validation Component: PDF Export & Share Link Verification
 * 
 * Tests PDF generation, sharing logic, QR code routing, and fallback handling
 * in the valuation results pipeline.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  validatePDFShareFunctionality, 
  validateAllPDFShareTestCases, 
  PDFShareValidationResult,
  PDF_SHARE_TEST_CASES 
} from '@/utils/valuation/validatePDFShareFunctionality';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ExternalLink, 
  FileText,
  Share2,
  QrCode,
  Database
} from 'lucide-react';

export function PDFShareValidationComponent() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<PDFShareValidationResult[]>([]);
  const [selectedVin, setSelectedVin] = useState<string>('');

  const runSingleTest = async (vin: string) => {
    setIsRunning(true);
    try {
      const result = await validatePDFShareFunctionality(vin);
      setResults([result]);
      setSelectedVin(vin);
    } catch (error) {
      console.error('PDF Share validation test failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    try {
      const allResults = await validateAllPDFShareTestCases();
      setResults(allResults);
      setSelectedVin('');
    } catch (error) {
      console.error('PDF Share validation tests failed:', error);
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
        <h3 className="text-lg font-semibold text-purple-700 mb-2">
          📄 Prompt 2.5: PDF Export & Share Link Verification
        </h3>
        <p className="text-sm text-purple-600 mb-4">
          Audits PDF generation, sharing logic, QR code routing, and fallback handling 
          in the valuation results pipeline.
        </p>
      </div>

      {/* Test Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PDF_SHARE_TEST_CASES.map((testCase) => (
          <Card key={testCase.vin} className="border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                {testCase.expectedFallback ? (
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
                {testCase.name}
              </CardTitle>
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
                  <Badge variant={testCase.expectedFallback ? "destructive" : "default"} className="text-xs">
                    {testCase.expectedFallback ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button 
                  onClick={() => runSingleTest(testCase.vin)}
                  disabled={isRunning}
                  size="sm"
                  className="flex-1"
                >
                  <Play className="h-3 w-3 mr-1" />
                  Test
                </Button>
                <Button 
                  onClick={() => window.open(`/results/${testCase.vin}`, '_blank')}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View
                </Button>
              </div>
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
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Play className="h-4 w-4 mr-2" />
          {isRunning ? 'Running All Tests...' : 'Run All PDF & Share Validation Tests'}
        </Button>
      </div>

      {/* Results Summary */}
      {results.length > 0 && (
        <Card className={`border-2 ${overallPassed ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(overallPassed)}
              Prompt 2.5 Validation Results
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
                <p className="text-2xl font-bold text-purple-600">
                  {results.filter(r => r.pdfGenerationWorks).length}
                </p>
                <p className="text-sm text-muted-foreground">PDFs Generated</p>
              </div>
            </div>

            {/* Success Criteria Checklist */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">✅ Success Criteria:</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  {getStatusIcon(results.every(r => r.pdfGenerationWorks && r.pdfFormattingProfessional))}
                  <span>PDF renders valuation clearly and professionally</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(results.every(r => r.shareUrlConstructed && r.qrCodeGenerated))}
                  <span>Share links and QR codes function across devices</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(results.every(r => r.fallbackHandling))}
                  <span>Fallback logic respected in exports</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(results.every(r => r.shareDataMatches))}
                  <span>Valuation data consistent across UI, PDF, and share</span>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Validation Categories */}
                  <div className="space-y-4">
                    {/* PDF Generation */}
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        1. PDF Generation
                      </h4>
                      <div className="space-y-1 text-sm pl-6">
                        <div className="flex items-center justify-between">
                          <span>PDF Generation Works</span>
                          {getStatusIcon(result.pdfGenerationWorks)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Contains Estimated Value</span>
                          {getStatusIcon(result.pdfContainsEstimatedValue)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Contains Confidence Score</span>
                          {getStatusIcon(result.pdfContainsConfidenceScore)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Professional Formatting</span>
                          {getStatusIcon(result.pdfFormattingProfessional)}
                        </div>
                      </div>
                    </div>

                    {/* Share Logic */}
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Share2 className="h-4 w-4" />
                        2. Share Logic
                      </h4>
                      <div className="space-y-1 text-sm pl-6">
                        <div className="flex items-center justify-between">
                          <span>Share URL Constructed</span>
                          {getStatusIcon(result.shareUrlConstructed)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Email Share Works</span>
                          {getStatusIcon(result.emailShareWorks)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Twitter Share Works</span>
                          {getStatusIcon(result.twitterShareWorks)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Content Pre-filled</span>
                          {getStatusIcon(result.shareContentPreFilled)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* QR Code */}
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <QrCode className="h-4 w-4" />
                        3. QR Code Logic
                      </h4>
                      <div className="space-y-1 text-sm pl-6">
                        <div className="flex items-center justify-between">
                          <span>QR Code Generated</span>
                          {getStatusIcon(result.qrCodeGenerated)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Uses Share URL</span>
                          {getStatusIcon(result.qrCodeUsesShareUrl)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Clickable</span>
                          {getStatusIcon(result.qrCodeClickable)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Enlargeable</span>
                          {getStatusIcon(result.qrCodeEnlargeable)}
                        </div>
                      </div>
                    </div>

                    {/* Persistence & Fallback */}
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        4. Persistence & Fallback
                      </h4>
                      <div className="space-y-1 text-sm pl-6">
                        <div className="flex items-center justify-between">
                          <span>Share URL Persistent</span>
                          {getStatusIcon(result.shareUrlPersistent)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Data Consistency</span>
                          {getStatusIcon(result.shareDataMatches)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Fallback Handling</span>
                          {getStatusIcon(result.fallbackHandling)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Fallback Share Works</span>
                          {getStatusIcon(result.fallbackShareWorks)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Issues */}
                <div className="mt-4">
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
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="text-purple-700">📄 How to Use This Validation</CardTitle>
        </CardHeader>
        <CardContent className="text-purple-600 text-sm space-y-2">
          <p><strong>Step 1:</strong> Run individual tests to validate specific PDF export scenarios</p>
          <p><strong>Step 2:</strong> Click "View" to manually inspect the UI and test PDF downloads</p>
          <p><strong>Step 3:</strong> Run "All Tests" to get comprehensive validation results</p>
          <p><strong>Step 4:</strong> Verify the Success Criteria checklist shows all ✅</p>
          <p><strong>Expected:</strong> PDF generation, share links, QR codes, and fallback handling all work correctly</p>
        </CardContent>
      </Card>
    </div>
  );
}