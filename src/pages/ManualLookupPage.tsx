
import React from 'react';
import { useNavigate } from 'react-router-dom';
import UnifiedManualEntryForm from '@/components/lookup/manual-core/ManualEntryForm';
import { ManualEntryFormData } from '@/types/manual-entry';
import { submitManualValuation } from '@/services/valuation/submitManualValuation';

const ManualLookupPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data: ManualEntryFormData) => {
    try {
      // Optional: Pass userId if logged-in dealer
      const valuationId = await submitManualValuation(data);
      navigate(`/valuation/result/${valuationId}`);
    } catch (error) {
      console.error('Premium valuation submission failed:', error);
      // TODO: Add premium-specific toast or user alert
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Premium Manual Vehicle Valuation</h1>
      <UnifiedManualEntryForm mode="premium" onSubmit={handleSubmit} />
    </div>
  );
};

export default ManualLookupPage;
