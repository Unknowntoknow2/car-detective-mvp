
import React from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { ValuationResult } from '@/components/valuation/ValuationResult';
import { Card } from '@/components/ui/card';

const ValuationDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  // In a real app, you would fetch the valuation data based on the ID
  // For now, we'll just mock some data
  const valuationData = {
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    condition: 'Good',
    estimatedValue: 22500,
    confidenceScore: 85,
    basePrice: 20000,
    adjustments: [
      {
        factor: 'Low Mileage',
        impact: 1500,
        description: 'Vehicle has below average mileage for its age'
      },
      {
        factor: 'Good Condition',
        impact: 1000,
        description: 'Vehicle is in excellent condition'
      }
    ]
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Valuation Details</h1>
        <Card className="p-6">
          <ValuationResult data={valuationData} />
        </Card>
      </div>
    </MainLayout>
  );
};

export default ValuationDetailPage;
