/**
 * PHASE 1 COMPLETION: VIN Pipeline Debugger Component
 * 
 * Real-time debugging tool for the VIN decode pipeline
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, PlayCircle, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { testVinPipeline, CompletePipelineTest, runDevelopmentTest } from '@/utils/vinPipelineTest';

export function VinPipelineDebugger() {
  const [vin, setVin] = useState('2C3CDZAG5HH658653');
  const [isRunning, setIsRunning] = useState(false);
  const [testResult, setTestResult] = useState<CompletePipelineTest | null>(null);

  const runTest = async (testVin?: string) => {
    setIsRunning(true);
    setTestResult(null);

    try {
      const result = testVin 
        ? await testVinPipeline(testVin) 
        : await runDevelopmentTest();
      setTestResult(result);
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStepIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <XCircle className="w-4 h-4 text-red-600" />
    );
  };

  const getSummaryBadge = (key: keyof CompletePipelineTest['summary'], value: boolean) => {
    return (
      <Badge variant={value ? "default" : "destructive"} className="text-xs">
        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}: {value ? '✓' : '✗'}
      </Badge>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          VIN Pipeline Debugger
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Test the complete VIN decode pipeline from edge function to database
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Test Controls */}
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Test VIN</label>
            <Input
              value={vin}
              onChange={(e) => setVin(e.target.value)}
              placeholder="Enter 17-character VIN"
              maxLength={17}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => runTest(vin)}
              disabled={isRunning || vin.length !== 17}
              className="flex items-center gap-2"
            >
              {isRunning ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <PlayCircle className="w-4 h-4" />
              )}
              Test VIN
            </Button>
            
            <Button 
              onClick={() => runTest()}
              disabled={isRunning}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isRunning ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <PlayCircle className="w-4 h-4" />
              )}
              Dev Test
            </Button>
          </div>
        </div>

        {/* Test Results */}
        {testResult && (
          <div className="space-y-4">
            {/* Overall Status */}
            <Card className={`border-2 ${testResult.overallSuccess ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {testResult.overallSuccess ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                    <div>
                      <h3 className="font-semibold">
                        Pipeline {testResult.overallSuccess ? 'WORKING' : 'BROKEN'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        VIN: {testResult.vin}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {testResult.steps.filter(s => s.success).length}/{testResult.steps.length}
                    </div>
                    <div className="text-xs text-muted-foreground">steps passed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary Badges */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(testResult.summary).map(([key, value]) => (
                <div key={key}>
                  {getSummaryBadge(key as keyof CompletePipelineTest['summary'], value)}
                </div>
              ))}
            </div>

            {/* Detailed Steps */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Detailed Test Results</h4>
              {testResult.steps.map((step, index) => (
                <Card key={index} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getStepIcon(step.success)}
                        <div className="flex-1">
                          <div className="font-medium text-sm">{step.step}</div>
                          {step.error && (
                            <div className="text-xs text-red-600 mt-1">{step.error}</div>
                          )}
                          {step.data && (
                            <div className="text-xs text-muted-foreground mt-1">
                              <pre className="whitespace-pre-wrap">
                                {JSON.stringify(step.data, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(step.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-semibold text-sm mb-2">How to Use</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• Enter a 17-character VIN and click "Test VIN" to test the complete pipeline</li>
              <li>• Click "Dev Test" to run with the default test VIN (2C3CDZAG5HH658653)</li>
              <li>• All steps must pass for the pipeline to be considered working</li>
              <li>• Check the browser console for detailed logs during testing</li>
            </ul>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}