
import React from 'react';
import { Loader2 } from 'lucide-react';

export function Loading() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" role="status" />
        <span>Loading...</span>
      </div>
    </div>
  );
}
