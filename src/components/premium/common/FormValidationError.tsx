
import React from 'react';
import { AlertCircle, XCircle, AlertTriangle } from 'lucide-react';

interface FormValidationErrorProps {
  error: string;
  variant?: 'error' | 'warning' | 'info';
}

export function FormValidationError({ 
  error, 
  variant = 'error' 
}: FormValidationErrorProps) {
  if (!error) return null;
  
  const getIcon = () => {
    switch (variant) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'info':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };
  
  const getTextColor = () => {
    switch (variant) {
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-amber-500';
      case 'info':
        return 'text-blue-500';
      default:
        return 'text-red-500';
    }
  };
  
  return (
    <div className={`flex items-start gap-2 text-sm ${getTextColor()}`}>
      {getIcon()}
      <p>{error}</p>
    </div>
  );
}
