
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearchParams } from 'react-router-dom';
import UnifiedValuationResult from '@/components/valuation/UnifiedValuationResult';
import { useValuationResult } from '@/hooks/useValuationResult';

export default function ResultPage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const { data, isLoading } = useValuationResult(id || '');

  // Default vehicle info if data is not available
  const vehicleInfo = data ? {
    make: data.make,
    model: data.model,
    year: data.year,
    mileage: data.mileage,
    condition: data.condition
  } : {
    make: 'Unknown',
    model: 'Vehicle',
    year: new Date().getFullYear(),
    mileage: 0,
    condition: 'Good'
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Valuation</CardTitle>
            </CardHeader>
            <CardContent>
              <UnifiedValuationResult 
                valuationId={id || ''} 
                vehicleInfo={vehicleInfo}
                estimatedValue={data?.estimatedValue || 0}
                confidenceScore={data?.confidenceScore || 85}
                priceRange={data?.priceRange}
                adjustments={data?.adjustments}
              />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
