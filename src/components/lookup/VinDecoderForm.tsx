import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useVinDecoder } from '@/hooks/useVinDecoder';
import { downloadPdf, convertVehicleInfoToReportData } from '@/utils/pdf';
import { useAuth } from '@/contexts/AuthContext';
import { VehicleInfoCard } from './VehicleInfoCard';
import { VinLookupForm } from './vin/VinLookupForm';
import { getCarfaxReport } from '@/utils/carfax/mockCarfaxService';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';
import { useFullValuationPipeline } from '@/hooks/useFullValuationPipeline';
import { VehicleDetailsForm } from '@/components/premium/form/steps/vehicle-details/VehicleDetailsForm';
import { ValuationResults } from '@/components/valuation/ValuationResults';

export const VinDecoderForm = () => {
  const [vin, setVin] = useState('');
  const { result, isLoading, error, lookupVin } = useVinDecoder();
  const { user } = useAuth();
  const [carfaxData, setCarfaxData] = useState(null);
  const [isLoadingCarfax, setIsLoadingCarfax] = useState(false);
  const [carfaxError, setCarfaxError] = useState(null);
  
  // Add the valuation pipeline for enhanced functionality
  const {
    stage,
    vehicle: pipelineVehicle,
    requiredInputs,
    valuationResult,
    isLoading: pipelineLoading,
    runLookup,
    submitValuation
  } = useFullValuationPipeline();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (vin) {
      setCarfaxData(null);
      setCarfaxError(null);
      
      // Original VIN lookup for backward compatibility
      await lookupVin(vin);
      
      // Also run our new valuation pipeline
      await runLookup('vin', vin);
      
      // Fetch CARFAX data after VIN lookup succeeds
      try {
        setIsLoadingCarfax(true);
        const carfaxReport = await getCarfaxReport(vin);
        setCarfaxData(carfaxReport);
        setIsLoadingCarfax(false);
      } catch (err) {
        console.error('Error fetching CARFAX data:', err);
        setCarfaxError('Unable to retrieve vehicle history report.');
        setIsLoadingCarfax(false);
        toast.error('Could not retrieve vehicle history report.');
      }
    }
  };

  const handleDetailsSubmit = async (details: any) => {
    await submitValuation({
      ...details,
      // Add Carfax data if available
      carfaxData: carfaxData || undefined
    });
  };

  const handleDownloadPdf = () => {
    if (!result) return;
    
    const reportData = convertVehicleInfoToReportData(result, {
      mileage: requiredInputs?.mileage || 76000,
      estimatedValue: valuationResult?.estimated_value || 24500,
      condition: requiredInputs?.conditionLabel || "Good",
      zipCode: requiredInputs?.zipCode || "10001",
      confidenceScore: valuationResult?.confidence_score || (carfaxData ? 92 : 85),
      adjustments: valuationResult?.adjustments || [
        { label: "Mileage", value: -3.5 },
        { label: "Condition", value: 2.0 },
        { label: "Market Demand", value: 4.0 },
        ...(carfaxData && carfaxData.accidentsReported > 0 ? [{ label: "Accident History", value: -3.0 }] : [])
      ],
      carfaxData: carfaxData // Pass CARFAX data to PDF generator
    });
    
    downloadPdf(reportData);
    toast.success("PDF report generated successfully!");
  };

  // Determine what to render based on the pipeline stage and traditional lookup state
  const renderContent = () => {
    // If we're in the details collection stage, show the pipeline UI
    if (stage === 'details_required' && requiredInputs) {
      return (
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Additional Vehicle Details</CardTitle>
              <CardDescription>
                Please provide a few more details to get an accurate valuation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VehicleDetailsForm 
                initialData={requiredInputs}
                onSubmit={handleDetailsSubmit}
                isLoading={pipelineLoading}
              />
            </CardContent>
          </Card>
        </div>
      );
    }
    
    // If valuation is complete, show the valuation results
    if (stage === 'valuation_complete' && valuationResult && pipelineVehicle) {
      return (
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Valuation</CardTitle>
              <CardDescription>
                Based on your vehicle details, here is the estimated value
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ValuationResults
                estimatedValue={valuationResult.estimated_value || 0}
                confidenceScore={valuationResult.confidence_score || 0}
                basePrice={valuationResult.base_price}
                adjustments={valuationResult.adjustments}
                priceRange={valuationResult.price_range}
                demandFactor={valuationResult.zip_demand_factor}
                vehicleInfo={{
                  year: pipelineVehicle.year || 0,
                  make: pipelineVehicle.make || '',
                  model: pipelineVehicle.model || '',
                  mileage: requiredInputs?.mileage,
                  condition: requiredInputs?.conditionLabel
                }}
                onDownloadPdf={handleDownloadPdf}
              />
            </CardContent>
          </Card>
        </div>
      );
    }
    
    // Otherwise, show the traditional lookup results
    if (result) {
      return (
        <VehicleInfoCard 
          vehicleInfo={{
            vin: result.vin,
            make: result.make || '',
            model: result.model || '',
            year: result.year || 0,
            trim: result.trim,
            engine: result.engine,
            transmission: 'Automatic', // Adding the missing required field
            drivetrain: 'FWD', // Providing a default value
            bodyType: 'Unknown' // Providing a default value
          }} 
          onDownloadPdf={handleDownloadPdf}
          carfaxData={carfaxData}
        />
      );
    }
    
    return null;
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">VIN Lookup</CardTitle>
          <CardDescription>
            Enter a Vehicle Identification Number (VIN) to get detailed information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VinLookupForm
            vin={vin}
            isLoading={isLoading || pipelineLoading || isLoadingCarfax}
            onVinChange={setVin}
            onSubmit={handleSubmit}
          />
          
          {carfaxError && !isLoadingCarfax && (
            <div className="mt-4 p-4 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-md text-amber-700">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{carfaxError} This doesn't affect the vehicle details lookup.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {renderContent()}
    </div>
  );
};
