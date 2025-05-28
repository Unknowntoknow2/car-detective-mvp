
import React from 'react';
import { UnifiedFollowUpForm } from './UnifiedFollowUpForm';
import { ManualEntryFormData } from '../lookup/types/manualEntry';

interface ManualFollowUpWrapperProps {
  initialData: ManualEntryFormData;
  onComplete?: () => void;
}

export const ManualFollowUpWrapper: React.FC<ManualFollowUpWrapperProps> = ({
  initialData,
  onComplete,
}) => {
  return (
    <UnifiedFollowUpForm
      initialData={initialData}
      entryMethod="manual"
      onComplete={onComplete}
    />
  );
};
