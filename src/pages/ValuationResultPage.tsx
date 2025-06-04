import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { MainLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { ValuationResult } from '@/components/valuation/ValuationResult';
import { CompetitorPriceCard } from '@/components/valuation/CompetitorPriceCard';
import { MarketplaceInsightCard } from '@/components/valuation/MarketplaceInsightCard';
import { PremiumPdfSection } from '@/components/valuation/PremiumPdfSection';
import { AuctionHistorySection } from '@/components/valuation/AuctionHistorySection';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { ValuationResult as ValuationResultType } from '@/types/valuation';

export default function ValuationResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get('id');
  const vin = searchParams.get('vin');

  const [valuationResult, setValuationResult] = useState<ValuationResultType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const key = id ? `valuation_${id}` : `vin_lookup_${vin}`;
        const cached = localStorage.getItem(key);
        if (cached) {
          setValuationResult(JSON.parse(cached));
        } else {
          throw new Error('Valuation not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load valuation data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, vin]);

  if (isLoading) {
    return <MainLayout><p className="text-center p-10">Loading...</p></MainLayout>;
  }

  if (error || !valuationResult) {
    return (
      <MainLayout>
        <main className="flex items-center justify-center py-16">
          <div className="text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
            <h1 className="text-xl font-bold">Valuation Not Found</h1>
            <p>{error || 'Could not find the vehicle record.'}</p>
            <div className="flex justify-center gap-4 mt-4">
              <Button onClick={() => navigate('/')}>Go Home</Button>
              <Button variant="outline" onClick={() => navigate('/valuation')}>Start New</Button>
            </div>
          </div>
        </main>
      </MainLayout>
    );
  }

  const { vin: resultVin, estimatedValue = 0, confidenceScore = 85, priceRange = [estimatedValue * 0.9, estimatedValue * 1.1] } = valuationResult;

  return (
    <MainLayout>
      <div className="container mx-auto py-10 space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => window.history.back()}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
          <h1 className="text-2xl font-bold">Valuation Results</h1>
        </div>

        <Card>
          <CardHeader><CardTitle>Vehicle Valuation Summary</CardTitle></CardHeader>
          <CardContent>
            <ValuationResult valuationId={valuationResult.id} isManualValuation={false} />
            {resultVin && <AuctionHistorySection vin={resultVin} />}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {resultVin && <CompetitorPriceCard vin={resultVin} estimatedValue={estimatedValue} />}
            {resultVin && <MarketplaceInsightCard vin={resultVin} estimatedValue={estimatedValue} />}
          </div>

          {valuationResult.premium_unlocked && (
            <div>
              <PremiumPdfSection valuationResult={valuationResult} isPremium={true} />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
