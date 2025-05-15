import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TestResult {
  success: boolean;
  message: string;
  timestamp: Date;
}

export function useAuthTests() {
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [isRunning, setIsRunning] = useState(false);

  const runTest = async (name: string, testFn: () => Promise<{ success: boolean; message: string }>) => {
    try {
      const result = await testFn();
      setResults(prev => ({
        ...prev,
        [name]: {
          ...result,
          timestamp: new Date()
        }
      }));
      return result;
    } catch (error: any) {
      const errorResult = {
        success: false,
        message: `Test failed with error: ${error.message}`,
        timestamp: new Date()
      };
      setResults(prev => ({
        ...prev,
        [name]: errorResult
      }));
      return errorResult;
    }
  };

  const runTests = async () => {
    setIsRunning(true);
    
    await runTest('Auth Session', async () => {
      const { data } = await supabase.auth.getSession();
      return {
        success: !!data.session,
        message: data.session 
          ? 'Valid auth session detected' 
          : 'No valid auth session found'
      };
    });

    await runTest('Protected Table Access', async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id')
        .limit(1);
        
      return {
        success: !error,
        message: error 
          ? `Failed to access protected table: ${error.message}` 
          : 'Successfully accessed protected table'
      };
    });

    // Add more tests here as needed

    setIsRunning(false);
  };

  return {
    results,
    isRunning,
    runTests
  };
}
