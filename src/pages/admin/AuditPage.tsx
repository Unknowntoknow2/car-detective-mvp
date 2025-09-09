import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuditPage() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">System Audit Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          Comprehensive validation of market data and valuation systems
        </p>
        
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Audit system temporarily disabled during refactoring.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}