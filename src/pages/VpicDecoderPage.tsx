
import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useVpicVinLookup } from '@/hooks/useVpicVinLookup';
import { VpicVinLookup } from '@/components/valuation/VpicVinLookup';
import { VinInput } from '@/components/premium/lookup/vin/VinInput';
import { VinSubmitButton } from '@/components/premium/lookup/VinSubmitButton';
import { useVinInput } from '@/hooks/useVinInput';
import { toast } from 'sonner';
import { LoadingState } from '@/components/premium/common/LoadingState';
import { ErrorState } from '@/components/premium/common/ErrorState';

export default function VpicDecoderPage() {
  const [submittedVin, setSubmittedVin] = useState('');
  
  const {
    value: vin,
    handleInputChange,
    validationError,
    touched,
    isValid
  } = useVinInput({
    onValidChange: (valid) => {
      // This can be used for UI feedback if needed
    }
  });

  const handleSubmit = () => {
    if (isValid) {
      setSubmittedVin(vin);
      toast.success("Looking up VIN information");
    } else if (validationError) {
      toast.error(validationError);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) {
      handleSubmit();
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container py-10">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-3 text-gray-900">NHTSA vPIC Decoder</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Decode your vehicle's information using the National Highway Traffic Safety Administration's 
              Vehicle Product Information Catalog and VIN Decoder database.
            </p>
          </div>
          
          <Card className="mb-8 border-primary/10 shadow-md">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle className="text-primary-800">Enter Vehicle VIN</CardTitle>
              <CardDescription>
                Enter a valid 17-character Vehicle Identification Number to retrieve detailed specifications
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <VinInput
                  value={vin}
                  onChange={handleInputChange}
                  validationError={validationError}
                  touched={touched}
                  isValid={isValid}
                  isLoading={false}
                  onKeyPress={handleKeyPress}
                />
                
                <VinSubmitButton
                  onClick={handleSubmit}
                  disabled={!isValid}
                  isLoading={false}
                />
              </div>
            </CardContent>
          </Card>
          
          {submittedVin && (
            <VpicResultsSection vin={submittedVin} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Separate component to handle the VPIC lookup results
function VpicResultsSection({ vin }: { vin: string }) {
  const { data, loading, error, source, fetchedAt, refresh } = useVpicVinLookup(vin);
  
  return (
    <Card className="border-2 border-primary/10 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between border-b border-primary/10">
        <div>
          <CardTitle className="text-2xl">VIN Lookup Results</CardTitle>
          <CardDescription>
            {data ? `${data.year} ${data.make} ${data.model}` : 'Retrieving vehicle information...'}
          </CardDescription>
        </div>
        {source && (
          <div className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full">
            Source: {source === 'api' ? 'NHTSA API' : 'Cached Data'}
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-6">
        {loading && (
          <LoadingState 
            text="Retrieving vehicle data from NHTSA..." 
            size="md"
          />
        )}
        
        {error && !loading && (
          <ErrorState 
            title="Error Retrieving Vehicle Data" 
            message={error}
            onRetry={refresh}
          />
        )}
        
        {data && !loading && !error && (
          <div className="space-y-6">
            <VpicVinLookup vin={vin} />
            
            {fetchedAt && (
              <div className="text-xs text-muted-foreground text-right mt-4">
                Data retrieved: {new Date(fetchedAt).toLocaleString()}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
