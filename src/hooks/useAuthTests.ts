
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type TestResult = {
  success: boolean;
  message: string;
  timestamp: Date;
};

export function useAuthTests() {
  const { user } = useAuth();
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    // Reset results
    setResults({});
    
    try {
      // Test 1: Can fetch own profile
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user?.id)
          .single();
          
        if (error) throw error;
        
        setResults(prev => ({
          ...prev,
          profileFetch: {
            success: true,
            message: 'Successfully fetched own profile',
            timestamp: new Date()
          }
        }));
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        setResults(prev => ({
          ...prev,
          profileFetch: {
            success: false,
            message: `Failed to fetch profile: ${message}`,
            timestamp: new Date()
          }
        }));
      }
      
      // Test 2: Can fetch own valuations
      try {
        const { data, error } = await supabase
          .from('valuations')
          .select('*')
          .eq('user_id', user?.id)
          .limit(1);
          
        if (error) throw error;
        
        setResults(prev => ({
          ...prev,
          valuationsFetch: {
            success: true,
            message: `Successfully fetched valuations: ${data.length} results`,
            timestamp: new Date()
          }
        }));
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        setResults(prev => ({
          ...prev,
          valuationsFetch: {
            success: false,
            message: `Failed to fetch valuations: ${message}`,
            timestamp: new Date()
          }
        }));
      }
      
      // Test 3: Cannot fetch another user's data (should fail due to RLS)
      try {
        const { data, error } = await supabase
          .from('valuations')
          .select('*')
          .neq('user_id', user?.id)
          .limit(1);
          
        if (data && data.length > 0) {
          setResults(prev => ({
            ...prev,
            rlsProtection: {
              success: false,
              message: 'RLS FAILURE: Could access another user\'s data',
              timestamp: new Date()
            }
          }));
        } else {
          setResults(prev => ({
            ...prev,
            rlsProtection: {
              success: true,
              message: 'RLS protection working correctly',
              timestamp: new Date()
            }
          }));
        }
      } catch (error: unknown) {
        // In this case, an error is actually good - it means RLS blocked the request
        setResults(prev => ({
          ...prev,
          rlsProtection: {
            success: true,
            message: 'RLS protection working correctly (query blocked)',
            timestamp: new Date()
          }
        }));
      }
      
      // Test 4: Test Stripe checkout edge function
      try {
        const valuationId = 'test-valuation-id';
        const { data, error } = await supabase.functions.invoke('create-checkout', {
          body: { valuationId }
        });
        
        if (error) throw error;
        
        if (data?.url) {
          setResults(prev => ({
            ...prev,
            stripeCheckout: {
              success: true,
              message: 'Stripe checkout function working',
              timestamp: new Date()
            }
          }));
        } else {
          throw new Error('No URL returned from checkout function');
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        setResults(prev => ({
          ...prev,
          stripeCheckout: {
            success: false,
            message: `Failed to create checkout: ${message}`,
            timestamp: new Date()
          }
        }));
      }
      
    } finally {
      setIsRunning(false);
    }
  };
  
  // Auto-run tests on mount if user is logged in
  useEffect(() => {
    if (user) {
      runTests();
    }
  }, [user]);
  
  return {
    results,
    isRunning,
    runTests
  };
}
