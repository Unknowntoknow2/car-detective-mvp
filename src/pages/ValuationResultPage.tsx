
import React from 'react';
import { useParams } from 'react-router-dom';

const ValuationResultPage = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Valuation Results</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Vehicle Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Make: Toyota</p>
              <p className="text-gray-600">Model: Camry</p>
              <p className="text-gray-600">Year: 2020</p>
            </div>
            <div>
              <p className="text-gray-600">Mileage: 45,000</p>
              <p className="text-gray-600">Condition: Good</p>
              <p className="text-gray-600">VIN: {id || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Valuation Summary</h2>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600 mb-2">$18,500</p>
            <p className="text-gray-600">Estimated Market Value</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Market Analysis</h2>
          <p className="text-gray-600">
            Based on current market conditions and comparable vehicles in your area, 
            this valuation represents a fair market estimate.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ValuationResultPage;
