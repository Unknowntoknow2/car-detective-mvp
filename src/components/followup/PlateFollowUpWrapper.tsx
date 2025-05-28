
import React from 'react';
import { UnifiedFollowUpForm } from './UnifiedFollowUpForm';

interface PlateFollowUpWrapperProps {
  plateNumber: string;
  onComplete?: () => void;
}

export const PlateFollowUpWrapper: React.FC<PlateFollowUpWrapperProps> = ({
  plateNumber,
  onComplete,
}) => {
  return (
    <UnifiedFollowUpForm
      plateNumber={plateNumber}
      entryMethod="plate"
      onComplete={onComplete}
    />
  );
};
