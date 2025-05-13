
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useManualValuation } from '@/hooks/useManualValuation';
import { ManualVehicleForm } from '@/components/valuation/free/ManualVehicleForm';
import { ValuationResult } from '@/components/valuation/free/ValuationResult';

const FreeValuationPage = () => {
  const {
    formData,
    setFormData,
    valuation,
    isLoading,
    error,
    handleSubmit,
    valuationId,
    resetForm
  } = useManualValuation();

  const hasResults = valuation !== null;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Free Vehicle Valuation</h1>
      
      {hasResults ? (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Vehicle Valuation</CardTitle>
              <CardDescription>
                Based on the information you provided
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ValuationResult valuationData={valuation} valuationId={valuationId} />
              
              <div className="mt-6">
                <button 
                  onClick={resetForm}
                  className="text-primary font-medium hover:underline"
                >
                  Start a new valuation
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Enter Your Vehicle Details</CardTitle>
            <CardDescription>
              Provide information about your vehicle to get an estimated value
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="manual" className="w-full">
              <TabsList className="grid w-full grid-cols-1 mb-6">
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              </TabsList>
              
              <TabsContent value="manual" className="pt-2">
                <ManualVehicleForm 
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  error={error}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FreeValuationPage;
