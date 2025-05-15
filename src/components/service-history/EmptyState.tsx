
import React from 'react';
import { CalendarX } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <CalendarX className="h-10 w-10 text-muted-foreground mb-2" />
      <h3 className="text-base font-medium mb-1">No service records</h3>
      <p className="text-sm text-muted-foreground">
        Add service records to keep track of your vehicle's maintenance history.
      </p>
    </div>
  );
}
