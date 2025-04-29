
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { usePrediction } from '@/hooks/usePrediction';
import { Loader2, Check, X, AlertTriangle, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PredictionResultProps {
  valuationId: string;
}

export function PredictionResult({ valuationId }: PredictionResultProps) {
  const [predictionData, setPredictionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchPrediction } = usePrediction();

  useEffect(() => {
    const loadPrediction = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, this would fetch from your API
        // For now, we'll mock a successful prediction
        
        // First attempt to get from the database
        const { data, error } = await supabase
          .from('valuations')
          .select('*')
          .eq('id', valuationId)
          .single();
        
        if (error) {
          // If it's not in DB yet, call the prediction service
          const prediction = await fetchPrediction(valuationId);
          setPredictionData(prediction);
        } else {
          // Use data from DB
          setPredictionData({
            estimatedValue: data.base_price,
            confidenceScore: 0.85,
            priceRange: [data.base_price * 0.95, data.base_price * 1.05],
            adjustments: [
              { name: 'Mileage', value: -500, percentage: -0.02 },
              { name: 'Condition', value: 1200, percentage: 0.05 },
              { name: 'Market Demand', value: 300, percentage: 0.01 }
            ]
          });
        }
      } catch (err) {
        console.error('Error fetching prediction:', err);
        setError('Failed to load valuation data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPrediction();
  }, [valuationId, fetchPrediction]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="text-center pb-3">
          <CardTitle>Calculating Valuation</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-center text-muted-foreground">Analyzing market data and vehicle details...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/30 bg-destructive/5">
        <CardHeader className="text-center pb-3">
          <CardTitle className="flex items-center justify-center gap-2">
            <X className="h-5 w-5 text-destructive" />
            Valuation Error
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p>{error}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Please try again or contact support if the problem persists.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Check className="h-5 w-5 text-success" />
          Valuation Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="estimate">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="estimate">Estimate</TabsTrigger>
            <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
            <TabsTrigger value="confidence">Confidence</TabsTrigger>
          </TabsList>
          
          <TabsContent value="estimate" className="space-y-4">
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-primary">
                {predictionData?.estimatedValue 
                  ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(predictionData.estimatedValue)
                  : 'N/A'}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Estimated Value</p>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-md">
              <div className="flex justify-between text-sm mb-2">
                <span>Price Range</span>
                <span className="font-medium">
                  {predictionData?.priceRange ? (
                    `${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(predictionData.priceRange[0])}
                     - 
                     ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(predictionData.priceRange[1])}`
                  ) : 'N/A'}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                <AlertTriangle className="h-3 w-3 inline mr-1" />
                This range represents typical market variation.
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="breakdown" className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Value Adjustments</h3>
            </div>
            
            {predictionData?.adjustments?.map((adj: any, index: number) => (
              <div key={index} className="flex justify-between py-2 border-b border-border last:border-0">
                <span>{adj.name}</span>
                <span className={adj.value >= 0 ? 'text-success' : 'text-destructive'}>
                  {adj.value >= 0 ? '+' : ''}
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(adj.value)}
                  <span className="text-xs ml-1">({adj.percentage >= 0 ? '+' : ''}{(adj.percentage * 100).toFixed(1)}%)</span>
                </span>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="confidence" className="space-y-4">
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-primary">
                {predictionData?.confidenceScore ? `${(predictionData.confidenceScore * 100).toFixed(0)}%` : 'N/A'}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Confidence Score</p>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-md">
              <h4 className="font-medium mb-2">How to improve accuracy:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-success mt-0.5" />
                  <span>Upload a photo of your vehicle</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-success mt-0.5" />
                  <span>Provide detailed vehicle history</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-success mt-0.5" />
                  <span>Upgrade to premium for CARFAX integration</span>
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
