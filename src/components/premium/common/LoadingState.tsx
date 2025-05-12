
import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingStateProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  text = 'Loading...',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary mb-3`} />
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
};
