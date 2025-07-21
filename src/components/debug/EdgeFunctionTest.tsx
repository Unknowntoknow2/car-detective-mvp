
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const EdgeFunctionTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testOpenAIWebSearch = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🧪 [EDGE_FUNCTION_TEST] Testing openai-web-search function...');
      
      const testData = {
        vehicleData: {
          make: 'FORD',
          model: 'F-150',
          year: 2019,
          zipCode: '95821',
          vin: '1FTEW1EP4KKD28724'
        }
      };

      const { data, error } = await supabase.functions.invoke('openai-web-search', {
        body: testData
      });

      if (error) {
        console.error('❌ [EDGE_FUNCTION_TEST] Function error:', error);
        setError(`Function error: ${error.message}`);
        toast.error(`Test failed: ${error.message}`);
        return;
      }

      console.log('✅ [EDGE_FUNCTION_TEST] Function response:', data);
      setResult(data);
      toast.success(`Test successful! Found ${data?.listings?.length || 0} listings`);

    } catch (err) {
      console.error('❌ [EDGE_FUNCTION_TEST] Test error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      toast.error(`Test failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-2 border-blue-300 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-blue-700">🧪 Edge Function Test</CardTitle>
        <p className="text-blue-600 text-sm">
          Test the openai-web-search function deployment
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testOpenAIWebSearch}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Testing...' : 'Test OpenAI Web Search Function'}
        </Button>

        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded-md">
            <p className="text-red-700 text-sm font-medium">Error:</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {result && (
          <div className="p-3 bg-green-100 border border-green-300 rounded-md">
            <p className="text-green-700 text-sm font-medium">Success!</p>
            <div className="text-green-600 text-sm space-y-1">
              <p>Listings found: {result.listings?.length || 0}</p>
              <p>Trust score: {result.trust || 0}</p>
              <p>Source: {result.source || 'unknown'}</p>
              <p>Notes: {result.notes || 'No notes'}</p>
            </div>
            {result.listings && result.listings.length > 0 && (
              <div className="mt-2">
                <p className="text-green-700 text-sm font-medium">Sample listing:</p>
                <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                  {JSON.stringify(result.listings[0], null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
