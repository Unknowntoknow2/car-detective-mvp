
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface AuthTestPanelProps {
  results: any[];
  isRunning: boolean;
  runTests: () => void;
}

export const AuthTestPanel: React.FC<AuthTestPanelProps> = ({ 
  results = [], 
  isRunning = false, 
  runTests = () => console.log('Run tests') 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Auth Test Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={runTests} disabled={isRunning}>
          {isRunning ? 'Running Tests...' : 'Run Tests'}
        </Button>
        
        {results.length > 0 && (
          <div className="mt-4 border rounded-md p-4">
            <h3 className="font-medium mb-2">Test Results</h3>
            <ul className="space-y-2">
              {results.map((result, i) => (
                <li key={i} className="text-sm font-mono bg-muted p-2 rounded">
                  {JSON.stringify(result)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthTestPanel;
