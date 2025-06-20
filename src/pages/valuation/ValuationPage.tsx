
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/layout';

export default function ValuationPage() {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Valuation</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Get an accurate valuation for your vehicle using our AI-powered platform.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
