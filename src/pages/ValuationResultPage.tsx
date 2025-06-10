
import React from "react";
import { useParams } from "react-router-dom";

const ValuationResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Valuation Results</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Vehicle Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Make:</span> Toyota</p>
              <p><span className="font-medium">Model:</span> Camry</p>
              <p><span className="font-medium">Year:</span> 2020</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Valuation Summary</h2>
            <p className="text-2xl font-bold text-green-600">$18,500</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <button 
            role="button" 
            aria-label="Download PDF" 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Download PDF
          </button>
          
          <button 
            role="button" 
            aria-label="Share results" 
            disabled 
            className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded cursor-not-allowed"
          >
            Share Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValuationResultPage;
