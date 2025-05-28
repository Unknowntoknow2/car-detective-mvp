
import React from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { ValuationResult } from '@/components/valuation/ValuationResult';
import { Card } from '@/components/ui/card';

const ResultPage = () => {
  const { id } = useParams<{ id: string }>();

  // In a real app, you would fetch the valuation data based on the ID
  // For now, we'll just mock some data
  const valuationData = {
    success: true, // Added required success property
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    mileage: 35000,
    accidents: 0,
    condition: 'Good',
    estimatedValue: 22500,
    confidenceScore: 85,
    valuationId: id || 'mock-valuation-id' // Added the required valuationId
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Your Valuation Result</h1>
        <Card className="p-6">
          <ValuationResult 
            valuationId={id} 
            data={valuationData}
            isPremium={false}
          />
        </Card>
      </div>
    </MainLayout>
  );
};

export default ResultPage;
