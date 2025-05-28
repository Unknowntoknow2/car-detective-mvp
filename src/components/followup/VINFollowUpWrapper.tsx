
import React from 'react';
import { UnifiedFollowUpForm } from './UnifiedFollowUpForm';

interface VINFollowUpWrapperProps {
  vin: string;
  onComplete?: () => void;
}

export const VINFollowUpWrapper: React.FC<VINFollowUpWrapperProps> = ({
  vin,
  onComplete,
}) => {
  return (
    <UnifiedFollowUpForm
      vin={vin}
      entryMethod="vin"
      onComplete={onComplete}
    />
  );
};
