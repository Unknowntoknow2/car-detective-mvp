
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Define the test result type
export interface TestResult {
  success: boolean;
  message: string;
  timestamp: string;
}

interface AuthTestPanelProps {
  results: Record<string, TestResult>;
  isRunning: boolean;
  runTests: () => Promise<void>;
}

export const AuthTestPanel: React.FC<AuthTestPanelProps> = ({
  results,
  isRunning,
  runTests
}) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  
  const toggleExpand = (testId: string) => {
    if (expanded === testId) {
      setExpanded(null);
    } else {
      setExpanded(testId);
    }
  };
  
  const testOrder = [
    'auth-connection',
    'user-session',
    'user-profile',
    'create-profile',
    'update-profile',
    'get-profile'
  ];
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Authentication Tests</span>
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            size="sm"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              'Run Tests'
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {testOrder.map((testId) => {
            const result = results[testId];
            const isExpanded = expanded === testId;
            
            return (
              <div key={testId} className="border rounded-md overflow-hidden">
                <div 
                  className={`flex items-center justify-between p-3 cursor-pointer ${
                    result ? (result.success ? 'bg-green-50' : 'bg-red-50') : 'bg-gray-50'
                  }`}
                  onClick={() => result && toggleExpand(testId)}
                >
                  <div className="flex items-center space-x-2">
                    {!result ? (
                      <Info className="h-5 w-5 text-gray-400" />
                    ) : result.success ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="font-medium">
                      {testId
                        .split('-')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')}
                    </span>
                  </div>
                  
                  {result && (
                    <div className="text-sm text-gray-500">
                      {result.timestamp ? new Date(result.timestamp).toLocaleTimeString() : ''}
                    </div>
                  )}
                </div>
                
                {result && isExpanded && (
                  <div className="p-3 border-t bg-white">
                    <Alert variant={result.success ? "default" : "destructive"}>
                      <AlertDescription>
                        {result.message}
                      </AlertDescription>
                    </Alert>
                    
                    {result.timestamp && (
                      <div className="mt-2 text-xs text-gray-500">
                        Tested at: {new Date(result.timestamp).toLocaleString()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
