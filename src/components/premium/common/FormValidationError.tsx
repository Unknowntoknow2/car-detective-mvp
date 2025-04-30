
import React from 'react';
import { AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormValidationErrorProps {
  error?: string;
  details?: string;
  className?: string;
  showIcon?: boolean;
  variant?: 'error' | 'warning' | 'info';
}

export function FormValidationError({
  error,
  details,
  className,
  showIcon = true,
  variant = 'error'
}: FormValidationErrorProps) {
  if (!error && !details) return null;
  
  const variantClasses = {
    'error': 'text-red-600 bg-red-50 border-red-100',
    'warning': 'text-amber-600 bg-amber-50 border-amber-100',
    'info': 'text-blue-600 bg-blue-50 border-blue-100'
  };
  
  const IconComponent = variant === 'error' ? AlertCircle : Info;

  return (
    <div 
      className={cn(
        'text-sm rounded-md p-3 border shadow-sm',
        variantClasses[variant],
        className
      )}
    >
      <div className="flex gap-2">
        {showIcon && (
          <IconComponent className="h-4 w-4 flex-shrink-0 mt-0.5" />
        )}
        <div className="space-y-1">
          {error && <p className="font-medium">{error}</p>}
          {details && <p className="opacity-90 text-xs leading-relaxed">{details}</p>}
        </div>
      </div>
    </div>
  );
}
