
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ManualEntryForm } from '@/components/lookup/manual/ManualEntryForm';
import { ManualEntryFormData } from '@/types/manual-entry';
import { submitManualValuation } from '@/services/valuation/submitManualValuation';

const ManualValuationPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data: ManualEntryFormData) => {
    try {
      const valuationId = await submitManualValuation(data);
      navigate(`/valuation/result/${valuationId}`);
    } catch (error) {
      console.error('Valuation submission failed:', error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Enter Your Vehicle Details</h1>
      <ManualEntryForm 
        onSubmit={handleSubmit}
        tier="free"
      />
    </div>
  );
};

export default ManualValuationPage;
