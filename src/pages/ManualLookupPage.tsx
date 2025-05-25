
import React from 'react';
import { ManualLookup } from '@/components/lookup/ManualLookup';
import { toast } from '@/hooks/use-toast';

const ManualLookupPage = () => {
  const handleSubmit = (data: any) => {
    // Here you would normally handle form submission
    console.log("Form submitted with data:", data);
    
    // Show toast with proper structure
    toast({
      title: "Success",
      description: "Vehicle information submitted successfully!",
      variant: "success",
    });
    
    // Redirect to results page or handle response
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manual Vehicle Lookup</h1>
      <p className="text-gray-600 mb-6">
        Enter your vehicle details manually to get an accurate valuation.
      </p>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <ManualLookup onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default ManualLookupPage;
