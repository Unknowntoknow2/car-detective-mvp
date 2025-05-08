
import React from 'react';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface FormValidationErrorProps {
  error: string;
  variant?: 'error' | 'warning' | 'info';
}

export const FormValidationError: React.FC<FormValidationErrorProps> = ({ 
  error, 
  variant = 'error'
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 flex-shrink-0 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 flex-shrink-0 text-blue-500" />;
      case 'error':
      default:
        return <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-500" />;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'warning':
        return 'text-yellow-600';
      case 'info':
        return 'text-blue-600';
      case 'error':
      default:
        return 'text-red-500';
    }
  };

  return (
    <div className={`flex items-start gap-2 text-xs ${getTextColor()} animate-fade-in`}>
      {getIcon()}
      <p>{error}</p>
    </div>
  );
};
