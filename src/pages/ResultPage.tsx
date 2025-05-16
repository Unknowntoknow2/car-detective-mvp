
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearchParams, useNavigate } from 'react-router-dom';
import UnifiedValuationResult from '@/components/valuation/UnifiedValuationResult';
import { useValuationResult } from '@/hooks/useValuationResult';
import { formatNumber } from '@/utils/formatters/formatNumber';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ResultPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  
  // If no ID is provided, try to get it from localStorage
  const storedId = !id ? localStorage.getItem('latest_valuation_id') : null;
  const valuationId = id || storedId || '';
  
  const { data, isLoading, error } = useValuationResult(valuationId);

  // Fallback to stored data if API call fails
  const getStoredValuation = () => {
    if (!valuationId) return null;
    const storedData = localStorage.getItem(`valuation_${valuationId}`);
    return storedData ? JSON.parse(storedData) : null;
  };
  
  const storedValuation = getStoredValuation();
  const valuationData = data || storedValuation;

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

  // Format values for display
  const formattedMileage = valuationData?.mileage ? formatNumber(valuationData.mileage, 0) : '0';
  const estimatedValue = valuationData?.estimatedValue || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <p className="text-lg text-gray-600">Loading valuation data...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!valuationId || (!data && !storedValuation)) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center p-6">
            <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
            <p className="text-gray-600 mb-6">
              The page you're looking for doesn't exist or has been moved. If you were trying to view a valuation result, it may have expired or been deleted.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/')} className="mb-2 sm:mb-0">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go to Home
              </Button>
              <Button variant="outline" onClick={() => navigate('/valuation')}>
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
                valuationId={valuationId} 
                vehicleInfo={vehicleInfo}
                estimatedValue={estimatedValue}
                confidenceScore={valuationData?.confidenceScore || 85}
                priceRange={valuationData?.priceRange}
                adjustments={valuationData?.adjustments}
              />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
