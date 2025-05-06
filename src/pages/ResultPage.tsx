
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ValuationResult } from '@/components/valuation/free/ValuationResult';
import { PredictionResult } from '@/components/valuation/PredictionResult';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useValuationResult } from '@/hooks/useValuationResult';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, FileSearch } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from 'react-router-dom';

const ResultPage = () => {
  const [searchParams] = useSearchParams();
  const [valuationId, setValuationId] = useState<string | undefined>(
    searchParams.get('valuationId') || undefined
  );
  const [activeTab, setActiveTab] = useState('valuation');
  const [manualData, setManualData] = useState<any>(null);

  // Try to get valuationId from various sources
  useEffect(() => {
    const getValuationId = () => {
      // First check URL query param (highest priority)
      if (searchParams.get('valuationId')) {
        return searchParams.get('valuationId') || undefined;
      }
      
      // Then check latest_valuation_id in localStorage
      const storedId = localStorage.getItem('latest_valuation_id');
      if (storedId) {
        console.log('Retrieved valuationId from localStorage:', storedId);
        return storedId;
      }
      
      // Check if manual valuation data exists
      const manualData = localStorage.getItem('manual_valuation_data');
      if (manualData) {
        try {
          const parsedData = JSON.parse(manualData);
          setManualData(parsedData);
          return parsedData.valuationId;
        } catch (e) {
          console.error('Error parsing manual valuation data:', e);
        }
      }
      
      return undefined;
    };

    const id = getValuationId();
    if (id && id !== valuationId) {
      setValuationId(id);
    }
  }, [searchParams, valuationId]);

  // Fetch the valuation data using the valuationId
  const { 
    data: valuationData, 
    isLoading, 
    error, 
    isError,
    refetch 
  } = useValuationResult(valuationId || '');

  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-6">Valuation Results</h1>
        <Card>
          <CardContent className="p-8">
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-12 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || (!valuationId && !manualData)) {
    return (
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-6">Valuation Results</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Unable to load valuation</AlertTitle>
          <AlertDescription className="space-y-4">
            <p>{error?.message || "We couldn't find your valuation data. Please try submitting your vehicle information again."}</p>
            <div className="mt-4">
              <Link to="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Return Home
                </Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Valuation Results</h1>
          <p className="text-muted-foreground mt-2">
            {valuationData ? 
              `${valuationData.year} ${valuationData.make} ${valuationData.model}` : 
              manualData ? 
                `${manualData.year} ${manualData.make} ${manualData.model}` : 
                'Vehicle Valuation'}
          </p>
        </div>
        <Link to="/" className="mt-4 lg:mt-0">
          <Button variant="outline" className="flex items-center gap-2">
            <FileSearch className="h-4 w-4" />
            New Valuation
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="valuation">Valuation</TabsTrigger>
              <TabsTrigger value="details">Vehicle Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="valuation" className="space-y-6">
              {valuationId ? (
                <PredictionResult 
                  valuationId={valuationId} 
                  manualValuation={manualData}
                />
              ) : manualData ? (
                <PredictionResult 
                  valuationId="" 
                  manualValuation={{
                    make: manualData.make,
                    model: manualData.model,
                    year: parseInt(manualData.year, 10),
                    mileage: parseInt(manualData.mileage, 10),
                    condition: manualData.condition,
                    zipCode: manualData.zipCode,
                    valuation: manualData.valuation
                  }}
                />
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Missing Data</AlertTitle>
                  <AlertDescription>
                    We couldn't find valuation data for this vehicle.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
            
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Make</dt>
                      <dd className="text-lg font-semibold">
                        {valuationData?.make || manualData?.make || 'N/A'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Model</dt>
                      <dd className="text-lg font-semibold">
                        {valuationData?.model || manualData?.model || 'N/A'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Year</dt>
                      <dd className="text-lg font-semibold">
                        {valuationData?.year || manualData?.year || 'N/A'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Mileage</dt>
                      <dd className="text-lg font-semibold">
                        {valuationData?.mileage 
                          ? valuationData.mileage.toLocaleString() + ' miles'
                          : manualData?.mileage
                            ? manualData.mileage.toLocaleString() + ' miles'
                            : 'N/A'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Condition</dt>
                      <dd className="text-lg font-semibold">
                        {valuationData?.condition || manualData?.condition || 'N/A'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Location</dt>
                      <dd className="text-lg font-semibold">
                        {valuationData?.zipCode || manualData?.zipCode || 'N/A'}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Premium Report</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Get a detailed valuation report with CARFAX history and more accurate pricing.
                </p>
                <Link to="/premium">
                  <Button variant="default" size="sm" className="mt-2 w-full">
                    Get Premium Valuation
                  </Button>
                </Link>
              </div>
              
              <div>
                <h3 className="font-medium">Current Offers</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  View current offers from dealers in your area.
                </p>
                <Link to="/offers">
                  <Button variant="outline" size="sm" className="mt-2 w-full">
                    View Offers
                  </Button>
                </Link>
              </div>
              
              <div>
                <h3 className="font-medium">Save This Valuation</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Create an account to save and track your valuations over time.
                </p>
                <Link to="/register">
                  <Button variant="outline" size="sm" className="mt-2 w-full">
                    Create Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
