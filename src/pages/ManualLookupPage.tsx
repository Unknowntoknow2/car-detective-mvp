
import React, { useState } from 'react';
import { ManualFollowUpWrapper } from '@/components/followup/ManualFollowUpWrapper';
import { ManualEntryFormFree } from '@/components/lookup/ManualEntryFormFree';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';

const ManualLookupPage = () => {
  const [formData, setFormData] = useState<ManualEntryFormData | null>(null);

  const handleFormComplete = (data: ManualEntryFormData) => {
    console.log("Manual entry form completed:", data);
    setFormData(data);
  };

  const handleFollowUpComplete = () => {
    console.log("Manual follow-up completed");
    // Could redirect to results or dashboard
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manual Vehicle Lookup</h1>
      <p className="text-gray-600 mb-6">
        Enter your vehicle details manually to get an accurate valuation.
      </p>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        {!formData ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Vehicle Information</h2>
            <p className="text-gray-600 mb-6">
              Please provide basic information about your vehicle.
            </p>
            <ManualEntryFormFree onSubmit={handleFormComplete} />
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4">Additional Details</h2>
            <p className="text-gray-600 mb-6">
              Please provide additional details to complete your valuation.
            </p>
            <ManualFollowUpWrapper
              initialData={formData}
              onComplete={handleFollowUpComplete}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ManualLookupPage;
