
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { runPhase2Audit } from '@/utils/diagnostics/phase2Audit';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface AuditResult {
  testName: string;
  passed: boolean;
  details: string;
  logs: string[];
}

export const Phase2AuditPanel: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<AuditResult[]>([]);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  const handleRunAudit = async () => {
    setIsRunning(true);
    try {
      console.log('🔍 Starting Phase 2 Audit from UI...');
      const auditResults = await runPhase2Audit();
      setResults(auditResults);
      setLastRun(new Date());
    } catch (error) {
      console.error('❌ Audit failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const passedTests = results.filter(r => r.passed).length;
  const totalTests = results.length;
  const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

  const getStatusIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-red-600" />
    );
  };

  const getOverallStatus = () => {
    if (totalTests === 0) return { color: 'secondary', text: 'Not Run' };
    if (passRate >= 85) return { color: 'default', text: 'VALIDATED' };
    if (passRate >= 70) return { color: 'secondary', text: 'NEEDS ATTENTION' };
    return { color: 'destructive', text: 'FAILED' };
  };

  const overallStatus = getOverallStatus();

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            Phase 2 Market Data Audit
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={overallStatus.color as any}>
              {overallStatus.text}
            </Badge>
            {totalTests > 0 && (
              <Badge variant="outline">
                {passedTests}/{totalTests} ({passRate}%)
              </Badge>
            )}
          </div>
        </div>
        {lastRun && (
          <p className="text-sm text-muted-foreground">
            Last run: {lastRun.toLocaleString()}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleRunAudit} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Running Audit...
            </>
          ) : (
            'Run Phase 2 Audit'
          )}
        </Button>

        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold">Audit Results</h3>
            {results.map((result, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.passed)}
                      <h4 className="font-medium">{result.testName}</h4>
                    </div>
                    <Badge variant={result.passed ? 'default' : 'destructive'}>
                      {result.passed ? 'PASS' : 'FAIL'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {result.details}
                  </p>
                  {result.logs.length > 0 && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                        View logs ({result.logs.length} entries)
                      </summary>
                      <div className="mt-2 p-2 bg-muted rounded max-h-40 overflow-y-auto">
                        {result.logs.map((log, logIndex) => (
                          <div key={logIndex} className="font-mono">
                            {log}
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>This audit validates:</p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>MSRP data injection and retrieval</li>
            <li>VIN storage and linkage across tables</li>
            <li>Diagnostic logging execution</li>
            <li>Confidence scoring adjustments</li>
            <li>Market diagnostics coverage</li>
            <li>TypeScript compliance</li>
            <li>Follow-up orphan prevention</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
