
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export type TestResult = boolean;

export function useAuthTests(userId?: string) {
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    const testResults: Record<string, TestResult> = {};
    
    try {
      // Test 1: Verify user can read their own profile
      testResults['Read Own Profile'] = await testReadOwnProfile(userId);
      
      // Test 2: Verify user can update their own profile
      testResults['Update Own Profile'] = await testUpdateOwnProfile(userId);
      
      // Test 3: Verify RLS policies for vehicle table
      testResults['Vehicle Table Access'] = await testVehicleTableAccess();
      
      // Test 4: Test premium content access
      testResults['Premium Content Access'] = await testPremiumAccess();
      
      setResults(testResults);
    } catch (error) {
      console.error('Error running auth tests:', error);
      // Set all remaining tests as failed
      Object.keys(testResults).forEach(key => {
        if (testResults[key] === undefined) {
          testResults[key] = false;
        }
      });
      setResults(testResults);
    } finally {
      setIsRunning(false);
    }
  };
  
  const testReadOwnProfile = async (userId?: string): Promise<boolean> => {
    try {
      // Use 'profiles' instead of 'user_profiles'
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId || '00000000-0000-0000-0000-000000000000')
        .single();
      
      return !error && !!data;
    } catch (error) {
      console.error('Read profile test error:', error);
      return false;
    }
  };
  
  const testUpdateOwnProfile = async (userId?: string): Promise<boolean> => {
    try {
      if (!userId) return false;
      
      // Try updating a non-sensitive field like 'last_seen'
      const { error } = await supabase
        .from('profiles')
        .update({ last_seen: new Date().toISOString() })
        .eq('id', userId);
      
      return !error;
    } catch (error) {
      console.error('Update profile test error:', error);
      return false;
    }
  };
  
  const testVehicleTableAccess = async (): Promise<boolean> => {
    try {
      // Attempt to read public vehicle data
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .limit(1);
      
      return !error && Array.isArray(data);
    } catch (error) {
      console.error('Vehicle table access test error:', error);
      return false;
    }
  };
  
  const testPremiumAccess = async (): Promise<boolean> => {
    try {
      // Attempt to read premium content indicator
      const { data, error } = await supabase
        .rpc('has_premium_access', { valuation_id: '00000000-0000-0000-0000-000000000000' });
      
      // The function should run without error even if result is false
      return !error && data !== null;
    } catch (error) {
      console.error('Premium access test error:', error);
      return false;
    }
  };

  return {
    results,
    isRunning,
    runTests
  };
}
