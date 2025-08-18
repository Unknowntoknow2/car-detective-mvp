import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, TestTube, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface TestResult {
  status: 'success' | 'error' | 'warning';
  message: string;
  data?: any;
  timing?: number;
}

export function LiveMarketTestComponent() {
  const [loading, setLoading] = useState(false);
  const [testData, setTestData] = useState({
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    zipCode: '90210'
  });
  const [results, setResults] = useState<TestResult[]>([]);

  const testMarketListingFlow = async () => {
    setLoading(true);
    setResults([]);
    const testResults: TestResult[] = [];

    try {
      // Test 1: Live Market Search Function
      toast.info("Testing Live Market Search", {
        description: "Running live market search function..."
      });
      const startTime = Date.now();
      
      const { data: liveSearchData, error: liveSearchError } = await supabase.functions.invoke('live-market-search', {
        body: {
          make: testData.make,
          model: testData.model,
          year: testData.year,
          zipCode: testData.zipCode,
          maxResults: 5
        }
      });

      const liveSearchTiming = Date.now() - startTime;

      if (liveSearchError) {
        testResults.push({
          status: 'error',
          message: `Live Market Search Failed: ${liveSearchError.message}`,
          timing: liveSearchTiming
        });
      } else {
        testResults.push({
          status: 'success',
          message: `Live Market Search Success: Found ${liveSearchData?.listings?.length || 0} listings`,
          data: liveSearchData,
          timing: liveSearchTiming
        });
      }

      // Test 2: Enhanced Market Search Function
      toast.info("Testing Enhanced Search", {
        description: "Running enhanced market search function..."
      });
      const enhancedStartTime = Date.now();
      
      const { data: enhancedData, error: enhancedError } = await supabase.functions.invoke('enhanced-market-search', {
        body: {
          make: testData.make,
          model: testData.model,
          year: testData.year,
          zipCode: testData.zipCode
        }
      });

      const enhancedTiming = Date.now() - enhancedStartTime;

      if (enhancedError) {
        testResults.push({
          status: 'error',
          message: `Enhanced Market Search Failed: ${enhancedError.message}`,
          timing: enhancedTiming
        });
      } else {
        testResults.push({
          status: 'success',
          message: `Enhanced Market Search Success: Found ${enhancedData?.listings?.length || 0} listings`,
          data: enhancedData,
          timing: enhancedTiming
        });
      }

      // Test 3: Database Query for Existing Listings
      toast.info("Testing Database Query", {
        description: "Querying existing market listings..."
      });
      const dbStartTime = Date.now();
      
      const { data: dbListings, error: dbError } = await supabase
        .from('market_listings')
        .select('*')
        .ilike('make', `%${testData.make}%`)
        .ilike('model', `%${testData.model}%`)
        .limit(10);

      const dbTiming = Date.now() - dbStartTime;

      if (dbError) {
        testResults.push({
          status: 'error',
          message: `Database Query Failed: ${dbError.message}`,
          timing: dbTiming
        });
      } else {
        testResults.push({
          status: dbListings && dbListings.length > 0 ? 'success' : 'warning',
          message: `Database Query: Found ${dbListings?.length || 0} existing listings`,
          data: dbListings,
          timing: dbTiming
        });
      }

      toast.success("Market Listing Test Complete", {
        description: `Completed ${testResults.length} tests. Check results below.`
      });

    } catch (error) {
      testResults.push({
        status: 'error',
        message: `Test Suite Failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
      
      toast.error("Test Failed", {
        description: "An unexpected error occurred during testing."
      });
    }

    setResults(testResults);
    setLoading(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'error':
        return 'bg-red-500/10 text-red-700 border-red-500/20';
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Live Market Listing System Test
        </CardTitle>
        <CardDescription>
          Test the complete market listing pipeline including OpenAI integration, database queries, and edge functions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Test Configuration */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="make">Make</Label>
            <Input
              id="make"
              value={testData.make}
              onChange={(e) => setTestData(prev => ({ ...prev, make: e.target.value }))}
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              value={testData.model}
              onChange={(e) => setTestData(prev => ({ ...prev, model: e.target.value }))}
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              value={testData.year}
              onChange={(e) => setTestData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="zipCode">Zip Code</Label>
            <Input
              id="zipCode"
              value={testData.zipCode}
              onChange={(e) => setTestData(prev => ({ ...prev, zipCode: e.target.value }))}
              disabled={loading}
            />
          </div>
        </div>

        {/* Test Button */}
        <Button 
          onClick={testMarketListingFlow} 
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Market Listing Tests...
            </>
          ) : (
            <>
              <TestTube className="mr-2 h-4 w-4" />
              Run Live Market Test
            </>
          )}
        </Button>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Test Results</h3>
            {results.map((result, index) => (
              <div key={index} className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}>
                <div className="flex items-start gap-3">
                  {getStatusIcon(result.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{result.message}</p>
                      {result.timing && (
                        <Badge variant="secondary" className="ml-2">
                          {result.timing}ms
                        </Badge>
                      )}
                    </div>
                    {result.data && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm opacity-70">
                          View response data
                        </summary>
                        <pre className="mt-2 p-2 bg-muted/50 rounded text-xs overflow-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}