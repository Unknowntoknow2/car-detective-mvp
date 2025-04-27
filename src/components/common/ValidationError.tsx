
import React from 'react';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidationErrorProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  className?: string;
  showIcon?: boolean;
  details?: string;
}

export const ValidationError: React.FC<ValidationErrorProps> = ({
  message,
  type = 'error',
  className,
  showIcon = true,
  details
}) => {
  const icons = {
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  };

  const Icon = icons[type];

  const styles = {
    error: 'bg-destructive/10 text-destructive border-destructive/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    info: 'bg-primary/10 text-primary border-primary/20'
  };

  return (
    <div className={cn(
      'rounded-md p-3 text-sm border flex items-start gap-2',
      styles[type],
      className
    )}>
      {showIcon && <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />}
      <div>
        <p className="font-medium">{message}</p>
        {details && (
          <p className="mt-1 text-xs opacity-90">{details}</p>
        )}
      </div>
    </div>
  );
};
