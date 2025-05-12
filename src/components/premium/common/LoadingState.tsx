
import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingStateProps {
  text?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  text = 'Loading...'
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
};
