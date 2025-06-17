
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ValuationResultPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Valuation Result</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Result ID: {id}</p>
          <p>Your detailed valuation results will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
