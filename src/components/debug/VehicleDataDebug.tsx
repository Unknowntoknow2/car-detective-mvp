
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { diagnoseVehicleData, logDiagnosticsReport, VehicleDataDiagnostics } from '@/utils/diagnostics/vehicleDataDiagnostics';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, RefreshCw, Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export function VehicleDataDebug() {
  const [diagnostics, setDiagnostics] = useState<VehicleDataDiagnostics | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionTest, setConnectionTest] = useState<{
    connected: boolean;
    makesCount: number;
    modelsCount: number;
    sampleMakes: any[];
    sampleModels: any[];
  } | null>(null);

  const runDiagnostics = async () => {
    setIsRunning(true);
    setError(null);
    
    try {
      const result = await diagnoseVehicleData();
      setDiagnostics(result);
      logDiagnosticsReport(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  const testConnection = async () => {
    setIsRunning(true);
    try {
      logger.log('Testing database connection...');
      
      // Test makes table
      const { data: makes, error: makesError, count: makesCount } = await supabase
        .from('makes')
        .select('*', { count: 'exact' })
        .limit(3);
      
      if (makesError) throw makesError;
      
      // Test models table
      const { data: models, error: modelsError, count: modelsCount } = await supabase
        .from('models')
        .select('*', { count: 'exact' })
        .limit(3);
      
      if (modelsError) throw modelsError;
      
      // Test relationship
      const { data: relationship } = await supabase
        .from('makes')
        .select(`
          id,
          make_name,
          models:models(count)
        `)
        .limit(3);
      
      logger.log('Connection test results:', {
        makesCount,
        modelsCount,
        makes: makes?.slice(0, 3),
        models: models?.slice(0, 3),
        relationship
      });
      
      setConnectionTest({
        connected: true,
        makesCount: makesCount || 0,
        modelsCount: modelsCount || 0,
        sampleMakes: makes || [],
        sampleModels: models || []
      });
      
    } catch (err: any) {
      setError('Connection test failed: ' + err.message);
      setConnectionTest({
        connected: false,
        makesCount: 0,
        modelsCount: 0,
        sampleMakes: [],
        sampleModels: []
      });
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
        <div className="flex gap-2">
          <Button 
            onClick={testConnection} 
            disabled={isRunning}
            variant="outline"
            className="flex-1"
          >
            {isRunning ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Test Database Connection
              </>
            )}
          </Button>
          
          <Button 
            onClick={runDiagnostics} 
            disabled={isRunning}
            className="flex-1"
          >
            {isRunning ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Running Diagnostics...
              </>
            ) : (
              'Run Full Diagnostics'
            )}
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">Error:</p>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {connectionTest && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
              <Database className="h-4 w-4" />
              Database Connection Test
            </h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-900">{connectionTest.makesCount}</div>
                <div className="text-sm text-blue-700">Total Makes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-900">{connectionTest.modelsCount}</div>
                <div className="text-sm text-blue-700">Total Models</div>
              </div>
            </div>
            
            {connectionTest.sampleMakes.length > 0 && (
              <div className="mb-3">
                <div className="text-sm font-medium text-blue-800 mb-1">Sample Makes:</div>
                <div className="flex flex-wrap gap-1">
                  {connectionTest.sampleMakes.map((make, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                      {make.make_name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {connectionTest.sampleModels.length > 0 && (
              <div>
                <div className="text-sm font-medium text-blue-800 mb-1">Sample Models:</div>
                <div className="flex flex-wrap gap-1">
                  {connectionTest.sampleModels.map((model, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                      {model.model_name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
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
