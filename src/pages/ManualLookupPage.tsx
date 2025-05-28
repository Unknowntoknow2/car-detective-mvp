
import React from 'react';
import { ManualFollowUpWrapper } from '@/components/followup/ManualFollowUpWrapper';

const ManualLookupPage = () => {
  const handleComplete = () => {
    // Handle completion - could redirect to results or dashboard
    console.log("Manual follow-up completed");
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manual Vehicle Lookup</h1>
      <p className="text-gray-600 mb-6">
        Enter your vehicle details manually to get an accurate valuation.
      </p>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <ManualFollowUpWrapper
          initialData={{
            make: '',
            model: '',
            year: 0,
            mileage: 0,
            condition: 'good' as any,
            zipCode: '',
            fuelType: '',
            transmission: ''
          }}
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
};

export default ManualLookupPage;
