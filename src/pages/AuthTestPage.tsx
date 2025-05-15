
import React, { useState } from 'react';
import { AuthTestPanel } from '@/components/admin/testing/AuthTestPanel';

export default function AuthTestPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  const runAuthTests = async () => {
    setIsRunning(true);
    try {
      // Simulate running tests
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTestResults([
        { test: 'User Authentication', status: 'passed' },
        { test: 'Token Validation', status: 'passed' },
        { test: 'Permission Check', status: 'passed' }
      ]);
    } catch (error) {
      console.error('Auth test error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Auth Testing Page</h1>
      <AuthTestPanel 
        results={testResults}
        isRunning={isRunning}
        runTests={runAuthTests}
      />
    </div>
  );
}
