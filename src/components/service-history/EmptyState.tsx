
import React from 'react';
import { AlertTriangle } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        <h3 className="font-medium">No service records found</h3>
      </div>
      <p className="text-sm">
        No service history records have been uploaded for this vehicle yet. 
        A complete service history can positively impact your vehicle's value.
      </p>
    </div>
  );
}
