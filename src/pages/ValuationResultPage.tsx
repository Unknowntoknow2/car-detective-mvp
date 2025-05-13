
import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { UnifiedValuationResult } from '@/components/valuation/UnifiedValuationResult';
import { useValuationResult } from '@/hooks/useValuationResult';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ValuationResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get('id');
  const vin = searchParams.get('vin');
  const [tempData, setTempData] = useState<any>(null);
  
  const { data, isLoading, error } = useValuationResult(id || '');

  useEffect(() => {
    // Check for temp valuation data
    const storedData = localStorage.getItem('temp_valuation_data');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setTempData(parsedData);
      } catch (e) {
        console.error('Error parsing temp valuation data:', e);
      }
    }
  }, []);

  // Use data or tempData if available
  const valuationData = data || tempData;

  // Default vehicle info if data is not available
  const vehicleInfo = valuationData ? {
    make: valuationData.make,
    model: valuationData.model,
    year: valuationData.year,
    mileage: valuationData.mileage,
    condition: valuationData.condition
  } : {
    make: 'Unknown',
    model: 'Vehicle',
    year: new Date().getFullYear(),
    mileage: 0,
    condition: 'Good'
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-gray-600">Loading valuation data...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if ((!data && !tempData) || error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md mx-auto text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Valuation Not Found</h1>
            <p className="text-gray-600 mb-6">
              We couldn't find the requested valuation. It may have expired or been deleted.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return Home
              </Button>
              <Button variant="outline" onClick={() => navigate('/vin-lookup')}>
                Start New Valuation
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
                valuationId={id || valuationData?.id || ''}
                vehicleInfo={vehicleInfo}
                estimatedValue={valuationData?.estimated_value || 0}
                confidenceScore={valuationData?.confidence_score || 85}
                priceRange={valuationData?.price_range || [valuationData?.estimated_value * 0.9, valuationData?.estimated_value * 1.1]}
                adjustments={valuationData?.adjustments || []}
              />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
