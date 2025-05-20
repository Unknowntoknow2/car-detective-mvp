
import React from 'react';
import { useParams } from 'react-router-dom';
import { useValuationContext } from '@/hooks/useValuationContext';

const ValuationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { vehicle } = useValuationContext();
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Valuation Details</h1>
      
      {!vehicle ? (
        <div className="p-4 bg-yellow-100 rounded-md">
          No vehicle data available for ID: {id}
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

export default ValuationDetailPage;
