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
import { NhtsaRecalls } from '@/components/valuation/NhtsaRecalls';
import { ZipValidation } from '@/components/common/ZipValidation';

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
    zipCode,
    setZipCode,
    handleSubmit,
    submitValuation,
    handleDownloadPdf
  } = useVinDecoderForm();

  // Fix the return type of handleDetailsSubmit to match expected Promise<void>
  const handleDetailsSubmit = async (details: any): Promise<void> => {
    await submitValuation(details);
    // Result handling is done via state updates, no return needed
  };

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

          {/* Add ZIP Code input and validation when VIN lookup is successful */}
          {result && (
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="zipCode" className="text-sm font-medium">
                  ZIP Code (for regional pricing)
                </label>
                <input 
                  id="zipCode"
                  type="text"
                  value={zipCode || ''}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="Enter ZIP code (e.g. 90210)"
                  className="w-full p-2 border rounded-md"
                  maxLength={5}
                  pattern="\d*"
                />
              </div>
              
              {/* ZIP validation component */}
              {zipCode && zipCode.length === 5 && (
                <ZipValidation 
                  zip={zipCode} 
                  compact={true} 
                />
              )}
            </div>
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
        submitValuation={handleDetailsSubmit}
        vin={vin}
        carfaxData={carfaxData}
        onDownloadPdf={onDownloadPdf}
      />

      {/* Show recalls if we have vehicle data - Fix: Ensure year is always a number */}
      {result?.make && result?.model && result?.year && (
        <div className="mt-4">
          <NhtsaRecalls 
            make={result.make} 
            model={result.model} 
            year={typeof result.year === 'string' ? parseInt(result.year, 10) : result.year} 
          />
        </div>
      )}
    </div>
  );
};
