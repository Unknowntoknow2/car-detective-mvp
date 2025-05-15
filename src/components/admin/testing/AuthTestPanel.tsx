
import React from 'react';
import { useAuthTests } from '@/hooks/useAuthTests';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface AuthTestPanelProps {
  userId?: string;
}

export const AuthTestPanel: React.FC<AuthTestPanelProps> = ({ userId }) => {
  const { runTests, results, isRunning } = useAuthTests(userId);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentication Test Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={() => runTests()} disabled={isRunning}>
          {isRunning ? 'Running Tests...' : 'Run Auth Tests'}
        </Button>
        
        {results && (
          <div className="mt-4 space-y-2">
            <h3 className="font-medium">Test Results:</h3>
            <ul className="space-y-1">
              {Object.entries(results).map(([testName, passed]) => (
                <li key={testName} className="flex items-center gap-2">
                  <span className={typeof passed === 'boolean' && passed ? 'text-green-500' : 'text-red-500'}>
                    {typeof passed === 'boolean' && passed ? '✓' : '✗'}
                  </span>
                  <span>{testName}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
