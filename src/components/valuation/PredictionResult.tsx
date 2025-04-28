
import { useEffect, useState } from 'react';
import { usePrediction } from '@/hooks/usePrediction';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ArrowDown, ArrowUp } from 'lucide-react';
import { PhotoUploadAndScore } from './PhotoUploadAndScore';

interface PredictionResultProps {
  valuationId: string;
}

export function PredictionResult({ valuationId }: PredictionResultProps) {
  const { price, isLoading, error, getPrediction } = usePrediction(valuationId);
  const [breakdown, setBreakdown] = useState<any>(null);
  const [photoScore, setPhotoScore] = useState<number | null>(null);

  useEffect(() => {
    if (valuationId) {
      fetchPrediction();
    }
  }, [valuationId]);

  const fetchPrediction = async () => {
    const result = await getPrediction();
    if (result && typeof result === 'object' && 'breakdown' in result) {
      setBreakdown(result.breakdown);
    }
  };

  const handlePhotoScoreChange = (score: number) => {
    setPhotoScore(score);
    // Refetch the prediction with the new photo score
    fetchPrediction();
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/5 pb-2">
          <CardTitle className="text-xl flex justify-between items-center">
            <span>Valuation Estimate</span>
            {!isLoading && !error && price && (
              <Badge variant="secondary" className="text-lg">
                {formatPrice(price)}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-4">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : error ? (
            <div className="p-4 border border-red-200 bg-red-50 rounded-md flex items-start gap-2 text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Error retrieving valuation</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {breakdown && (
                <div className="border rounded-md divide-y">
                  <div className="p-3 flex justify-between items-center">
                    <span className="text-sm font-medium">Base Price</span>
                    <span>{formatPrice(breakdown.basePrice)}</span>
                  </div>
                  
                  <div className="p-3 flex justify-between items-center">
                    <span className="text-sm font-medium">Market Multiplier</span>
                    <span className="flex items-center">
                      {breakdown.multiplier > 1 ? (
                        <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : breakdown.multiplier < 1 ? (
                        <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                      ) : null}
                      {breakdown.multiplier.toFixed(2)}x
                    </span>
                  </div>
                  
                  <div className="p-3 flex justify-between items-center">
                    <span className="text-sm font-medium">Photo Assessment</span>
                    {photoScore !== null ? (
                      <Badge className={photoScore >= 0.7 ? 'bg-green-500' : photoScore >= 0.5 ? 'bg-yellow-500' : 'bg-red-500'}>
                        {breakdown.photoAdjustment}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Not Available</Badge>
                    )}
                  </div>
                  
                  <div className="p-3 flex justify-between items-center bg-primary/5 font-medium">
                    <span>Final Valuation</span>
                    <span>{formatPrice(breakdown.finalPrice)}</span>
                  </div>
                </div>
              )}
              
              <div className="text-sm text-gray-500">
                <p>This valuation is based on vehicle specifications, condition, and market factors.</p>
                <p>Upload a photo below to improve the accuracy of your valuation.</p>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center p-4 border-t bg-gray-50">
          <div className="text-xs text-center text-gray-500">
            Data last updated: {new Date().toLocaleDateString()}
          </div>
        </CardFooter>
      </Card>
      
      <PhotoUploadAndScore 
        valuationId={valuationId}
        onScoreChange={handlePhotoScoreChange}
      />
    </div>
  );
}
