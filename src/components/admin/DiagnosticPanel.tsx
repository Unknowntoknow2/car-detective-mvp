
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { runValuationAudit, printAuditReport, type AuditResult } from '@/utils/diagnostics/valuationAudit';
import { CheckCircle, AlertTriangle, XCircle, Search } from 'lucide-react';

export function DiagnosticPanel() {
  const [vin, setVin] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);

  const handleRunAudit = async () => {
    if (!vin || vin.length !== 17) {
      alert('Please enter a valid 17-character VIN');
      return;
    }

    setIsRunning(true);
    try {
      const result = await runValuationAudit(vin);
      setAuditResult(result);
      printAuditReport(result); // Also log to console for dev
    } catch (error) {
      console.error('Audit failed:', error);
      alert('Audit failed. Check console for details.');
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'fail': return <XCircle className="h-5 w-5 text-red-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'fail': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-6 w-6" />
          Valuation System Diagnostic
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter VIN (17 characters)"
              value={vin}
              onChange={(e) => setVin(e.target.value.toUpperCase())}
              maxLength={17}
              className="font-mono"
            />
            <Button 
              onClick={handleRunAudit}
              disabled={isRunning || vin.length !== 17}
            >
              {isRunning ? 'Running...' : 'Run Audit'}
            </Button>
          </div>

          {auditResult && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {getStatusIcon(auditResult.status)}
                <Badge className={getStatusColor(auditResult.status)}>
                  {auditResult.status.toUpperCase()}
                </Badge>
                <span className="text-sm text-gray-500">
                  {auditResult.timestamp}
                </span>
              </div>

              <Tabs defaultValue="summary" className="w-full">
                <TabsList>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="errors">Errors ({auditResult.errors.length})</TabsTrigger>
                  <TabsTrigger value="warnings">Warnings ({auditResult.warnings.length})</TabsTrigger>
                  <TabsTrigger value="data">Data Points</TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 border rounded">
                      <div className="text-lg font-bold">
                        {auditResult.dataPoints.valuation ? '✅' : '❌'}
                      </div>
                      <div className="text-sm">Valuation</div>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <div className="text-lg font-bold">
                        {auditResult.dataPoints.followupAnswers ? '✅' : '⚠️'}
                      </div>
                      <div className="text-sm">Follow-ups</div>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <div className="text-lg font-bold">
                        {auditResult.dataPoints.auctionResults ? 
                          `✅ (${auditResult.dataPoints.auctionResults.length})` : '⚠️'}
                      </div>
                      <div className="text-sm">Auctions</div>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <div className="text-lg font-bold">
                        {auditResult.dataPoints.marketplaceListings ? 
                          `✅ (${auditResult.dataPoints.marketplaceListings.length})` : '⚠️'}
                      </div>
                      <div className="text-sm">Listings</div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="errors">
                  {auditResult.errors.length > 0 ? (
                    <div className="space-y-2">
                      {auditResult.errors.map((error, index) => (
                        <div key={index} className="p-3 bg-red-50 border border-red-200 rounded text-red-800">
                          {error}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-green-600 py-8">
                      ✅ No errors detected
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="warnings">
                  {auditResult.warnings.length > 0 ? (
                    <div className="space-y-2">
                      {auditResult.warnings.map((warning, index) => (
                        <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                          {warning}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-green-600 py-8">
                      ✅ No warnings detected
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="data">
                  <div className="space-y-4">
                    {Object.entries(auditResult.dataPoints).map(([key, value]) => (
                      <div key={key} className="border rounded p-4">
                        <h4 className="font-semibold mb-2 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                          {JSON.stringify(value, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
