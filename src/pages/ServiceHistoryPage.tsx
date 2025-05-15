
import React from 'react';
import { ServiceHistoryDisplay } from '@/components/service-history/ServiceHistoryDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ServiceHistoryPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Service History</CardTitle>
        </CardHeader>
        <CardContent>
          <ServiceHistoryDisplay />
        </CardContent>
      </Card>
    </div>
  );
}
