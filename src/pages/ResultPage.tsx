
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearchParams, useNavigate } from 'react-router-dom';
import UnifiedValuationResult from '@/components/valuation/UnifiedValuationResult';
import { useValuationResult } from '@/hooks/useValuationResult';
import { formatNumber } from '@/utils/formatters/formatNumber';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { ConditionSliderWithTooltip } from '@/components/valuation/ConditionSliderWithTooltip';
import { ConfidenceScore } from '@/components/valuation/ConfidenceScore';
import { ValuationFactorsGrid } from '@/components/valuation/condition/factors/ValuationFactorsGrid';
import { toast } from 'sonner';

export default function ResultPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [conditionScore, setConditionScore] = useState(75);
  
  // If no ID is provided, try to get it from localStorage
  const storedId = !id ? localStorage.getItem('latest_valuation_id') : null;
  const valuationId = id || storedId || '';
  
  const { data, isLoading, error } = useValuationResult(valuationId);

  // FEATURE_UNVEIL: Handle condition changes
  const handleConditionChange = (newScore: number) => {
    setConditionScore(newScore);
    // In a real implementation, this would update the valuation
    toast.info(`Condition updated to ${newScore}%. Recalculating valuation...`);
  };

  // Fallback to stored data if API call fails
  const getStoredValuation = () => {
    if (!valuationId) return null;
    const storedData = localStorage.getItem(`valuation_${valuationId}`);
    return storedData ? JSON.parse(storedData) : null;
  };
  
  const storedValuation = getStoredValuation();
  const valuationData = data || storedValuation;

  // FEATURE_UNVEIL: Default vehicle info if data is not available
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
  const confidenceScore = valuationData?.confidenceScore || 85;

  useEffect(() => {
    // Set initial condition score from valuation data if available
    if (valuationData?.condition) {
      const conditionMap: Record<string, number> = {
        'Excellent': 90,
        'Good': 75,
        'Fair': 50,
        'Poor': 25
      };
      setConditionScore(conditionMap[valuationData.condition] || 75);
    }
  }, [valuationData]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex-1 bg-gray-50 flex items-center justify-center">
          <p className="text-lg text-gray-600">Loading valuation data...</p>
        </div>
      </MainLayout>
    );
  }

  if (!valuationId || (!data && !storedValuation)) {
    return (
      <MainLayout>
        <div className="flex-1 bg-gray-50 flex items-center justify-center">
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
        </div>
      </MainLayout>
    );
  }

  // FEATURE_UNVEIL: Show full result page with conditional sections
  return (
    <MainLayout>
      <div className="bg-gray-50">
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
                confidenceScore={confidenceScore}
                priceRange={valuationData?.priceRange}
                adjustments={valuationData?.adjustments}
              />
              
              {/* FEATURE_UNVEIL: Display Confidence Score */}
              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Valuation Confidence</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ConfidenceScore 
                    score={confidenceScore} 
                    comparableVehicles={valuationData?.comparableVehicles || 42}
                  />
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Vehicle Condition</h4>
                    <ConditionSliderWithTooltip 
                      score={conditionScore} 
                      onScoreChange={handleConditionChange}
                    />
                  </div>
                </div>
              </div>
              
              {/* FEATURE_UNVEIL: Add Valuation Factors */}
              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Condition Factors</h3>
                <ValuationFactorsGrid 
                  values={{
                    accidents: valuationData?.accident_count || 0,
                    mileage: valuationData?.mileage || 0,
                    year: valuationData?.year || new Date().getFullYear(),
                    titleStatus: 'Clean'
                  }}
                  onChange={(id, value) => {
                    toast.info(`${id} updated to ${value}. Recalculating valuation...`);
                    // In a real implementation, this would update the valuation
                  }}
                />
              </div>
              
              {/* FEATURE_UNVEIL: Dealer Offers Section */}
              <div className="mt-8 border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Dealer Offers</h3>
                  <Button variant="outline" size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Request Offers
                  </Button>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  No dealer offers yet. Share your valuation with dealers to receive offers.
                </p>
              </div>
              
              {/* FEATURE_UNVEIL: Premium Features Teaser */}
              <div className="mt-8 border-t pt-6 bg-slate-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Premium Features Available</h3>
                <p className="text-muted-foreground mb-4">
                  Unlock advanced valuation insights, CARFAX integration, and more detailed condition analysis.
                </p>
                <Button onClick={() => navigate('/premium')}>
                  Upgrade to Premium
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
