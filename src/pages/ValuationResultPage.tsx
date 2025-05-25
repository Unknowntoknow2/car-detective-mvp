
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FoundCarCard from '@/components/lookup/found/FoundCarCard';
import { fetchVehicleByVin } from '@/services/vehicleLookupService';
import { supabase } from '@/integrations/supabase/client';

interface ValuationData {
  id: string;
  vin?: string;
  make: string;
  model: string;
  year: number;
  mileage?: number;
  estimated_value: number;
  confidence_score: number;
  body_type?: string;
  fuel_type?: string;
  transmission?: string;
  color?: string;
  condition?: string;
  price_range?: {
    low: number;
    high: number;
  };
}

export default function ValuationResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ValuationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchValuationData = async () => {
      if (!id) {
        setError('No valuation ID provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Try to fetch from Supabase first
        const { data: valuationData, error: dbError } = await supabase
          .from('valuations')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (dbError) {
          console.error('Database error:', dbError);
          throw new Error('Failed to fetch valuation data');
        }

        if (valuationData) {
          // Convert database response to component format
          const formattedData: ValuationData = {
            id: valuationData.id,
            vin: valuationData.vin,
            make: valuationData.make,
            model: valuationData.model,
            year: valuationData.year,
            mileage: valuationData.mileage,
            estimated_value: valuationData.estimated_value,
            confidence_score: valuationData.confidence_score,
            body_type: valuationData.body_type,
            fuel_type: valuationData.fuel_type,
            transmission: valuationData.transmission,
            color: valuationData.color,
            condition: valuationData.condition || 'Good',
            price_range: valuationData.price_range || {
              low: Math.round(valuationData.estimated_value * 0.95),
              high: Math.round(valuationData.estimated_value * 1.05)
            }
          };

          setData(formattedData);
        } else {
          setError('Valuation not found');
        }
      } catch (err: any) {
        console.error('Error fetching valuation:', err);
        setError(err.message || 'Failed to load valuation data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchValuationData();
  }, [id]);

  const handleTryAgain = () => {
    navigate('/valuation');
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <MainLayout>
        <main className="py-8">
          <div className="container mx-auto px-4 flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading valuation results...</p>
            </div>
          </div>
        </main>
      </MainLayout>
    );
  }

  if (error || !data) {
    return (
      <MainLayout>
        <main className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center">
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Valuation</AlertTitle>
                <AlertDescription>{error || 'Valuation data not found'}</AlertDescription>
              </Alert>
              
              <div className="space-y-3">
                <Button onClick={handleReturnHome} className="w-full">
                  Return to Home
                </Button>
                <Button onClick={handleTryAgain} variant="outline" className="w-full">
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </main>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Valuation Results</h1>
            
            <Card>
              <CardHeader>
                <CardTitle>
                  {data.year} {data.make} {data.model}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FoundCarCard
                  vehicle={{
                    vin: data.vin || '',
                    make: data.make,
                    model: data.model,
                    year: data.year,
                    mileage: data.mileage || 0,
                    bodyType: data.body_type || '',
                    fuelType: data.fuel_type || '',
                    transmission: data.transmission || '',
                    exteriorColor: data.color || '',
                    estimatedValue: data.estimated_value,
                    confidenceScore: data.confidence_score,
                    valuationId: data.id
                  }}
                />
                
                {/* Additional valuation details */}
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Estimated Value:</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${data.estimated_value.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Confidence Score:</span>
                    <span className="text-lg font-semibold">
                      {data.confidence_score}%
                    </span>
                  </div>
                  
                  {data.price_range && (
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Price Range:</span>
                      <span className="text-lg">
                        ${data.price_range.low.toLocaleString()} - ${data.price_range.high.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
