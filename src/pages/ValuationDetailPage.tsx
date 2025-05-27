
import React from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { ValuationResult } from '@/components/valuation/ValuationResult';
import { Card } from '@/components/ui/card';

const ValuationDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  // For this page, we'll use a mock VIN since we don't have the actual VIN from the URL
  // In a real implementation, you might store the VIN in localStorage or pass it via state
  const mockVin = '1HGBH41JXMN109186';

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Valuation Details</h1>
        <Card className="p-6">
          <ValuationResult vin={mockVin} />
        </Card>
      </div>
    </MainLayout>
  );
};

export default ValuationDetailPage;
