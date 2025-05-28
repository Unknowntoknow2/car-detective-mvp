
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { diagnoseVehicleData, logDiagnosticsReport, VehicleDataDiagnostics } from '@/utils/diagnostics/vehicleDataDiagnostics';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

export function VehicleDataDebug() {
  const [diagnostics, setDiagnostics] = useState<VehicleDataDiagnostics | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runDiagnostics = async () => {
    setIsRunning(true);
    setError(null);
    
    try {
      const result = await diagnoseVehicleData();
      setDiagnostics(result);
      logDiagnosticsReport(result);
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to run diagnostics:', err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Vehicle Data Diagnostics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runDiagnostics} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Running Diagnostics...
            </>
          ) : (
            'Run Vehicle Data Diagnostics'
          )}
        </Button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">Error running diagnostics:</p>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {diagnostics && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-2xl font-bold text-blue-900">{diagnostics.totalMakes}</div>
                <div className="text-sm text-blue-700">Total Makes</div>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-2xl font-bold text-green-900">{diagnostics.makesWithModels}</div>
                <div className="text-sm text-green-700">Makes with Models</div>
              </div>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-2xl font-bold text-red-900">{diagnostics.makesWithoutModels.length}</div>
                <div className="text-sm text-red-700">Makes without Models</div>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="text-2xl font-bold text-purple-900">{diagnostics.totalModels}</div>
                <div className="text-sm text-purple-700">Total Models</div>
              </div>
            </div>

            {diagnostics.makesWithoutModels.length > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Makes without Models:</h4>
                <div className="flex flex-wrap gap-2">
                  {diagnostics.makesWithoutModels.slice(0, 10).map((make, index) => (
                    <Badge key={index} variant="secondary" className="bg-yellow-100 text-yellow-800">
                      {make}
                    </Badge>
                  ))}
                  {diagnostics.makesWithoutModels.length > 10 && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      +{diagnostics.makesWithoutModels.length - 10} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {diagnostics.orphanedModels.length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-900 mb-2">Orphaned Models:</h4>
                <div className="flex flex-wrap gap-2">
                  {diagnostics.orphanedModels.slice(0, 10).map((model, index) => (
                    <Badge key={index} variant="destructive">
                      {model}
                    </Badge>
                  ))}
                  {diagnostics.orphanedModels.length > 10 && (
                    <Badge variant="destructive">
                      +{diagnostics.orphanedModels.length - 10} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Recommended Actions:
              </h4>
              <ul className="space-y-1">
                {diagnostics.recommendedActions.map((action, index) => (
                  <li key={index} className="text-gray-700 text-sm">
                    • {action}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
