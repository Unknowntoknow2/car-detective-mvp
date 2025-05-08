
import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export interface FormValidationErrorProps {
  error: string;
  variant?: 'error' | 'success' | 'info';
  className?: string;
  details?: string; // Add support for details prop
}

export function FormValidationError({
  error,
  variant = 'error',
  className = '',
  details
}: FormValidationErrorProps) {
  if (!error) return null;
  
  const variantClasses = {
    error: 'text-red-600',
    success: 'text-green-600',
    info: 'text-blue-600'
  };
  
  const variantIcons = {
    error: <AlertCircle className="h-4 w-4 flex-shrink-0" />,
    success: <CheckCircle className="h-4 w-4 flex-shrink-0" />,
    info: <Info className="h-4 w-4 flex-shrink-0" />
  };
  
  return (
    <div className={`flex items-start gap-2 text-sm ${variantClasses[variant]} ${className}`}>
      {variantIcons[variant]}
      <div>
        <p>{error}</p>
        {details && <p className="text-xs mt-1 opacity-80">{details}</p>}
      </div>
    </div>
  );
}
