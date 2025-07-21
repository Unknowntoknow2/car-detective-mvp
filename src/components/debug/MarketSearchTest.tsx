
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchMarketComps } from '@/services/valuation/marketSearchService';
import { supabase } from '@/integrations/supabase/client';

export function MarketSearchTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testDirectEdgeFunction = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🧪 Testing direct edge function call...');
      
      const { data, error } = await supabase.functions.invoke('openai-web-search', {
        body: {
          make: 'TOYOTA',
          model: 'Camry',
          year: 2018,
          zipCode: '95821',
          vin: '4T1B21HK7JU507742',
          saveToDb: true
        }
      });

      console.log('🧪 Direct edge function result:', { data, error });

      if (error) {
        setError(`Edge function error: ${error.message}`);
      } else {
        setResult(data);
      }
    } catch (err) {
      console.error('🧪 Test error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testMarketSearchService = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🧪 Testing market search service...');
      
      const searchResult = await fetchMarketComps(
        'TOYOTA',
        'Camry',
        2018,
        '95821',
        '4T1B21HK7JU507742'
      );

      console.log('🧪 Market search service result:', searchResult);
      setResult(searchResult);
    } catch (err) {
      console.error('🧪 Service test error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>🧪 Market Search Debug Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={testDirectEdgeFunction} 
            disabled={loading}
            variant="outline"
          >
            Test Edge Function Direct
          </Button>
          <Button 
            onClick={testMarketSearchService} 
            disabled={loading}
            variant="outline"
          >
            Test Market Search Service
          </Button>
        </div>

        {loading && (
          <div className="p-4 bg-blue-50 rounded">
            <p>🔄 Testing market search functionality...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded">
            <h4 className="font-medium text-red-800">❌ Error</h4>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        )}

        {result && (
          <div className="p-4 bg-green-50 border border-green-200 rounded">
            <h4 className="font-medium text-green-800 mb-2">✅ Result</h4>
            <pre className="text-xs text-green-700 overflow-auto max-h-64 bg-white p-2 rounded">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="text-sm text-gray-600">
          <p><strong>Test Parameters:</strong></p>
          <ul className="list-disc list-inside ml-4">
            <li>VIN: 4T1B21HK7JU507742</li>
            <li>Vehicle: 2018 Toyota Camry</li>
            <li>ZIP: 95821</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
