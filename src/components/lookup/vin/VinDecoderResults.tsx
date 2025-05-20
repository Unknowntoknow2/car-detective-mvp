import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import UnifiedValuationResult from '@/components/valuation/UnifiedValuationResult';
import FollowUpForm from '@/components/followup/FollowUpForm';
import FoundCarCard from '@/components/lookup/found/FoundCarCard'; // <-- new import

export default function ValuationResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get('id');
  const vin = searchParams.get('vin');

  const [valuationData, setValuationData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFollowUpSubmitted, setShowFollowUpSubmitted] = useState(false);

  useEffect(() => {
    const fetchValuationData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!id && !vin) throw new Error('No valuation ID or VIN provided');

        const key = id ? `valuation_${id}` : `vin_lookup_${vin}`;
        const storedData = localStorage.getItem(key);

        if (storedData) {
          setValuationData(JSON.parse(storedData));
        } else {
          throw new Error('Valuation data not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch valuation data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchValuationData();
  }, [id, vin]);

  const vehicleInfo = valuationData
    ? {
        make: valuationData.make || 'Unknown',
        model: valuationData.model || 'Unknown',
        year: valuationData.year || new Date().getFullYear(),
        mileage: valuationData.mileage || 0,
        condition: valuationData.condition || 'Good',
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
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Vehicle Valuation Result</CardTitle>
            </CardHeader>
            <CardContent>

              {/* ✅ Found Car Card (VIN details) */}
              <FoundCarCard
                vin={vin || 'N/A'}
                year={vehicleInfo.year.toString()}
                make={vehicleInfo.make}
                model={vehicleInfo.model}
                trim={valuationData?.trim}
                engine={valuationData?.engine}
              />

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

          {!showFollowUpSubmitted ? (
            <Card>
              <CardHeader>
                <CardTitle>Finalize Valuation with Vehicle History</CardTitle>
              </CardHeader>
              <CardContent>
                <FollowUpForm
                  onSubmit={(data) => {
                    console.log('Follow-up answers:', data);
                    setShowFollowUpSubmitted(true);
                  }}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="text-center text-green-600 text-lg font-medium mt-6">
              ✅ Thank you! Your additional details have been saved.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
