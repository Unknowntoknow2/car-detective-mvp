import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, RefreshCw, Database } from 'lucide-react';
import { checkPersistenceHealth, runPersistenceTests, type PersistenceHealth } from '@/services/persistence/persistenceMonitor';

export const PersistenceHealthDashboard: React.FC = () => {
  const [health, setHealth] = useState<PersistenceHealth | null>(null);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  const loadHealth = async () => {
    setLoading(true);
    try {
      const healthData = await checkPersistenceHealth();
      setHealth(healthData);
    } catch (error) {
      console.error('Failed to load persistence health:', error);
    } finally {
      setLoading(false);
    }
  };

  const runTests = async () => {
    setTesting(true);
    try {
      const results = await runPersistenceTests();
      setTestResults(results);
      await loadHealth(); // Refresh health after tests
    } catch (error) {
      console.error('Failed to run persistence tests:', error);
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    loadHealth();
  }, []);

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (working: boolean) => {
    return working ? (
      <CheckCircle className="h-5 w-5 text-green-600" />
    ) : (
      <AlertCircle className="h-5 w-5 text-red-600" />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Database className="h-6 w-6" />
          Data Persistence Health
        </h2>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={loadHealth}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={runTests}
            disabled={testing}
            className="flex items-center gap-2"
          >
            {testing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Database className="h-4 w-4" />
            )}
            Run Tests
          </Button>
        </div>
      </div>

      {health && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Overall Health Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Health Score
                <Badge 
                  variant={health.healthScore >= 80 ? 'default' : health.healthScore >= 60 ? 'secondary' : 'destructive'}
                  className={getHealthColor(health.healthScore)}
                >
                  {health.healthScore}%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      health.healthScore >= 80 ? 'bg-green-600' :
                      health.healthScore >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${health.healthScore}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Overall system health based on persistence functionality
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Audit Logs Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Audit Logs
                {getStatusIcon(health.auditLogsWorking)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Total Records:</span> {health.totalAuditLogs}
                </p>
                {health.lastAuditLog && (
                  <p className="text-sm">
                    <span className="font-medium">Last Entry:</span> {health.lastAuditLog.toLocaleString()}
                  </p>
                )}
                <Badge variant={health.auditLogsWorking ? 'default' : 'destructive'}>
                  {health.auditLogsWorking ? 'Working' : 'Failed'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Valuation Requests Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Valuation Requests
                {getStatusIcon(health.valuationRequestsWorking)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Total Records:</span> {health.totalValuationRequests}
                </p>
                {health.lastValuationRequest && (
                  <p className="text-sm">
                    <span className="font-medium">Last Entry:</span> {health.lastValuationRequest.toLocaleString()}
                  </p>
                )}
                <Badge variant={health.valuationRequestsWorking ? 'default' : 'destructive'}>
                  {health.valuationRequestsWorking ? 'Working' : 'Failed'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Test Results */}
      {testResults && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  Audit Log Test
                  {getStatusIcon(testResults.auditTest.success)}
                </h4>
                {testResults.auditTest.success ? (
                  <p className="text-sm text-green-600">
                    ✅ Successfully created test audit log: {testResults.auditTest.id}
                  </p>
                ) : (
                  <p className="text-sm text-red-600">
                    ❌ Failed: {testResults.auditTest.error}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  Valuation Request Test
                  {getStatusIcon(testResults.requestTest.success)}
                </h4>
                {testResults.requestTest.success ? (
                  <p className="text-sm text-green-600">
                    ✅ Successfully created test request: {testResults.requestTest.id}
                  </p>
                ) : (
                  <p className="text-sm text-red-600">
                    ❌ Failed: {testResults.requestTest.error}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};