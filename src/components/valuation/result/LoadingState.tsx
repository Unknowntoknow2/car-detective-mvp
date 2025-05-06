
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading valuation results...' 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
};
