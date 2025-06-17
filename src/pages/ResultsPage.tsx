
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Valuation Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Valuation ID: {id}</p>
          <p>Your valuation results will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
