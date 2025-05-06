
import React from 'react';

export function AdminEmptyState() {
  return (
    <div className="p-8 bg-muted rounded-lg text-center">
      <h3 className="text-lg font-medium mb-2">No Data Available</h3>
      <p className="text-muted-foreground">Analytics data could not be loaded.</p>
    </div>
  );
}
