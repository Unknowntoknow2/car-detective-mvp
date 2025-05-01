
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-40 text-red-500">
      <AlertTriangle className="h-8 w-8 mb-2" />
      <p>{message}</p>
    </div>
  );
}
