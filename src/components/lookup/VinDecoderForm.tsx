
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useVinDecoderForm } from '@/components/lookup/vin/useVinDecoderForm';

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
    handleSubmit,
  } = useVinDecoderForm();

  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVin(e.target.value);
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZipCode(e.target.value);
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

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {result && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="font-semibold text-green-800 mb-2">VIN Lookup Result</h3>
          <pre className="text-sm text-green-700">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      {carfaxData && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="font-semibold text-blue-800 mb-2">Vehicle History Report</h3>
          <pre className="text-sm text-blue-700">{JSON.stringify(carfaxData, null, 2)}</pre>
        </div>
      )}

      {carfaxError && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-600">{carfaxError}</p>
        </div>
      )}
    </div>
  );
};

export default VinDecoderForm;
