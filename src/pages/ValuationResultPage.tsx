
import React from 'react';
import { useValuationContext } from '@/hooks/useValuationContext';

const ValuationResultPage: React.FC = () => {
  const { vehicle, valuationId } = useValuationContext();
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Valuation Result</h1>
      
      {!vehicle ? (
        <div className="p-4 bg-yellow-100 rounded-md">
          No vehicle data available. Please complete a valuation first.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h2>
            {vehicle.vin && (
              <p className="text-sm text-gray-500 mt-1">VIN: {vehicle.vin}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ValuationResultPage;
