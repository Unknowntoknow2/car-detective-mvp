
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormValidationErrorProps {
  error: string;
  variant?: 'error' | 'warning' | 'info';
}

export function FormValidationError({ error, variant = 'error' }: FormValidationErrorProps) {
  if (!error) return null;
  
  const variantClasses = {
    error: 'text-red-500',
    warning: 'text-amber-500',
    info: 'text-blue-500'
  };
  
  return (
    <div className={`flex items-center mt-1 text-sm ${variantClasses[variant]}`}>
      <AlertCircle className="h-3.5 w-3.5 mr-1" />
      <span>{error}</span>
    </div>
  );
}
