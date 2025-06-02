
import React from 'react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface ConditionFormProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export const ConditionForm: React.FC<ConditionFormProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Vehicle Condition</h3>
      <p className="text-sm text-muted-foreground">Please provide condition details for your vehicle.</p>
      {/* TODO: Implement condition form fields */}
      <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center text-gray-500">
        Condition Form - Coming Soon
      </div>
    </div>
  );
};
