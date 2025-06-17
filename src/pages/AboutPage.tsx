
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>About Car Detective</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">
            Car Detective is an AI-powered vehicle valuation platform that provides accurate market insights for cars.
          </p>
          <p>
            Our platform uses advanced algorithms and real-time market data to give you the most accurate vehicle valuations available.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
