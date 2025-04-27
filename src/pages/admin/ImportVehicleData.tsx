
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Loader2, Check, AlertTriangle, Database, Car } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export default function ImportVehicleData() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    success?: boolean;
    makeCount?: number;
    modelCount?: number;
    error?: string;
  } | null>(null);

  const importVehicleData = async () => {
    setIsLoading(true);
    setResults(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('import-vehicle-data');
      
      if (error) throw error;
      
      setResults(data);
      
      if (data.success) {
        toast.success(`Imported ${data.makeCount} makes and ${data.modelCount} models`);
      } else {
        toast.error(`Import failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Vehicle data import error:', error);
      setResults({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      toast.error('Failed to import vehicle data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Import Vehicle Data</h1>
      <p className="text-muted-foreground mb-8">
        This tool imports vehicle makes and models into the Supabase database.
      </p>
      
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Data Import</CardTitle>
          <CardDescription>
            Import comprehensive vehicle data from fallback source.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Importing data...</span>
                <span className="text-sm">Please wait</span>
              </div>
              <Progress value={undefined} className="h-2" />
            </div>
          )}
          
          {results && (
            <div className={`p-4 rounded-md ${
              results.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-start">
                {results.success ? (
                  <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                )}
                <div>
                  <h4 className={`font-medium ${
                    results.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {results.success ? 'Import Successful' : 'Import Failed'}
                  </h4>
                  <p className={`text-sm ${
                    results.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {results.success 
                      ? `Imported ${results.makeCount} makes and ${results.modelCount} models` 
                      : results.error}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={importVehicleData} 
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing Data...
              </>
            ) : (
              <>
                <Car className="mr-2 h-4 w-4" />
                Import Vehicle Data
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
