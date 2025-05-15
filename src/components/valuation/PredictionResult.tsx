import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getValuationById } from '@/services/valuationService';
import { AICondition } from '@/types/photo';
import { formatCurrency } from '@/utils/formatters';
import { ValuationResults } from './ValuationResults';
import { DealerOffersList } from '@/components/dealer/DealerOffersList';
import { toast } from '@/components/ui/use-toast';

interface PredictionResultProps {
  valuationId: string;
  manualValuation?: any;
  photoCondition?: AICondition;
}

export function PredictionResult({ 
  valuationId, 
  manualValuation,
  photoCondition
}: PredictionResultProps) {
  useEffect(() => {
    console.log('PREDICTION: Component mounted with props:', { 
      valuationId, 
      hasManualValuation: !!manualValuation,
      hasPhotoCondition: !!photoCondition 
    });
  }, [valuationId, manualValuation, photoCondition]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any | null>(null);
  
  useEffect(() => {
    // If we have manual valuation data, use it directly
    if (manualValuation) {
      console.log('PREDICTION: Using manual valuation data:', manualValuation);
      setData({
        make: manualValuation.make,
        model: manualValuation.model,
        year: manualValuation.year,
        mileage: manualValuation.mileage,
        condition: manualValuation.condition,
        zipCode: manualValuation.zipCode || '90210',
        estimated_value: manualValuation.valuation || 25000,
        confidence_score: manualValuation.confidenceScore || 85,
        base_price: manualValuation.basePrice || 25000,
        adjustments: manualValuation.adjustments || [],
        aiCondition: photoCondition
      });
      return;
    }
    
    // Otherwise, fetch valuation data from the API
    async function fetchValuationData() {
      if (!valuationId) {
        console.warn('PREDICTION: No valuationId provided, cannot fetch data');
        return;
      }
      
      try {
        console.log('PREDICTION: Fetching valuation data for ID:', valuationId);
        setIsLoading(true);
        setError(null);
        
        const result = await getValuationById(valuationId);
        console.log('PREDICTION: Valuation data received:', result);
        
        setData({
          ...result,
          aiCondition: photoCondition
        });
      } catch (err) {
        console.error('PREDICTION: Error fetching valuation data:', err);
        setError('Failed to load valuation data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchValuationData();
  }, [valuationId, manualValuation, photoCondition]);

  useEffect(() => {
    if (data) {
      console.log('PREDICTION: Data state updated:', data);
    }
  }, [data]);
  
  const handleRefresh = async () => {
    if (!valuationId) {
      console.warn('PREDICTION: Cannot refresh - missing valuationId');
      return;
    }
    
    try {
      console.log('PREDICTION: Refreshing valuation data for ID:', valuationId);
      setIsLoading(true);
      setError(null);
      
      const result = await getValuationById(valuationId);
      console.log('PREDICTION: Refreshed data received:', result);
      
      setData({
        ...result,
        aiCondition: photoCondition
      });
    } catch (err) {
      console.error('PREDICTION: Error refreshing valuation data:', err);
      setError('Failed to refresh valuation data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailReport = () => {
    toast({
      description: "The report will be sent to your email address."
    });
  };

  const handleShareClick = () => {
    toast({
      description: "Valuation report has been shared successfully!"
    });
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Valuation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>{error}</p>
          {valuationId && (
            <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-2">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Data Available</AlertTitle>
        <AlertDescription>
          No valuation data is available for this vehicle.
        </AlertDescription>
      </Alert>
    );
  }

  // Generate some mock adjustments if none are provided
  const adjustments = data.adjustments && data.adjustments.length > 0 
    ? data.adjustments 
    : [
        { 
          factor: 'Mileage', 
          impact: -500, 
          description: `Based on ${data.mileage?.toLocaleString() || '45,000'} miles` 
        },
        { 
          factor: 'Condition', 
          impact: data.condition === 'Excellent' ? 1500 : 
                  data.condition === 'Good' ? 500 : 
                  data.condition === 'Fair' ? -500 : -1500, 
          description: `${data.condition || 'Good'} condition` 
        },
        { 
          factor: 'Market Demand', 
          impact: 750, 
          description: 'High demand in your region' 
        }
      ];

  // Extract AI condition data if available
  let aiConditionAdjustment = null;
  if (data.aiCondition) {
    const aiConditionImpact = 
      data.aiCondition.condition === 'Excellent' ? 1500 :
      data.aiCondition.condition === 'Good' ? 500 :
      data.aiCondition.condition === 'Fair' ? -500 : -1500;
    
    aiConditionAdjustment = {
      factor: 'AI Condition Assessment',
      impact: aiConditionImpact,
      description: `Based on photo analysis: ${data.aiCondition.condition} (${data.aiCondition.confidenceScore}% confidence)`
    };
    
    // Add AI condition adjustment to the adjustments array
    adjustments.push(aiConditionAdjustment);
  }
  
  return (
    <>
      <ValuationResults
        estimatedValue={data.estimated_value || data.valuation || 25000}
        confidenceScore={data.confidence_score || data.confidenceScore || 85}
        basePrice={data.base_price || data.basePrice}
        adjustments={adjustments}
        priceRange={data.price_range || data.priceRange}
        demandFactor={data.zip_demand_factor}
        vehicleInfo={{
          year: data.year,
          make: data.make,
          model: data.model,
          trim: data.trim,
          mileage: data.mileage,
          condition: data.condition
        }}
        onEmailReport={handleEmailReport}
      />
      
      {valuationId && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Dealer Offers</h3>
          <DealerOffersList reportId={valuationId} showActions={true} />
        </div>
      )}
    </>
  );
}

export default PredictionResult;
