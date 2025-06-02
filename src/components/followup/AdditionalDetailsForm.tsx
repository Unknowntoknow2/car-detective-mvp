
import React from 'react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface AdditionalDetailsFormProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export const AdditionalDetailsForm: React.FC<AdditionalDetailsFormProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Additional Details</h3>
      <p className="text-sm text-muted-foreground">Provide any additional information about your vehicle.</p>
      {/* TODO: Implement additional details form fields */}
      <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center text-gray-500">
        Additional Details Form - Coming Soon
      </div>
    </div>
  );
};
