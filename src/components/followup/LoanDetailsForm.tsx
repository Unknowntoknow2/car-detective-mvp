
import React from 'react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface LoanDetailsFormProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export const LoanDetailsForm: React.FC<LoanDetailsFormProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Loan Details</h3>
      <p className="text-sm text-muted-foreground">Information about any existing loans on this vehicle.</p>
      {/* TODO: Implement loan details form fields */}
      <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center text-gray-500">
        Loan Details Form - Coming Soon
      </div>
    </div>
  );
};
