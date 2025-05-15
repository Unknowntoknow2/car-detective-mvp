
import React from 'react';
import { useParams } from 'react-router-dom';

const VehicleDetailsPage: React.FC = () => {
  const { id } = useParams();
  
  return (
    <div className="container max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Vehicle Details</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="text-lg mb-2">Vehicle ID: {id}</p>
        <p className="text-gray-500 mb-4">Detailed information about this vehicle will appear here.</p>
      </div>
    </div>
  );
};

export default VehicleDetailsPage;
