
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DealerVehicleDetailsPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Vehicle ID: {id}</p>
          {/* Details will be fetched from API based on ID */}
        </CardContent>
      </Card>
    </div>
  );
}
