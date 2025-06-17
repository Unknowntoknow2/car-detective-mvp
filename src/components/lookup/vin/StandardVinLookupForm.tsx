
import React from 'react';
import { VinForm } from '../VinForm';

interface StandardVinLookupFormProps {
  onSubmit: (vin: string) => void;
  isLoading?: boolean;
}

export const VINLookupForm: React.FC<StandardVinLookupFormProps> = ({ onSubmit, isLoading }) => {
  return <VinForm onSubmit={onSubmit} isLoading={isLoading} />;
};

export default VINLookupForm;
