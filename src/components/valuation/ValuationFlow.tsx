<<<<<<< HEAD

import React, { useState } from 'react';
import { useValuation } from '@/hooks/useValuation';
import { VehicleLookupForm } from './VehicleLookupForm';
import { ValuationResults } from './ValuationResults';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// Create a stub for the missing ValuationDetailsForm component
const ValuationDetailsForm: React.FC<{
  vehicleInfo: DecodedVehicleInfo;
  onSubmit: (details: any) => Promise<void>;
  isLoading: boolean;
}> = ({ vehicleInfo, onSubmit, isLoading }) => (
  <div className="p-6 border rounded-lg">
    <h2 className="text-xl font-semibold mb-4">Vehicle Details</h2>
    <p className="mb-4">Please confirm or update the following details:</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <p className="text-sm text-gray-500">Make</p>
        <p className="font-medium">{vehicleInfo.make}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Model</p>
        <p className="font-medium">{vehicleInfo.model}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Year</p>
        <p className="font-medium">{vehicleInfo.year}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Trim</p>
        <p className="font-medium">{vehicleInfo.trim || 'Standard'}</p>
      </div>
    </div>
    <Button 
      onClick={() => onSubmit({ mileage: 10000, condition: 'Good' })}
      disabled={isLoading}
    >
      {isLoading ? 'Processing...' : 'Submit Details'}
    </Button>
  </div>
);

enum ValuationStep {
  LOOKUP,
  DETAILS,
  RESULTS
}

