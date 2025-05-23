
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormValidationErrorProps {
  error: string;
}

export function FormValidationError({ error }: FormValidationErrorProps) {
  if (!error) return null;
  
  return (
    <div className="flex items-center mt-1 text-sm text-red-500">
      <AlertCircle className="h-3.5 w-3.5 mr-1" />
      <span>{error}</span>
    </div>
  );
}
