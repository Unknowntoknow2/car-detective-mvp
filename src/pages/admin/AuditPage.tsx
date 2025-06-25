
import React from 'react';
import { Phase2AuditPanel } from '@/components/admin/Phase2AuditPanel';

export default function AuditPage() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">System Audit Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          Comprehensive validation of market data and valuation systems
        </p>
        
        <Phase2AuditPanel />
      </div>
    </div>
  );
}
