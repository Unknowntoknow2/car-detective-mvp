import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePlateLookup } from '@/hooks/usePlateLookup';
import { convertVehicleInfoToReportData, downloadPdf } from '@/utils/pdf';
import { useSaveValuation } from '@/hooks/useSaveValuation';
import { useAuth } from '@/contexts/AuthContext';
import { PlateLookupForm } from './plate/PlateLookupForm';
import { PlateInfoCard } from './plate/PlateInfoCard';
import { LoadingState } from './plate/LoadingState';
import { toast } from 'sonner';
import { useFullValuationPipeline } from '@/hooks/useFullValuationPipeline';
import { VehicleDetailsForm } from '@/components/premium/form/steps/vehicle-details/VehicleDetailsForm';
import { ValuationResults } from '@/components/valuation/ValuationResults';
import { convertAdjustmentsToLegacyFormat } from '@/utils/formatters/adjustment-formatter';

export const PlateDecoderForm = () => {
  const [plate, setPlate] = useState('');
  const [state, setState] = useState('');
  const { result, isLoading, lookupVehicle, error } = usePlateLookup();
  const { saveValuation, isSaving } = useSaveValuation();
  const { user } = useAuth();
  
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
    if (!plate || !state) return;

    try {
      // Original plate lookup for backward compatibility
      await lookupVehicle(plate, state);
      
      // Also run our new valuation pipeline
      await runLookup('plate', plate, state);
    } catch (err) {
      toast.error("Failed to lookup vehicle. Please try again.");
    }
  };

  const handleDetailsSubmit = async (details: any) => {
    await submitValuation(details);
  };

  const handleSaveValuation = async () => {
    if (!result) return;

    try {
      await saveValuation({
        plate: result.plate,
        state: result.state,
        make: result.make || "Unknown",
        model: result.model || "Unknown",
        year: result.year || 0,
        valuation: valuationResult?.estimated_value || 24500,
        confidenceScore: valuationResult?.confidence_score || 92,
        conditionScore: requiredInputs?.condition || 85
      });
      toast.success("Valuation saved successfully!");
    } catch (err) {
      toast.error("Failed to save valuation. Please try again.");
    }
  };

  const handleDownloadPdf = () => {
    if (!result) return;
    
    try {
      // Use valuation data if available, otherwise use default values
      const reportData = convertVehicleInfoToReportData(result, {
        mileage: requiredInputs?.mileage || 76000,
        estimatedValue: valuationResult?.estimated_value || 24500,
        condition: requiredInputs?.conditionLabel || "Good",
        zipCode: requiredInputs?.zipCode || "10001",
        confidenceScore: valuationResult?.confidence_score || 92,
        adjustments: valuationResult?.adjustments 
          ? convertAdjustmentsToLegacyFormat(valuationResult.adjustments)
          : [
              { label: "Location", value: 1.5 },
              { label: "Vehicle Condition", value: 2.0 },
              { label: "Market Demand", value: 4.0 }
            ]
      });
      
      downloadPdf(reportData);
      toast.success("PDF report generated successfully!");
    } catch (err) {
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  // Determine what to render based on the pipeline stage and traditional lookup state
  const renderContent = () => {
    // If we're in the details collection or valuation stage, show the pipeline UI
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
                onEmailReport={handleSaveValuation}
              />
            </CardContent>
          </Card>
        </div>
      );
    }
    
    // Otherwise, show the traditional lookup results
    if (result && !isLoading) {
      return (
        <PlateInfoCard 
          vehicleInfo={{
            plate: result.plate,
            state: result.state,
            make: result.make || "Unknown",
            model: result.model || "Unknown",
            year: result.year || 0,
            color: result.color || null
          }} 
          onDownloadPdf={handleDownloadPdf}
          onSaveValuation={handleSaveValuation}
          isSaving={isSaving}
          isUserLoggedIn={!!user}
        />
      );
    }
    
    return null;
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">License Plate Lookup</CardTitle>
          <CardDescription>
            Enter a license plate and state to get detailed vehicle information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PlateLookupForm
            plate={plate}
            state={state}
            isLoading={isLoading || pipelineLoading}
            onPlateChange={setPlate}
            onStateChange={setState}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>

      {(isLoading || pipelineLoading) && <LoadingState />}

      {renderContent()}

      {error && !isLoading && stage !== 'valuation_complete' && stage !== 'details_required' && (
        <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};
