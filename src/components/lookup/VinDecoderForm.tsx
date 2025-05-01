
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { downloadPdf } from '@/utils/pdf';
import { useVinDecoderForm } from './vin/useVinDecoderForm';
import { VinLookupForm } from './vin/VinLookupForm';
import { CarfaxErrorAlert } from './vin/CarfaxErrorAlert';
import { VinDecoderResults } from './vin/VinDecoderResults';

export const VinDecoderForm = () => {
  const {
    vin,
    setVin,
    result,
    isLoading,
    carfaxData,
    isLoadingCarfax,
    carfaxError,
    stage,
    pipelineVehicle,
    requiredInputs,
    valuationResult,
    valuationError,
    pipelineLoading,
    handleSubmit,
    submitValuation,
    handleDownloadPdf
  } = useVinDecoderForm();

  const onDownloadPdf = () => {
    const reportData = handleDownloadPdf();
    if (reportData) {
      downloadPdf(reportData);
    }
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
            <CarfaxErrorAlert error={carfaxError} />
          )}
        </CardContent>
      </Card>

      <VinDecoderResults 
        stage={stage}
        result={result}
        pipelineVehicle={pipelineVehicle}
        requiredInputs={requiredInputs}
        valuationResult={valuationResult}
        valuationError={valuationError}
        pipelineLoading={pipelineLoading}
        submitValuation={submitValuation}
        vin={vin}
        carfaxData={carfaxData}
        onDownloadPdf={onDownloadPdf}
      />
    </div>
  );
};
