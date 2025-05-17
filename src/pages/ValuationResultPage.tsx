import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, FileText, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/components/layout';
import UnifiedValuationResult from '@/components/valuation/UnifiedValuationResult';
<<<<<<< HEAD
import FollowUpForm from '@/components/followup/FollowUpForm';
=======
import { ValuationFactorsGrid } from '@/components/valuation/condition/factors/ValuationFactorsGrid';
import { ConditionSliderWithTooltip } from '@/components/valuation/ConditionSliderWithTooltip';
import { NextStepsCard } from '@/components/valuation/valuation-complete';
import { AIConditionBadge } from '@/components/valuation/AIConditionBadge';
import { toast } from 'sonner';
>>>>>>> origin/main

export default function ValuationResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get('id');
  const vin = searchParams.get('vin');

  const [valuationData, setValuationData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
<<<<<<< HEAD
  const [showFollowUpSubmitted, setShowFollowUpSubmitted] = useState(false);
=======
  const [conditionScore, setConditionScore] = useState(75);
>>>>>>> origin/main

  useEffect(() => {
    const fetchValuationData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!id && !vin) throw new Error('No valuation ID or VIN provided');

        const key = id ? `valuation_${id}` : `vin_lookup_${vin}`;
        const storedData = localStorage.getItem(key);

        if (storedData) {
<<<<<<< HEAD
          setValuationData(JSON.parse(storedData));
=======
          const parsedData = JSON.parse(storedData);
          setValuationData(parsedData);
          
          // Set condition score based on condition
          const conditionMap: Record<string, number> = {
            'Excellent': 90,
            'Good': 75,
            'Fair': 50,
            'Poor': 25
          };
          setConditionScore(conditionMap[parsedData.condition] || 75);
>>>>>>> origin/main
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

<<<<<<< HEAD
=======
  // FEATURE_UNVEIL: Handle condition changes
  const handleConditionChange = (newScore: number) => {
    setConditionScore(newScore);
    toast.info(`Condition updated to ${newScore}%. Recalculating valuation...`);
  };

  // FEATURE_UNVEIL: Handle condition factor changes
  const handleFactorChange = (id: string, value: any) => {
    toast.info(`${id} updated to ${value}. Recalculating valuation...`);
    // In a real implementation, this would update the valuation
  };

  // Generate a default vehicle info if data is not available
>>>>>>> origin/main
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
          <p className="text-lg text-gray-600">Loading valuation data...</p>
        </main>
      </MainLayout>
    );
  }

  if (!valuationData || error) {
    return (
      <MainLayout>
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
      </MainLayout>
    );
  }

  // FEATURE_UNVEIL: Enhanced valuation result view with all available components
  return (
    <MainLayout>
      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Vehicle Valuation Result</span>
                {valuationData.aiCondition && (
                  <AIConditionBadge 
                    condition={valuationData.aiCondition.condition} 
                    confidenceScore={valuationData.aiCondition.confidenceScore || 85} 
                  />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <UnifiedValuationResult
                valuationId={id || vin || ''}
                vehicleInfo={vehicleInfo}
                estimatedValue={estimatedValue}
                confidenceScore={valuationData?.confidenceScore || 85}
                priceRange={priceRange}
                adjustments={valuationData?.adjustments || []}
              />
              
              {/* FEATURE_UNVEIL: Add condition slider */}
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">Condition Assessment</h3>
                <ConditionSliderWithTooltip 
                  score={conditionScore}
                  onScoreChange={handleConditionChange}
                />
              </div>
              
              {/* FEATURE_UNVEIL: Add valuation factors grid */}
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">Value Factors</h3>
                <ValuationFactorsGrid 
                  values={{
                    accidents: valuationData.accident_count || 0,
                    mileage: valuationData.mileage || 0,
                    year: valuationData.year || new Date().getFullYear(),
                    titleStatus: valuationData.titleStatus || 'Clean'
                  }}
                  onChange={handleFactorChange}
                />
              </div>
              
              {/* FEATURE_UNVEIL: Add next steps card */}
              <div className="pt-4 border-t">
                <NextStepsCard 
                  valuationId={id || ''} 
                  isPremium={valuationData.premium_unlocked || false}
                />
              </div>
              
              {/* FEATURE_UNVEIL: Add action buttons */}
              <div className="flex flex-wrap gap-4 pt-4 border-t">
                <Button variant="outline" className="flex-1" onClick={() => {
                  toast.success('Valuation report copied to clipboard');
                }}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Report
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => {
                  toast.success('Generating PDF report...');
                }}>
                  <FileText className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={() => navigate('/premium')}
                  disabled={valuationData.premium_unlocked}
                >
                  {valuationData.premium_unlocked ? 'Premium Unlocked' : 'Upgrade to Premium'}
                </Button>
              </div>
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
    </MainLayout>
  );
}
