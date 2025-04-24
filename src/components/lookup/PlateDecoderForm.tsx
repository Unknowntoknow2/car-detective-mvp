
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

export const PlateDecoderForm = () => {
  const [plate, setPlate] = useState('');
  const [state, setState] = useState('');
  const { vehicleInfo, isLoading, lookupVehicle, error } = usePlateLookup();
  const { saveValuation, isSaving } = useSaveValuation();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate || !state) return;

    try {
      await lookupVehicle(plate, state);
    } catch (err) {
      toast.error("Failed to lookup vehicle. Please try again.");
    }
  };

  const handleSaveValuation = async () => {
    if (!vehicleInfo) return;

    try {
      await saveValuation({
        plate: vehicleInfo.plate,
        state: vehicleInfo.state,
        make: vehicleInfo.make,
        model: vehicleInfo.model,
        year: vehicleInfo.year,
        valuation: 24500,
        confidenceScore: 92,
        conditionScore: 85
      });
      toast.success("Valuation saved successfully!");
    } catch (err) {
      toast.error("Failed to save valuation. Please try again.");
    }
  };

  const handleDownloadPdf = () => {
    if (!vehicleInfo) return;
    
    try {
      const reportData = convertVehicleInfoToReportData(vehicleInfo, {
        mileage: 76000,
        estimatedValue: 24500,
        condition: "Good",
        zipCode: "10001",
        confidenceScore: 92,
        adjustments: [
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
            isLoading={isLoading}
            onPlateChange={setPlate}
            onStateChange={setState}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>

      {isLoading && <LoadingState />}

      {vehicleInfo && !isLoading && (
        <PlateInfoCard 
          vehicleInfo={vehicleInfo} 
          onDownloadPdf={handleDownloadPdf}
          onSaveValuation={handleSaveValuation}
          isSaving={isSaving}
          isUserLoggedIn={!!user}
        />
      )}

      {error && !isLoading && (
        <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};
