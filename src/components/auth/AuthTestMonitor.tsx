
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL' | 'RUNNING';
  metrics: {
    [key: string]: string | number | boolean;
  };
  timestamp: Date;
}

export function AuthTestMonitor() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  const runTests = async () => {
    setIsRunning(true);
    
    // Clear previous results
    setResults([]);
    
    // Test 1: Basic Sign-Up Flow
    await runSignUpTest();
    
    // Test 4: Brute Force Test
    await runBruteForceTest();
    
    setIsRunning(false);
  };
  
  const runSignUpTest = async () => {
    // Create a placeholder result
    const result: TestResult = {
      name: "Basic Sign-Up Flow",
      status: "RUNNING",
      metrics: {
        "Avg completion time": "0ms",
        "Number of screens": 0,
        "Sentiment": "neutral"
      },
      timestamp: new Date()
    };
    
    setResults(prev => [...prev, result]);
    
    // Simulate test running
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update with results
    const updatedResult: TestResult = {
      ...result,
      status: "PASS",
      metrics: {
        "Avg completion time": "2300ms",
        "Number of screens": 2,
        "Sentiment": "neutral"
      },
      timestamp: new Date()
    };
    
    setResults(prev => prev.map(r => 
      r.name === updatedResult.name ? updatedResult : r
    ));
  };
  
  const runBruteForceTest = async () => {
    // Create a placeholder result
    const result: TestResult = {
      name: "Brute Force & Lockout",
      status: "RUNNING",
      metrics: {
        "Attempts before lockout": 0,
        "Lockout duration": "0s",
        "Alert triggered": false
      },
      timestamp: new Date()
    };
    
    setResults(prev => [...prev, result]);
    
    // Simulate test running
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update with results
    const updatedResult: TestResult = {
      ...result,
      status: "PASS",
      metrics: {
        "Attempts before lockout": 5,
        "Lockout duration": "30s",
        "Alert triggered": true
      },
      timestamp: new Date()
    };
    
    setResults(prev => prev.map(r => 
      r.name === updatedResult.name ? updatedResult : r
    ));
  };
  
  return (
    <Card className="w-full shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold">Authentication Tests</CardTitle>
        <button
          onClick={runTests}
          disabled={isRunning}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            isRunning 
              ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
              : "bg-primary text-white hover:bg-primary/90"
          }`}
        >
          {isRunning ? "Running Tests..." : "Run Tests"}
        </button>
      </CardHeader>
      
      <CardContent className="pt-2">
        {results.length === 0 && !isRunning ? (
          <p className="text-muted-foreground text-sm">No tests have been run yet.</p>
        ) : (
          <div className="space-y-3">
            {results.map((result, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${
                  result.status === "PASS" 
                    ? "bg-green-50 border-green-200" 
                    : result.status === "FAIL" 
                      ? "bg-red-50 border-red-200" 
                      : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{result.name}</h3>
                  <span 
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      result.status === "PASS" 
                        ? "bg-green-500 text-white" 
                        : result.status === "FAIL" 
                          ? "bg-red-500 text-white" 
                          : "bg-blue-500 text-white"
                    }`}
                  >
                    {result.status}
                  </span>
                </div>
                
                <div className="space-y-1 text-sm">
                  {Object.entries(result.metrics).map(([key, value], idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="text-muted-foreground">{key}:</span>
                      <span className="font-mono">{value.toString()}</span>
                    </div>
                  ))}
                  <div className="text-xs text-muted-foreground mt-2">
                    {result.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
