
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUnifiedDecoder } from '@/hooks/useUnifiedDecoder';
import { VINLookupForm } from '@/components/lookup/vin/VINLookupForm';
import { PlateLookup } from '@/components/lookup/PlateLookup';
import { ManualLookup } from '@/components/lookup/ManualLookup';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, AlertTriangle } from 'lucide-react';

interface VehicleLookupFormProps {
  onVehicleDecoded: (data: DecodedVehicleInfo) => void;
  onContinue: () => void;
}

export const VehicleLookupForm: React.FC<VehicleLookupFormProps> = ({
  onVehicleDecoded,
  onContinue
}) => {
  const [activeTab, setActiveTab] = useState<string>('vin');
  const { decode, isLoading, error, vehicleInfo, reset } = useUnifiedDecoder();
  
  const handleVinLookup = async (vin: string) => {
    const result = await decode('vin', { vin });
    if (result) {
      onVehicleDecoded(result);
    }
  };
  
  const handlePlateLookup = async (plate: string, state: string) => {
    const result = await decode('plate', { licensePlate: plate, state });
    if (result) {
      onVehicleDecoded(result);
    }
  };
  
  const handleManualEntry = async (data: any) => {
    // Convert the form data into the manual entry format
    const manualData = {
      make: data.make,
      model: data.model,
      year: parseInt(data.year),
      mileage: parseInt(data.mileage || '0'),
      condition: data.condition,
      zipCode: data.zipCode,
      vin: data.vin,
      fuelType: data.fuelType,
      transmission: data.transmission,
      trim: data.trim,
      bodyType: data.bodyType
    };
    
    const result = await decode('manual', { manual: manualData });
    if (result) {
      onVehicleDecoded(result);
    }
  };
  
  const handleStartOver = () => {
    reset();
    setActiveTab('vin');
  };

  return (
    <div className="space-y-6">
      {!vehicleInfo ? (
        <Card>
          <CardHeader>
            <CardTitle>Identify Your Vehicle</CardTitle>
            <CardDescription>
              Choose one of the following methods to identify your vehicle.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="vin">VIN</TabsTrigger>
                <TabsTrigger value="plate">License Plate</TabsTrigger>
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              </TabsList>
              
              <TabsContent value="vin" className="space-y-4 mt-4">
                <VINLookupForm 
                  onSubmit={handleVinLookup}
                  isLoading={isLoading && activeTab === 'vin'}
                />
              </TabsContent>
              
              <TabsContent value="plate" className="space-y-4 mt-4">
                <PlateLookup 
                  onSubmit={handlePlateLookup}
                  isLoading={isLoading && activeTab === 'plate'}
                />
              </TabsContent>
              
              <TabsContent value="manual" className="space-y-4 mt-4">
                <ManualLookup 
                  onSubmit={handleManualEntry}
                  isLoading={isLoading && activeTab === 'manual'}
                  submitButtonText="Continue"
                />
              </TabsContent>
            </Tabs>
            
            {error && (
              <div className="mt-4 p-4 bg-destructive/10 rounded-lg border border-destructive/20 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-destructive">Error</p>
                  <p className="text-sm mt-1">{error}</p>
                  {error.includes('not found') && (
                    <p className="text-sm mt-2">
                      Please try a different lookup method or enter your vehicle details manually.
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Found</CardTitle>
            <CardDescription>
              We found the following vehicle. If this is correct, click continue to proceed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/40 rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-2 text-success">
                <Check className="h-5 w-5" />
                <h3 className="text-xl font-semibold">
                  {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 mt-2">
                {vehicleInfo.trim && (
                  <div>
                    <p className="text-xs text-muted-foreground">Trim</p>
                    <p>{vehicleInfo.trim}</p>
                  </div>
                )}
                
                {vehicleInfo.transmission && (
                  <div>
                    <p className="text-xs text-muted-foreground">Transmission</p>
                    <p>{vehicleInfo.transmission}</p>
                  </div>
                )}
                
                {vehicleInfo.fuelType && (
                  <div>
                    <p className="text-xs text-muted-foreground">Fuel Type</p>
                    <p>{vehicleInfo.fuelType}</p>
                  </div>
                )}
                
                {vehicleInfo.bodyType && (
                  <div>
                    <p className="text-xs text-muted-foreground">Body Type</p>
                    <p>{vehicleInfo.bodyType}</p>
                  </div>
                )}
                
                {vehicleInfo.drivetrain && (
                  <div>
                    <p className="text-xs text-muted-foreground">Drivetrain</p>
                    <p>{vehicleInfo.drivetrain}</p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button onClick={onContinue} className="flex-1">
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={handleStartOver}>
                  Start Over
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
