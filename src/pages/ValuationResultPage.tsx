
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { ValuationResult } from '@/components/valuation/ValuationResult';
import { CompetitorPriceCard } from '@/components/valuation/CompetitorPriceCard';
import { MarketplaceInsightCard } from '@/components/valuation/MarketplaceInsightCard';
import { PremiumPdfSection } from '@/components/valuation/PremiumPdfSection';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import UnifiedValuationResult from '@/components/valuation/UnifiedValuationResult';
import FollowUpForm from '@/components/followup/FollowUpForm';

export default function ValuationResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get('id');
  const vin = searchParams.get('vin');

  const [valuationData, setValuationData] = useState<ValuationResultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [conditionScore, setConditionScore] = useState<number>(75);
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
      <MainLayout>
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <p className="text-lg text-gray-600">Loading vehicle data...</p>
        </main>
      </MainLayout>
    );
  }

  if (error || !valuationResult) {
    return (
      <MainLayout>
        <main className="flex-1 bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md mx-auto text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Vehicle Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'Could not find the requested vehicle data.'}</p>
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
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => window.history.back()} 
            variant="outline" 
            size="sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Valuation Results</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main valuation result */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <ValuationResult 
                valuationId={id}
                isManualValuation={false}
              />
            </Card>
          </div>

          {/* Market insights sidebar */}
          <div className="space-y-6">
            {/* Competitor Price Card */}
            {valuationResult.vin && (
              <CompetitorPriceCard 
                vin={valuationResult.vin}
                estimatedValue={valuationResult.estimatedValue}
              />
            )}

            {/* Marketplace Insight Card */}
            {valuationResult.vin && (
              <MarketplaceInsightCard 
                vin={valuationResult.vin}
                estimatedValue={valuationResult.estimatedValue}
              />
            )}

            {/* Premium PDF Section - only show for premium users */}
            {(isPremium || false) && (
              <PremiumPdfSection 
                valuationResult={valuationResult}
                isPremium={isPremium || false}
              />
            )}
          </div>
        </div>
      </main>
    </MainLayout>
  );
};

export default ValuationResultPage;
