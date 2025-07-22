import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Target, CheckCircle, XCircle, TrendingUp, Database, Calculator } from 'lucide-react';
import { validateListingAnchoringLogic, testFordF150Listings, testNissanAltimaListings } from '@/utils/valuation/validateListingAnchoringLogic';

interface ValidationResult {
  testCase: string;
  passed: boolean;
  details: {
    listingsFound: number;
    isUsingFallbackMethod: boolean;
    confidenceScore: number;
    basePriceAnchor: any;
    estimatedValue: number;
    valuationMethod: string;
    marketListings: any[];
    adjustments: any[];
    issues: string[];
    logs: string[];
  };
}

export const ListingAnchoringValidationComponent: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [debugResults, setDebugResults] = useState<any>(null);

  const handleRunValidation = async () => {
    setTesting(true);
    setResults([]);
    setDebugResults(null);

    try {
      console.log('🧪 Starting Listing Anchoring + Confidence Score Validation...');
      const validationResults = await validateListingAnchoringLogic();
      setResults(validationResults);
    } catch (error) {
      console.error('Validation execution failed:', error);
    } finally {
      setTesting(false);
    }
  };

  const handleDebugTests = async () => {
    setTesting(true);
    
    try {
      console.log('🔍 Running debug tests...');
      const fordListings = await testFordF150Listings();
      const nissanListings = await testNissanAltimaListings();
      
      setDebugResults({
        fordF150: fordListings,
        nissanAltima: nissanListings
      });
    } catch (error) {
      console.error('Debug tests failed:', error);
      setDebugResults({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      setTesting(false);
    }
  };

  const getStatusIcon = (success: boolean) => 
    success ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />;

  const getStatusColor = (success: boolean) => 
    success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Listing Anchoring + Confidence Logic Validation (Prompt 2.3)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Validate that the valuation engine correctly uses real market listings for price anchoring and confidence scoring
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={handleRunValidation} 
              disabled={testing}
              className="flex items-center gap-2"
            >
              {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
              Run Full Validation
            </Button>
            
            <Button 
              onClick={handleDebugTests} 
              disabled={testing}
              variant="outline"
              className="flex items-center gap-2"
            >
              {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
              Debug Market Search
            </Button>
          </div>

          {/* Test Cases Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Alert>
              <CheckCircle className="w-4 h-4" />
              <AlertDescription>
                <strong>Case A: Ford F-150</strong><br />
                VIN: 1FTEW1CP7MKD73632<br />
                Expected: 5+ listings, ≥75% confidence, no fallback
              </AlertDescription>
            </Alert>
            
            <Alert>
              <XCircle className="w-4 h-4" />
              <AlertDescription>
                <strong>Case B: Nissan Altima</strong><br />
                VIN: 1N4BL4BV8NN341985<br />
                Expected: Few/no listings, ≤60% confidence, fallback used
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Debug Results */}
      {debugResults && (
        <Card>
          <CardHeader>
            <CardTitle>Debug Market Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            {debugResults.error ? (
              <Alert variant="destructive">
                <AlertDescription>
                  <strong>Error:</strong> {debugResults.error}
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Ford F-150 Listings</h4>
                    <Badge variant="outline" className="mb-2">
                      {debugResults.fordF150?.length || 0} listings found
                    </Badge>
                    {debugResults.fordF150?.slice(0, 2).map((listing: any, index: number) => (
                      <div key={index} className="border rounded p-2 text-sm mb-2">
                        <p className="font-medium">${listing.price?.toLocaleString()}</p>
                        <p className="text-muted-foreground">{listing.source} • {listing.mileage?.toLocaleString()} mi</p>
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Nissan Altima Listings</h4>
                    <Badge variant="outline" className="mb-2">
                      {debugResults.nissanAltima?.length || 0} listings found
                    </Badge>
                    {debugResults.nissanAltima?.slice(0, 2).map((listing: any, index: number) => (
                      <div key={index} className="border rounded p-2 text-sm mb-2">
                        <p className="font-medium">${listing.price?.toLocaleString()}</p>
                        <p className="text-muted-foreground">{listing.source} • {listing.mileage?.toLocaleString()} mi</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Validation Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Validation Results Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Overall Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded">
                <div>
                  <p className="text-sm text-muted-foreground">Tests Passed</p>
                  <p className="font-medium">
                    {results.filter(r => r.passed).length}/{results.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Confidence</p>
                  <p className="font-medium">
                    {Math.round(results.reduce((sum, r) => sum + r.details.confidenceScore, 0) / results.length)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Market Anchored</p>
                  <p className="font-medium">
                    {results.filter(r => !r.details.isUsingFallbackMethod).length}/{results.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Issues</p>
                  <p className="font-medium">
                    {results.reduce((sum, r) => sum + r.details.issues.length, 0)}
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
                        {getStatusIcon(result.passed)}
                        <Badge className={getStatusColor(result.passed)}>
                          {result.passed ? 'PASS' : 'FAIL'}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-muted-foreground">Listings Found</p>
                        <p className="font-medium">{result.details.listingsFound}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Confidence</p>
                        <Badge className={getConfidenceColor(result.details.confidenceScore)} variant="outline">
                          {result.details.confidenceScore}%
                        </Badge>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Using Fallback</p>
                        <p className="font-medium">{result.details.isUsingFallbackMethod ? 'YES' : 'NO'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Estimated Value</p>
                        <p className="font-medium">${result.details.estimatedValue.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Price Anchor Details */}
                    {result.details.basePriceAnchor && (
                      <div className="bg-gray-50 rounded p-3 mb-3">
                        <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <Calculator className="w-4 h-4" />
                          Price Anchor Details
                        </h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Base Price</p>
                            <p className="font-medium">${result.details.basePriceAnchor.price?.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Source</p>
                            <p className="font-medium">{result.details.basePriceAnchor.source}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Anchor Confidence</p>
                            <p className="font-medium">{result.details.basePriceAnchor.confidence}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Listings Used</p>
                            <p className="font-medium">{result.details.basePriceAnchor.listingsUsed}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Adjustments */}
                    {result.details.adjustments.length > 0 && (
                      <div className="mb-3">
                        <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Applied Adjustments
                        </h5>
                        <div className="space-y-1">
                          {result.details.adjustments.map((adjustment: any, i: number) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span>{adjustment.factor}</span>
                              <span className={adjustment.impact >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {adjustment.impact >= 0 ? '+' : ''}${adjustment.impact.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Issues */}
                    {result.details.issues.length > 0 && (
                      <div>
                        <h5 className="font-medium text-sm mb-2 text-red-600">Issues Found:</h5>
                        <div className="space-y-1">
                          {result.details.issues.map((issue, i) => (
                            <div key={i} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                              {issue}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Success Criteria Validation */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-green-800 text-lg">Prompt 2.3 Success Criteria</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(results.some(r => r.details.listingsFound > 0 && !r.details.isUsingFallbackMethod))}
                    <span className="text-sm">Listings used in valuation logic</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(results.some(r => r.details.basePriceAnchor?.source === 'market_listings'))}
                    <span className="text-sm">Real median used for base value</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(results.every(r => r.details.confidenceScore >= 45 && r.details.confidenceScore <= 95))}
                    <span className="text-sm">Confidence dynamically scored (45-95%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(results.every(r => 
                      (r.details.listingsFound >= 2 && !r.details.isUsingFallbackMethod) ||
                      (r.details.listingsFound < 2 && r.details.isUsingFallbackMethod)
                    ))}
                    <span className="text-sm">Fallback only triggered when needed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(results.every(r => r.details.issues.filter(i => i.includes('Missing')).length === 0))}
                    <span className="text-sm">All required fields present</span>
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