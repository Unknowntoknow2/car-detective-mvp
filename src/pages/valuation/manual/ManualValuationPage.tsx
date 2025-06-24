
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ManualEntryForm } from '@/components/lookup/manual/ManualEntryForm';
import { ManualEntryFormData } from '@/types/manual-entry';
import { useValuation } from '@/contexts/ValuationContext';
import { toast } from 'sonner';

const ManualValuationPage: React.FC = () => {
  const navigate = useNavigate();
  const { processFreeValuation } = useValuation();

  const handleSubmit = async (data: ManualEntryFormData) => {
    console.log('🏗️ ManualValuationPage: Processing standardized submission:', data);
    
    try {
      const valuationResult = await processFreeValuation({
        make: data.make,
        model: data.model,
        year: parseInt(data.year),
        mileage: parseInt(data.mileage),
        condition: data.condition,
        zipCode: data.zipCode
      });
      
      console.log('✅ ManualValuationPage: Valuation completed:', valuationResult);
      toast.success('Manual valuation completed successfully!');
      
      // Navigate to results using unified route
      navigate(`/results/${valuationResult.valuationId}`);
      
    } catch (error) {
      console.error('❌ ManualValuationPage: Valuation failed:', error);
      toast.error('Valuation submission failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Enter Your Vehicle Details
          </h1>
          <p className="text-lg text-gray-600">
            Get an accurate valuation using our comprehensive vehicle database
          </p>
        </div>
        
        <ManualEntryForm 
          onSubmit={handleSubmit}
          tier="free"
        />
      </div>
    </div>
  );
};

export default ManualValuationPage;
