
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useVinDecoderForm } from '@/components/lookup/vin/useVinDecoderForm';
import VinDecoderResults from '@/components/lookup/vin/VinDecoderResults';
import { ValuationFactorsGrid } from '@/components/valuation/condition/factors/ValuationFactorsGrid';

const VinDecoderForm: React.FC = () => {
  const {
    vin,
    setVin,
    zipCode,
    setZipCode,
    result,
    isLoading,
    error,
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
    handleDetailsSubmit,
    submitValuation,
    valuationId,
  } = useVinDecoderForm();

  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVin(e.target.value);
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZipCode(e.target.value);
  };

  const handleDownloadPdf = () => {
    console.log('Downloading PDF...');
    // Implement PDF download logic
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="vin-input" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Vehicle Identification Number (VIN)
          </label>
          <Input
            id="vin-input"
            value={vin}
            onChange={handleVinChange}
            placeholder="Enter 17-character VIN"
            maxLength={17}
            className="w-full"
          />
        </div>
        
        <div>
          <label 
            htmlFor="zip-input" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            ZIP Code (Optional)
          </label>
          <Input
            id="zip-input"
            value={zipCode}
            onChange={handleZipCodeChange}
            placeholder="Enter ZIP code for regional pricing"
            maxLength={5}
            className="w-full"
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={isLoading || !vin || vin.length !== 17}
          className="w-full"
        >
          {isLoading ? 'Loading...' : 'Lookup VIN'}
        </Button>
      </form>

      {(result || pipelineVehicle || valuationResult) && (
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
          onDownloadPdf={handleDownloadPdf}
        />
      )}
    </div>
  );
};

export default VinDecoderForm;
