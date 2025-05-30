
import React from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { ValuationResult } from '@/components/valuation/ValuationResult';
import { Card } from '@/components/ui/card';

const ResultPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Your Valuation Result</h1>
        <Card className="p-6">
          <ValuationResult 
            valuationId={id}
            isManualValuation={false}
          />
        </Card>
      </div>
    </MainLayout>
  );
};

export default ResultPage;
