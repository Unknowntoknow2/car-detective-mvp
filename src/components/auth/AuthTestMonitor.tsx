
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
    
    // Test 2: Input Sanitization
    await runInputSanitizationTest();
    
    // Test 3: Accessibility Test
    await runAccessibilityTest();
    
    // Test 4: Brute Force Test
    await runBruteForceTest();
    
    // Test 5: Token Expiry Test
    await runTokenExpiryTest();
    
    // Test 6: GDPR Compliance Test
    await runGDPRComplianceTest();
    
    // Test 7: Social Login Identity Test
    await runSocialLoginTest();
    
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
  
  const runInputSanitizationTest = async () => {
    const result: TestResult = {
      name: "Input Field Sanitization",
      status: "RUNNING",
      metrics: {
        "Fields tested": 0,
        "Blocked payloads": 0,
        "Security alerts": false
      },
      timestamp: new Date()
    };
    
    setResults(prev => [...prev, result]);
    
    // Simulate test running
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    // Update with results
    const updatedResult: TestResult = {
      ...result,
      status: "PASS",
      metrics: {
        "Fields tested": 5,
        "Blocked payloads": 12,
        "Security alerts": true
      },
      timestamp: new Date()
    };
    
    setResults(prev => prev.map(r => 
      r.name === updatedResult.name ? updatedResult : r
    ));
  };
  
  const runAccessibilityTest = async () => {
    const result: TestResult = {
      name: "Accessibility Compliance",
      status: "RUNNING",
      metrics: {
        "ARIA labels": "checking...",
        "Tab order": "checking...",
        "WCAG Compliance": "checking..."
      },
      timestamp: new Date()
    };
    
    setResults(prev => [...prev, result]);
    
    // Simulate test running
    await new Promise(resolve => setTimeout(resolve, 2200));
    
    // Update with results
    const updatedResult: TestResult = {
      ...result,
      status: "PASS",
      metrics: {
        "ARIA labels": "100%",
        "Tab order": "Correct",
        "WCAG Compliance": "AA"
      },
      timestamp: new Date()
    };
    
    setResults(prev => prev.map(r => 
      r.name === updatedResult.name ? updatedResult : r
    ));
  };
  
  const runBruteForceTest = async () => {
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
  
  const runTokenExpiryTest = async () => {
    const result: TestResult = {
      name: "Token Expiry & Session",
      status: "RUNNING",
      metrics: {
        "Idle timeout": "checking...",
        "Re-auth prompt": false,
        "Token reuse blocked": false
      },
      timestamp: new Date()
    };
    
    setResults(prev => [...prev, result]);
    
    // Simulate test running
    await new Promise(resolve => setTimeout(resolve, 1700));
    
    // Update with results
    const updatedResult: TestResult = {
      ...result,
      status: "PASS",
      metrics: {
        "Idle timeout": "40min",
        "Re-auth prompt": true,
        "Token reuse blocked": true
      },
      timestamp: new Date()
    };
    
    setResults(prev => prev.map(r => 
      r.name === updatedResult.name ? updatedResult : r
    ));
  };
  
  const runGDPRComplianceTest = async () => {
    const result: TestResult = {
      name: "GDPR Compliance",
      status: "RUNNING",
      metrics: {
        "Consent logging": "checking...",
        "Opt-in toggles": "checking...",
        "Region notices": false
      },
      timestamp: new Date()
    };
    
    setResults(prev => [...prev, result]);
    
    // Simulate test running
    await new Promise(resolve => setTimeout(resolve, 1900));
    
    // Update with results
    const updatedResult: TestResult = {
      ...result,
      status: "PASS",
      metrics: {
        "Consent logging": "Complete",
        "Opt-in toggles": "Implemented",
        "Region notices": true
      },
      timestamp: new Date()
    };
    
    setResults(prev => prev.map(r => 
      r.name === updatedResult.name ? updatedResult : r
    ));
  };
  
  const runSocialLoginTest = async () => {
    const result: TestResult = {
      name: "Social Login Identity",
      status: "RUNNING",
      metrics: {
        "Profile merge": "checking...",
        "User ID consistency": false,
        "Token validation": "checking..."
      },
      timestamp: new Date()
    };
    
    setResults(prev => [...prev, result]);
    
    // Simulate test running
    await new Promise(resolve => setTimeout(resolve, 2100));
    
    // Update with results
    const updatedResult: TestResult = {
      ...result,
      status: "PASS",
      metrics: {
        "Profile merge": "MERGED",
        "User ID consistency": true,
        "Token validation": "Successful"
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
          <p className="text-muted-foreground text-sm">No tests have been run yet. Click "Run Tests" to start the authentication test suite.</p>
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
