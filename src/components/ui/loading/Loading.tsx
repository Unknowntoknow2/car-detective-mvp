
import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingProps {
  size?: number;
  message?: string;
  className?: string;
  minHeight?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 12, 
  message = 'Loading...', 
  className = '',
  minHeight = '300px'
}) => {
  return (
    <div className={`flex items-center justify-center h-full min-h-[${minHeight}] w-full ${className}`} role="status">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className={`h-${size} w-${size} animate-spin text-primary`} />
        {message && <p className="text-lg font-medium">{message}</p>}
      </div>
    </div>
  );
};

export default Loading;
