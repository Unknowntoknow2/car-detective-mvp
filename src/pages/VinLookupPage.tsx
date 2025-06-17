
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function VinLookupPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>VIN Lookup</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Enter your VIN to get detailed vehicle information and valuation.</p>
        </CardContent>
      </Card>
    </div>
  );
}
