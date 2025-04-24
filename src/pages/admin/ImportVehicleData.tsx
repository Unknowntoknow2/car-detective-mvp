
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Loader2, Check, AlertTriangle, Database, Car } from 'lucide-react';
import { toast } from 'sonner';

export default function ImportVehicleData() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    success?: boolean;
    message?: string;
    makes?: number;
    models?: number;
    error?: string;
  } | null>(null);

  const fetchVehicleData = async () => {
    setIsLoading(true);
    setResults(null);
    
    try {
      const response = await fetch('/functions/fetch-vehicle-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      
      const data = await response.json();
      setResults(data);
      
      if (data.success) {
        toast.success('Vehicle data imported successfully');
      } else {
        toast.error(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
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
        This tool imports vehicle makes and models from the NHTSA vPIC API into the Supabase database.
      </p>
      
      <Card>
        <CardHeader>
          <CardTitle>NHTSA Vehicle Data Import</CardTitle>
          <CardDescription>
            Import comprehensive vehicle data from the National Highway Traffic Safety Administration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Database className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-medium">Data Source</h3>
                <p className="text-sm text-muted-foreground">
                  NHTSA Vehicle Product Information Catalog (vPIC) API
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="font-medium">What will be imported:</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Vehicle makes (manufacturers) with logos</li>
                <li>Vehicle models for each make</li>
                <li>NHTSA reference IDs for future updates</li>
              </ul>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
                <div>
                  <h4 className="font-medium text-amber-800">Important Note</h4>
                  <p className="text-sm text-amber-700">
                    This process will take several minutes and may update existing data. 
                    It's recommended to run this during low-traffic periods.
                  </p>
                </div>
              </div>
            </div>
            
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
                      {results.message || results.error}
                    </p>
                    
                    {results.success && results.makes && results.models && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div className="bg-white bg-opacity-50 p-2 rounded">
                          <span className="block text-sm font-medium">Makes</span>
                          <span className="text-lg font-bold">{results.makes}</span>
                        </div>
                        <div className="bg-white bg-opacity-50 p-2 rounded">
                          <span className="block text-sm font-medium">Models</span>
                          <span className="text-lg font-bold">{results.models}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={fetchVehicleData} 
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
