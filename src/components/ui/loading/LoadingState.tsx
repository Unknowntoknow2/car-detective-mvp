
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Looking up vehicle information...', 
  className = '' 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 space-y-4 bg-background/40 backdrop-blur-sm rounded-lg border border-border/50 ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
};

export default LoadingState;
