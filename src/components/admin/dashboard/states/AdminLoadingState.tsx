
import React from 'react';
import { Loader2 } from 'lucide-react';

export function AdminLoadingState() {
  return (
    <div className="h-64 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading analytics data...</p>
      </div>
    </div>
  );
}
