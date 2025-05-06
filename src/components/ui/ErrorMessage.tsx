
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className = '' }) => {
  if (!message) return null;
  
  return (
    <div className={`flex items-center gap-1.5 mt-1.5 text-destructive text-sm ${className}`}>
      <AlertCircle className="h-3.5 w-3.5" />
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;
