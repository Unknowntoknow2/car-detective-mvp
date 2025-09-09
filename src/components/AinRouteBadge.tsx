import React from 'react';

export function AinRouteBadge({ meta }: { 
  meta?: { 
    route?: string; 
    corr_id?: string | null; 
    upstream_status?: string | null 
  } 
}) {
  if (!meta?.route) return null;
  
  const isAin = meta.route === 'ain';
  
  return (
    <div 
      data-testid="ain-route" 
      className="fixed bottom-3 right-3 rounded-xl px-3 py-2 text-sm shadow border bg-background"
    >
      <div className="font-medium">
        AIN Route: <span className="uppercase text-primary">{meta.route}</span>
      </div>
      <div className="text-xs text-muted-foreground">cid: {meta.corr_id}</div>
      {meta.upstream_status ? (
        <div className="text-xs text-muted-foreground">upstream: {meta.upstream_status}</div>
      ) : null}
      {!isAin ? (
        <div className="text-warning font-medium">local path active</div>
      ) : null}
    </div>
  );
}