
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { FoundCarCard } from '@/components/lookup/found/FoundCarCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Download, DollarSign, TrendingUp, MapPin } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ValuationResultPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const vin = searchParams.get('vin');
  
  const [valuationData, setValuationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchValuationData = async () => {
      if (!id && !vin) {
        setError('No valuation ID or VIN provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        let query = supabase.from('valuations').select('*');
        
        if (id) {
          query = query.eq('id', id);
        } else if (vin) {
          query = query.eq('vin', vin);
        }

        const { data, error: fetchError } = await query.maybeSingle();

        if (fetchError) {
          console.error('Database error:', fetchError);
          throw new Error(`Database error: ${fetchError.message}`);
        }

        if (!data) {
          throw new Error('Valuation not found');
        }

        setValuationData(data);
      } catch (err: any) {
        console.error('Error loading valuation:', err);
        setError(err.message || 'Failed to load valuation data');
        toast.error('Error loading valuation data');
      } finally {
        setLoading(false);
      }
    };

    fetchValuationData();
  }, [id, vin]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading valuation results...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    );
  }

  if (!valuationData) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              No valuation data found for the specified ID or VIN.
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    );
  }

  // Transform the valuation data to match FoundCarCard expected format
  const vehicleInfo = {
    vin: valuationData.vin || 'Unknown',
    make: valuationData.make || 'Unknown',
    model: valuationData.model || 'Unknown',
    year: valuationData.year || 0,
    mileage: valuationData.mileage,
    bodyType: valuationData.body_type,
    fuelType: valuationData.fuel_type,
    transmission: valuationData.transmission,
    exteriorColor: valuationData.color,
    estimatedValue: valuationData.estimated_value,
    confidenceScore: valuationData.confidence_score,
    valuationId: valuationData.id
  };

  const priceRange = {
    low: Math.round((valuationData.estimated_value || 0) * 0.9),
    high: Math.round((valuationData.estimated_value || 0) * 1.1)
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Valuation Results</h1>
          <p className="text-muted-foreground">
            Complete vehicle analysis for {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
          </p>
        </div>

        {/* Vehicle Information Card */}
        <FoundCarCard vehicle={vehicleInfo} />

        {/* Additional Valuation Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Valuation Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Estimated Value</p>
                <p className="text-2xl font-bold text-green-600">
                  ${(valuationData.estimated_value || 0).toLocaleString()}
                </p>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Price Range</p>
                <p className="text-lg font-semibold text-blue-600">
                  ${priceRange.low.toLocaleString()} - ${priceRange.high.toLocaleString()}
                </p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Confidence Score</p>
                <p className="text-2xl font-bold text-purple-600">
                  {valuationData.confidence_score || 'N/A'}%
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Market Analysis
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Market Condition:</span>
                  <Badge variant="secondary" className="ml-2">
                    {valuationData.condition_score > 80 ? 'Excellent' : 
                     valuationData.condition_score > 60 ? 'Good' : 'Fair'}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Premium Status:</span>
                  <Badge variant={valuationData.premium_unlocked ? 'default' : 'outline'} className="ml-2">
                    {valuationData.premium_unlocked ? 'Premium' : 'Standard'}
                  </Badge>
                </div>
              </div>
            </div>

            {valuationData.state && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Location:</span>
                <span>{valuationData.state}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button 
            onClick={() => window.print()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Report
          </Button>
          <Button onClick={() => window.history.back()}>
            Back to Search
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default ValuationResultPage;
