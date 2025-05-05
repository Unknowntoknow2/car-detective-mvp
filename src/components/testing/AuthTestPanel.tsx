
import React from 'react';
import { useAuthTests } from '@/hooks/useAuthTests';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react';

export function AuthTestPanel() {
  const { results, isRunning, runTests } = useAuthTests();
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Auth & RLS Test Panel</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={runTests} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Running Tests...' : 'Run Tests'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Object.keys(results).length === 0 ? (
            <p className="text-sm text-muted-foreground">No tests have been run yet.</p>
          ) : (
            Object.entries(results).map(([testName, result]) => (
              <div 
                key={testName} 
                className={`p-3 rounded-md flex items-start gap-2 ${
                  result.success ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                )}
                <div>
                  <h3 className="font-medium">{testName}</h3>
                  <p className="text-sm">{result.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {result.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
