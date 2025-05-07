import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useValuationResult } from '@/hooks/useValuationResult';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft } from 'lucide-react';

// Import the new components
import { ResultHeader } from '@/components/result/ResultHeader';
import { VehicleDetailsCard } from '@/components/result/VehicleDetailsCard';
import { ValuationTabContent } from '@/components/result/ValuationTabContent';
import { NextStepsCard } from '@/components/result/NextStepsCard';
import { useValuationId } from '@/components/result/useValuationId';

const ResultPage = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('valuation');
  
  // Use the custom hook to retrieve valuation ID
  const { valuationId, manualData } = useValuationId(
    searchParams.get('valuationId')
  );

  // Fetch the valuation data using the valuationId
  const { 
    data: valuationData, 
    isLoading, 
    error,
    isError
  } = useValuationResult(valuationId || '');

  // Construct vehicle name for display
  const vehicleName = valuationData 
    ? `${valuationData.year} ${valuationData.make} ${valuationData.model}` 
    : manualData 
      ? `${manualData.year} ${manualData.make} ${manualData.model}` 
      : undefined;

  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-6">Valuation Results</h1>
        <Card>
          <div className="p-8">
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-12 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
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
      <ResultHeader vehicleName={vehicleName} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="valuation">Valuation</TabsTrigger>
              <TabsTrigger value="details">Vehicle Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="valuation" className="space-y-6">
              <ValuationTabContent 
                valuationId={valuationId} 
                manualData={manualData} 
              />
            </TabsContent>
            
            <TabsContent value="details">
              <VehicleDetailsCard 
                make={valuationData?.make || manualData?.make}
                model={valuationData?.model || manualData?.model}
                year={valuationData?.year || manualData?.year}
                mileage={valuationData?.mileage || manualData?.mileage}
                condition={valuationData?.condition || manualData?.condition}
                zipCode={valuationData?.zipCode || manualData?.zipCode}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <NextStepsCard />
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
