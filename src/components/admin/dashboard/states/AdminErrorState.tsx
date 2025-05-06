
import React from 'react';

interface AdminErrorStateProps {
  error: string;
}

export function AdminErrorState({ error }: AdminErrorStateProps) {
  return (
    <div className="p-8 bg-destructive/10 rounded-lg text-center">
      <h3 className="text-lg font-medium text-destructive mb-2">Error Loading Analytics</h3>
      <p className="text-muted-foreground">{error}</p>
    </div>
  );
}
