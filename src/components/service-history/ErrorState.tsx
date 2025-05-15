
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
      <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-2" />
      <h3 className="text-base font-medium text-red-800 mb-1">Error loading service history</h3>
      <p className="text-sm text-red-700">{message}</p>
    </div>
  );
}
