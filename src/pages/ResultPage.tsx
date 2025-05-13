
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useParams, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UnifiedValuationResult } from '@/components/valuation/UnifiedValuationResult';

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const valuationId = id || searchParams.get('valuationId');
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Your Valuation Result</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Valuation</CardTitle>
            </CardHeader>
            <CardContent>
              <UnifiedValuationResult valuationId={valuationId} />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
