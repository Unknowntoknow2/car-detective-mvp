
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useVpicVinLookup } from '@/hooks/useVpicVinLookup';
import { VpicVinLookup } from '@/components/valuation/VpicVinLookup';
import { VinInput } from '@/components/premium/lookup/vin/VinInput';
import { VinSubmitButton } from '@/components/premium/lookup/VinSubmitButton';
import { useVinInput } from '@/hooks/useVinInput';
import { toast } from 'sonner';
import { LoadingState } from '@/components/premium/common/LoadingState';
import { ErrorState } from '@/components/premium/common/ErrorState';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, CheckCircle2, Info, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { VpicVehicleData } from '@/types/vpic';

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
      <main className="flex-1 container py-10 px-4 md:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-3 text-gray-900">NHTSA vPIC Decoder</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Decode your vehicle's information using the National Highway Traffic Safety Administration's 
              Vehicle Product Information Catalog and VIN Decoder database.
            </p>
          </div>
          
          <Card className="mb-8 shadow-md border-primary/10 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/10">
              <CardTitle className="text-primary-800 flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Enter Vehicle VIN
              </CardTitle>
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
  
  // Derived data for display purposes
  const vehicleName = React.useMemo(() => {
    if (!data) return 'Unknown Vehicle';
    const year = data.modelYear || data.year || 'Unknown Year';
    const make = data.make || 'Unknown Make';
    const model = data.model || 'Unknown Model';
    return `${year} ${make} ${model}`;
  }, [data]);

  // Format the fetched date nicely
  const formattedDate = React.useMemo(() => {
    if (!fetchedAt) return null;
    return new Date(fetchedAt).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  }, [fetchedAt]);

  return (
    <Card className="border-2 border-primary/10 shadow-md overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-primary/10 bg-gradient-to-r from-white to-primary/5">
        <div>
          <CardTitle className="text-2xl flex items-center gap-2">
            {loading ? (
              <>Retrieving Vehicle Data...</>
            ) : error ? (
              <>
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Error Retrieving Data
              </>
            ) : data ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                VIN Lookup Results
              </>
            ) : (
              <>VIN Lookup Results</>
            )}
          </CardTitle>
          <CardDescription>
            {loading ? 'Please wait...' : (data ? vehicleName : 'Could not retrieve vehicle information')}
          </CardDescription>
        </div>
        
        <div className="flex gap-2">
          {source && (
            <Badge variant={source === 'api' ? 'default' : 'secondary'} className="text-xs">
              {source === 'api' ? 'NHTSA API' : 'Cached Data'}
            </Badge>
          )}
          
          {formattedDate && (
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formattedDate}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        {loading && (
          <LoadingState 
            text="Retrieving vehicle data from NHTSA vPIC database..." 
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
            <VehicleDetailsDisplay data={data} />
            <Separator className="my-6" />
            <VpicVinLookup vin={vin} />
          </div>
        )}
      </CardContent>
      
      {data && !loading && !error && (
        <CardFooter className="border-t border-primary/10 bg-gray-50 flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              toast.success("Detailed report functionality coming soon!");
            }}
          >
            Generate Detailed Report
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

// Vehicle details display component
function VehicleDetailsDisplay({ data }: { data: VpicVehicleData }) {
  const detailSections = [
    {
      title: "Basic Information",
      items: [
        { label: "Year", value: data.modelYear || data.year },
        { label: "Make", value: data.make },
        { label: "Model", value: data.model },
        { label: "Series", value: data.series },
        { label: "Trim", value: data.trim }
      ]
    },
    {
      title: "Technical Specifications",
      items: [
        { label: "Body Type", value: data.bodyClass },
        { label: "Drive Type", value: data.driveType },
        { label: "Fuel Type", value: data.fuelType },
        { label: "Engine Size", value: data.engineSize ? `${data.engineSize}L` : null },
        { label: "Engine Cylinders", value: data.engineCylinders },
        { label: "Transmission", value: data.transmissionStyle }
      ]
    },
    {
      title: "Manufacturing Information",
      items: [
        { label: "Manufacturer", value: data.manufacturer },
        { label: "Plant Country", value: data.plantCountry },
        { label: "Plant State", value: data.plantState },
        { label: "Plant City", value: data.plantCity }
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {detailSections.map((section) => (
        <div key={section.title} className="space-y-3">
          <h3 className="font-medium text-sm text-muted-foreground">{section.title}</h3>
          <div className="space-y-2">
            {section.items.map((item) => (
              item.value && item.value !== "Unknown" && (
                <div key={item.label} className="grid grid-cols-2">
                  <span className="text-sm font-medium">{item.label}:</span>
                  <span className="text-sm">{item.value}</span>
                </div>
              )
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
