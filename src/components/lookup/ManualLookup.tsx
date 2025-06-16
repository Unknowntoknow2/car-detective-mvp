
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ManualEntryFormFree } from './ManualEntryFormFree';

interface ManualLookupProps {
  onSubmit?: (data: any) => void;
  isLoading?: boolean;
  submitButtonText?: string;
}

export const ManualLookup: React.FC<ManualLookupProps> = ({ 
  onSubmit,
  isLoading = false,
  submitButtonText = "Continue"
}) => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({});
    } else {
      navigate('/manual-valuation');
    }
  };

  return (
    <div className="space-y-4">
      <ManualEntryFormFree onSubmit={handleSubmit} />
    </div>
  );
};
