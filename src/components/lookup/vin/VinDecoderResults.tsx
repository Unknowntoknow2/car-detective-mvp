import React from 'react';
import { DecodedVehicleInfo } from '@/types/vehicle';

interface VinDecoderResultsProps {
  result: DecodedVehicleInfo;
  stage: string;
  pipelineVehicle: any;
  requiredInputs: any;
  valuationResult: any;
  valuationError: any;
  pipelineLoading: boolean;
  submitValuation: (data: any) => Promise<void>;
  vin: string;
  carfaxData: any;
  onDownloadPdf: () => void;
}

const FoundCarCard: React.FC<{
  year: number;
  make: string;
  model: string;
  trim?: string;
  engine?: string;
  vin?: string;
}> = ({ year, make, model, trim, engine, vin }) => {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h3 className="font-semibold text-lg">
        {year} {make} {model} {trim}
      </h3>
      {engine && <p className="text-sm text-gray-600">Engine: {engine}</p>}
      {vin && <p className="text-xs text-gray-500 mt-1">VIN: {vin}</p>}
    </div>
  );
};

const VinDecoderResults: React.FC<VinDecoderResultsProps> = ({
  result,
  stage,
  pipelineVehicle,
  requiredInputs,
  valuationResult,
  valuationError,
  pipelineLoading,
  submitValuation,
  vin,
  carfaxData,
  onDownloadPdf
}) => {
  if (!result) {
    return <div>No results found</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Vehicle Found</h2>
      
      <FoundCarCard
        year={result.year}
        make={result.make}
        model={result.model}
        trim={result.trim}
        engine={result.engine}
        vin={vin}
      />
      
      {/* Other components and logic would go here */}
      
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">Vehicle Details</h3>
        <ul className="space-y-1 text-sm">
          <li><span className="font-medium">Make:</span> {result.make}</li>
          <li><span className="font-medium">Model:</span> {result.model}</li>
          <li><span className="font-medium">Year:</span> {result.year}</li>
          {result.trim && <li><span className="font-medium">Trim:</span> {result.trim}</li>}
          {result.transmission && <li><span className="font-medium">Transmission:</span> {result.transmission}</li>}
          {result.drivetrain && <li><span className="font-medium">Drivetrain:</span> {result.drivetrain}</li>}
          {result.bodyType && <li><span className="font-medium">Body Type:</span> {result.bodyType}</li>}
          {result.engine && <li><span className="font-medium">Engine:</span> {result.engine}</li>}
        </ul>
      </div>
    </div>
  );
};

export default VinDecoderResults;
