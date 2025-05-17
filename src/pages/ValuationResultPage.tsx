import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import UnifiedValuationResult from '@/components/valuation/UnifiedValuationResult';

export default function ValuationResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get('id');
  const vin = searchParams.get('vin'); // ✅ New: handle VIN-based lookups

  const [valuationData, setValuationData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchValuationData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!id && !vin) {
          throw new Error('No valuation ID or VIN provided');
        }

        if (id) {
          const storedData = localStorage.getItem(`valuation_${id}`);
          if (storedData) {
            setValuationData(JSON.parse(storedData));
            return;
          } else {
            throw new Error('Valuation data not found for given ID');
          }
        }

        if (vin) {
          const storedVinData = localStorage.getItem(`vin_lookup_${vin}`);
          if (storedVinData) {
            setValuationData(JSON.parse(storedVinData));
            return;
          } else {
            throw new Error('No valuation found for this VIN');
          }
        }
      } catch (err) {
        console.error('Error fetching valuation data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch valuation data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchValuationData();
  }, [id, vin]);

  const vehicleInfo = valuationData
    ? {
        make: valuationData.make,
        model: valuationData.model,
        year: valuationData.year,
        mileage: valuationData.mileage,
        condition: valuationData.condition,
      }
    : {
        make: 'Unknown',
        model: 'Vehicle',
        year: new Date().getFullYear(),
        mileage: 0,
        condition: 'Good',
      };

  const estimatedValue = valuationData?.estimatedValue || 25000;
  const priceRange = valuationData?.priceRange || [
    Math.round(estimatedValue * 0.9),
    Math.round(estimatedValue * 1.1),
  ];

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

  if (!valuationData || error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md mx-auto text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Valuation Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'Could not find the requested valuation.'}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return Home
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
              <CardTitle>Vehicle Valuation Result</CardTitle>
            </CardHeader>
            <CardContent>
              <UnifiedValuationResult
                valuationId={id || vin || ''}
                vehicleInfo={vehicleInfo}
                estimatedValue={estimatedValue}
                confidenceScore={valuationData?.confidenceScore || 85}
                priceRange={priceRange}
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
