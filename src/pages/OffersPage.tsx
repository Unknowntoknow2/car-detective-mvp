
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useValuationResult } from '@/hooks/useValuationResult';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function OffersPage() {
  const { user } = useAuth();
  const { result, isLoading, error, calculateValuation } = useValuationResult();

  const handleCalculateValuation = async () => {
    try {
      await calculateValuation({
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        mileage: 50000
      });
    } catch (err) {
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Dealer Offers</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Get Offers</CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <div>
                <p>Estimated Value: ${result.estimatedValue?.toLocaleString()}</p>
                <p>Confidence: {result.confidenceScore}%</p>
              </div>
            ) : (
              <div>
                <p>Calculate your vehicle valuation to receive dealer offers.</p>
                <Button onClick={handleCalculateValuation} disabled={isLoading}>
                  {isLoading ? 'Calculating...' : 'Get Valuation'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
