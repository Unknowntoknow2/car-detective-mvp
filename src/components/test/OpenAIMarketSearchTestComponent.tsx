import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Search, ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import { testOpenAIMarketSearch, testDirectOpenAIFunction } from '@/utils/valuation/testOpenAIMarketSearch';

interface TestResults {
  success: boolean;
  testCase: string;
  listingsFound: number;
  sources: string[];
  confidenceScore: number;
  hasRealPrices: boolean;
  hasRealLinks: boolean;
  openAIUsed: boolean;
  details: any;
}

export const OpenAIMarketSearchTestComponent: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<TestResults[]>([]);
  const [directTestResult, setDirectTestResult] = useState<any>(null);

  const handleRunTests = async () => {
    setTesting(true);
    setResults([]);
    setDirectTestResult(null);

    try {
      console.log('🧪 Starting OpenAI Market Search Validation Tests...');
      const testResults = await testOpenAIMarketSearch();
      setResults(testResults);
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setTesting(false);
    }
  };

  const handleDirectTest = async () => {
    setTesting(true);
    
    try {
      console.log('🔍 Testing OpenAI function directly...');
      const result = await testDirectOpenAIFunction({
        make: 'Ford',
        model: 'F-150',
        year: 2021,
        trim: 'XLT',
        zip: '95821',
        mileage: 84000
      });
      
      setDirectTestResult(result);
      console.log('Direct test result:', result);
    } catch (error) {
      console.error('Direct test failed:', error);
      setDirectTestResult({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      setTesting(false);
    }
  };

  const getStatusIcon = (success: boolean) => 
    success ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />;

  const getStatusColor = (success: boolean) => 
    success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            OpenAI Market Search Validation (Prompt 2.2)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Test the OpenAI-powered live web search for vehicle listings
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={handleRunTests} 
              disabled={testing}
              className="flex items-center gap-2"
            >
              {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Run Full Test Suite
            </Button>
            
            <Button 
              onClick={handleDirectTest} 
              disabled={testing}
              variant="outline"
              className="flex items-center gap-2"
            >
              {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
              Test OpenAI Function Direct
            </Button>
          </div>

          {/* Test Case: Ford F-150 */}
          <Alert>
            <AlertDescription>
              <strong>Test Case:</strong> 2021 Ford F-150 XLT, VIN: 1FTEW1CP7MKD73632, ZIP: 95821, 84k miles
              <br />
              <strong>Expected:</strong> 2+ real listings with ≥70% confidence from live web sources
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Direct Test Results */}
      {directTestResult && (
        <Card>
          <CardHeader>
            <CardTitle>Direct OpenAI Function Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            {directTestResult.error ? (
              <Alert variant="destructive">
                <AlertDescription>
                  <strong>Error:</strong> {directTestResult.error}
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Success</p>
                    <p className="font-medium">{directTestResult.data?.success ? 'YES' : 'NO'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Listings Found</p>
                    <p className="font-medium">{directTestResult.data?.data?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Confidence</p>
                    <p className="font-medium">{directTestResult.data?.meta?.confidence || 0}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sources</p>
                    <p className="font-medium">{directTestResult.data?.meta?.sources?.length || 0}</p>
                  </div>
                </div>

                {directTestResult.data?.data?.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Sample Listings:</h4>
                    <div className="space-y-2">
                      {directTestResult.data.data.slice(0, 3).map((listing: any, index: number) => (
                        <div key={index} className="border rounded p-3 text-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">${listing.price?.toLocaleString()}</p>
                              <p className="text-muted-foreground">
                                {listing.year} {listing.make} {listing.model} {listing.trim}
                              </p>
                              <p className="text-muted-foreground">
                                {listing.mileage?.toLocaleString()} miles • {listing.source}
                              </p>
                            </div>
                            <Badge variant="outline">{listing.condition}</Badge>
                          </div>
                          {listing.link && (
                            <p className="mt-2 text-blue-600 text-xs">Link: Available</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {directTestResult.data?.meta?.openAIRawResponse && (
                  <div>
                    <h4 className="font-medium mb-2">OpenAI Raw Response Preview:</h4>
                    <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                      {directTestResult.data.meta.openAIRawResponse.substring(0, 500)}...
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Full Test Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Overall Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded">
                <div>
                  <p className="text-sm text-muted-foreground">Tests Passed</p>
                  <p className="font-medium">
                    {results.filter(r => r.success).length}/{results.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Listings</p>
                  <p className="font-medium">
                    {results.reduce((sum, r) => sum + r.listingsFound, 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">OpenAI Used</p>
                  <p className="font-medium">
                    {results.some(r => r.openAIUsed) ? 'YES' : 'NO'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Confidence</p>
                  <p className="font-medium">
                    {Math.round(results.reduce((sum, r) => sum + r.confidenceScore, 0) / results.length)}%
                  </p>
                </div>
              </div>

              {/* Individual Test Results */}
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div key={index} className="border rounded p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{result.testCase}</h4>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.success)}
                        <Badge className={getStatusColor(result.success)}>
                          {result.success ? 'PASS' : 'FAIL'}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Listings Found</p>
                        <p className="font-medium">{result.listingsFound}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Confidence</p>
                        <p className="font-medium">{result.confidenceScore}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Real Prices</p>
                        <p className="font-medium">{result.hasRealPrices ? 'YES' : 'NO'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">OpenAI Used</p>
                        <p className="font-medium">{result.openAIUsed ? 'YES' : 'NO'}</p>
                      </div>
                    </div>

                    {result.sources.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm text-muted-foreground mb-1">Sources:</p>
                        <div className="flex gap-1 flex-wrap">
                          {result.sources.map((source, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {source}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Validation Criteria */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-green-800 text-lg">Prompt 2.2 Validation Criteria</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(results.some(r => r.listingsFound >= 2))}
                    <span className="text-sm">At least 2-3 real listings found</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(results.some(r => r.hasRealPrices && r.hasRealLinks))}
                    <span className="text-sm">Realistic prices and links present</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(results.some(r => r.confidenceScore >= 70))}
                    <span className="text-sm">Confidence score ≥70%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(results.some(r => r.openAIUsed))}
                    <span className="text-sm">OpenAI integration working</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};