
import React from 'react';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface FormValidationErrorProps {
  error: string;
  variant?: 'error' | 'warning' | 'info';
}

export function FormValidationError({ 
  error, 
  variant = 'error' 
}: FormValidationErrorProps) {
  let Icon = AlertCircle;
  let textColor = 'text-red-500';
  
  if (variant === 'warning') {
    Icon = AlertTriangle;
    textColor = 'text-amber-500';
  } else if (variant === 'info') {
    Icon = Info;
    textColor = 'text-blue-500';
  }
  
  return (
    <div className={`flex items-start gap-2 ${textColor} text-sm`}>
      <Icon className="h-4 w-4 flex-shrink-0 mt-0.5" />
      <p>{error}</p>
    </div>
  );
}