const ValuationFlow: React.FC = () => {
  const { 
    isLoading, 
    valuationData, 
    error, 
    decodeVin, 
    decodePlate, 
    manualValuation, 
    resetValuation 
  } = useValuation();
  
  const [currentStep, setCurrentStep] = useState<ValuationStep>(ValuationStep.LOOKUP);
  const [vehicleInfo, setVehicleInfo] = useState<DecodedVehicleInfo | null>(null);
  
  const handleVehicleFound = (data: DecodedVehicleInfo) => {
    setVehicleInfo(data);
    setCurrentStep(ValuationStep.DETAILS);
  };
  
  const handleSubmitDetails = async (details: any) => {
    if (vehicleInfo) {
      const combinedData = {
        ...vehicleInfo,
        ...details
      };
      await manualValuation(combinedData);
      setCurrentStep(ValuationStep.RESULTS);
    }
  };
  
  const handleReset = () => {
    resetValuation();
    setVehicleInfo(null);
    setCurrentStep(ValuationStep.LOOKUP);
  };
  
  const handleBack = () => {
    if (currentStep === ValuationStep.DETAILS) {
      setCurrentStep(ValuationStep.LOOKUP);
    } else if (currentStep === ValuationStep.RESULTS) {
      setCurrentStep(ValuationStep.DETAILS);
    }
  };
  
  return (
    <div className="space-y-6">
      {currentStep !== ValuationStep.LOOKUP && (
        <Button 
          variant="ghost" 
          className="flex items-center text-muted-foreground"
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      )}
      
      {currentStep === ValuationStep.LOOKUP && (
        <VehicleLookupForm 
          onVehicleFound={handleVehicleFound}
        />
      )}
      
      {currentStep === ValuationStep.DETAILS && vehicleInfo && (
        <ValuationDetailsForm 
          vehicleInfo={vehicleInfo}
          onSubmit={handleSubmitDetails}
          isLoading={isLoading}
        />
      )}
      
      {currentStep === ValuationStep.RESULTS && valuationData && (
        <ValuationResults 
          estimatedValue={valuationData.estimatedValue}
          confidenceScore={valuationData.confidenceScore || 0}
          vehicleInfo={{
            make: valuationData.make,
            model: valuationData.model,
            year: valuationData.year,
            mileage: valuationData.mileage || 0,
            condition: valuationData.condition
          }}
        />
      )}
      
      {error && currentStep === ValuationStep.RESULTS && (
        <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
          <h3 className="font-medium text-destructive">Error</h3>
          <p className="text-sm mt-1">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={handleReset}
          >
            Start Over
          </Button>
        </div>
      )}
    </div>
=======
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Check } from "lucide-react";
import { VinDecoderForm } from "@/components/lookup/VinDecoderForm";
import PlateDecoderForm from "@/components/lookup/PlateDecoderForm";
import ManualEntryForm from "@/components/lookup/manual/ManualEntryForm";
import ValuationSummary from "./result/ValuationSummary";
import { useValuation } from "@/hooks/useValuation";
import { toast } from "sonner";
import { ManualEntryFormData } from "@/components/lookup/types/manualEntry";

export function ValuationFlow() {
  const [activeTab, setActiveTab] = useState<string>("vin");
  const [valuationResult, setValuationResult] = useState<any>(null);
  const [vehicleInfo, setVehicleInfo] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const { submitValuation, isLoading } = useValuation();
  const [error, setError] = useState<string | null>(null);

  // Modified generateValuation function that uses submitValuation
  const generateValuation = async (data: any) => {
    try {
      const result = await submitValuation(data);
      if (result.success) {
        return {
          success: true,
          confidenceScore: 85, // Default confidence score
          ...result.data,
        };
      } else {
        setError(result.errorMessage || "Failed to generate valuation");
        return { success: false };
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return { success: false };
    }
  };

  // Handle VIN lookup
  const handleVinLookup = async (vin: string) => {
    console.log("VALUATION FLOW: VIN lookup", vin);

    try {
      // Simulate API delay
      setVehicleInfo(null);
      setValuationResult(null);
      setShowResult(false);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 25% chance of failure for testing fallback
      if (Math.random() < 0.25) {
        toast.error("VIN lookup failed");
        return;
      }

      // Mock vehicle info
      const mockVehicleInfo = {
        make: "Toyota",
        model: "Camry",
        year: 2019,
        trim: "XLE",
        vin,
      };

      setVehicleInfo(mockVehicleInfo);
      toast.success("Vehicle found!");

      // Generate valuation
      const result = await generateValuation({
        identifierType: "vin",
        vin,
        make: mockVehicleInfo.make,
        model: mockVehicleInfo.model,
        year: mockVehicleInfo.year,
        zipCode: "90210",
      });

      if (result.success) {
        setValuationResult({
          estimatedValue: 25000,
          confidenceScore: result.confidenceScore || 85,
          ...result,
        });
        setShowResult(true);
      }
    } catch (err) {
      console.error("VALUATION FLOW: Error in VIN lookup", err);
      toast.error("Failed to process VIN");
    }
  };

  // Handle plate lookup
  const handlePlateLookup = async (plate: string, state: string) => {
    console.log("VALUATION FLOW: Plate lookup", plate, state);

    try {
      // Simulate API delay
      setVehicleInfo(null);
      setValuationResult(null);
      setShowResult(false);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 25% chance of failure for testing fallback
      if (Math.random() < 0.25) {
        toast.error("Plate lookup failed");
        return;
      }

      // Mock vehicle info
      const mockVehicleInfo = {
        make: "Honda",
        model: "Accord",
        year: 2020,
        trim: "Sport",
        plate,
        state,
      };

      setVehicleInfo(mockVehicleInfo);
      toast.success("Vehicle found!");

      // Generate valuation
      const result = await generateValuation({
        identifierType: "plate",
        plate,
        state,
        make: mockVehicleInfo.make,
        model: mockVehicleInfo.model,
        year: mockVehicleInfo.year,
        zipCode: "94103",
      });

      if (result.success) {
        setValuationResult({
          estimatedValue: 28000,
          confidenceScore: result.confidenceScore || 80,
          ...result,
        });
        setShowResult(true);
      }
    } catch (err) {
      console.error("VALUATION FLOW: Error in plate lookup", err);
      toast.error("Failed to process plate");
    }
  };

  // Handle manual entry
  const handleManualEntry = async (data: ManualEntryFormData) => {
    console.log("VALUATION FLOW: Manual entry", data);

    try {
      // Simulate API delay
      setVehicleInfo(null);
      setValuationResult(null);
      setShowResult(false);

      // Set vehicle info
      setVehicleInfo({
        make: data.make,
        model: data.model,
        year: data.year,
        trim: data.trim,
        mileage: data.mileage,
        condition: data.condition,
      });

      // Generate valuation
      const result = await generateValuation({
        identifierType: "manual",
        make: data.make,
        model: data.model,
        year: data.year,
        mileage: data.mileage,
        condition: data.condition,
        zipCode: data.zipCode,
      });

      if (result.success) {
        setValuationResult({
          estimatedValue: 22000,
          confidenceScore: result.confidenceScore || 70,
          ...result,
        });
        setShowResult(true);
      }
    } catch (err) {
      console.error("VALUATION FLOW: Error in manual entry", err);
      toast.error("Failed to process manual entry");
    }
  };

  // Show result if available
  if (showResult && vehicleInfo && valuationResult) {
    return (
      <div className="space-y-6">
        <Alert variant="default" className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle>Valuation Complete</AlertTitle>
          <AlertDescription>
            We've generated a valuation for your {vehicleInfo.year}{" "}
            {vehicleInfo.make} {vehicleInfo.model}
          </AlertDescription>
        </Alert>

        <ValuationSummary
          confidenceScore={valuationResult.confidenceScore}
          estimatedValue={valuationResult.estimatedValue}
          vehicleInfo={vehicleInfo}
        />

        <div className="flex justify-center">
          <button
            className="text-sm text-blue-600 hover:text-blue-800 underline"
            onClick={() => {
              setShowResult(false);
              setVehicleInfo(null);
              setValuationResult(null);
            }}
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Valuation</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="vin" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vin">VIN</TabsTrigger>
            <TabsTrigger value="plate">License Plate</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>

          <TabsContent value="vin" className="mt-4">
            <VinDecoderForm onSubmit={handleVinLookup} />
          </TabsContent>

          <TabsContent value="plate" className="mt-4">
            <PlateDecoderForm onSubmit={handlePlateLookup} />
          </TabsContent>

          <TabsContent value="manual" className="mt-4">
            <ManualEntryForm
              onSubmit={handleManualEntry}
              isLoading={isLoading}
              submitButtonText="Get Valuation"
            />
          </TabsContent>
        </Tabs>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  );
};

export default ValuationFlow;
