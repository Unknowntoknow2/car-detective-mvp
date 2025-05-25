
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, Home, RotateCcw } from 'lucide-react';
import FoundCarCard from '@/components/lookup/found/FoundCarCard';

interface ValuationResponse {
  id: string;
  vin?: string;
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  estimated_value?: number;
  confidence_score?: number;
  body_type?: string;
  fuel_type?: string;
  transmission?: string;
  color?: string;
  price_range?: {
    low: number;
    high: number;
  };
  created_at?: string;
  user_id?: string;
}

const ValuationResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ValuationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchValuationData = async () => {
    if (!id) {
      setError('No valuation ID provided');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching valuation with ID:', id);
      
      // First try to fetch by ID
      let { data: valuationData, error: fetchError } = await supabase
        .from('valuations')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      // If no data found by ID, try by VIN (in case the id is actually a VIN)
      if (!valuationData && !fetchError) {
        console.log('No data found by ID, trying VIN lookup:', id);
        const { data: vinData, error: vinError } = await supabase
          .from('valuations')
          .select('*')
          .eq('vin', id)
          .maybeSingle();
        
        valuationData = vinData;
        fetchError = vinError;
      }

      if (fetchError) {
        console.error('Database error:', fetchError);
        throw new Error(`Database error: ${fetchError.message}`);
      }

      if (!valuationData) {
        throw new Error('Valuation not found');
      }

      console.log('Valuation data fetched:', valuationData);
      setData(valuationData);
    } catch (err: any) {
      console.error('Error loading valuation:', err);
      setError(err.message || 'Failed to load valuation data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchValuationData();
  }, [id]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    fetchValuationData();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading valuation results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-700">Error Loading Valuation</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={handleGoHome}>
                <Home className="h-4 w-4 mr-2" />
                Return to Home
              </Button>
              <Button onClick={handleRetry}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <CardTitle>No Data Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              No valuation data was found for the provided ID.
            </p>
            <Button onClick={handleGoHome}>
              <Home className="h-4 w-4 mr-2" />
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={handleGoHome}
              className="mb-4"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Vehicle Valuation Results
            </h1>
            <p className="text-gray-600">
              Detailed valuation report for your vehicle
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Information</CardTitle>
              </CardHeader>
              <CardContent>
                <FoundCarCard
                  vehicle={{
                    vin: data.vin || 'Unknown',
                    make: data.make || 'Unknown',
                    model: data.model || 'Unknown',
                    year: data.year || 0,
                    mileage: data.mileage || 0,
                    bodyType: data.body_type || 'Unknown',
                    fuelType: data.fuel_type || 'Unknown',
                    transmission: data.transmission || 'Unknown',
                    exteriorColor: data.color || 'Unknown',
                    estimatedValue: data.estimated_value || 0,
                    confidenceScore: data.confidence_score || 0,
                    valuationId: data.id
                  }}
                />
                
                {/* Additional valuation details */}
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Estimated Value:</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${(data.estimated_value || 0).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Confidence Score:</span>
                    <span className="text-lg font-semibold">
                      {data.confidence_score || 0}%
                    </span>
                  </div>
                  
                  {data.price_range && (
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Price Range:</span>
                      <span className="text-lg">
                        ${(data.price_range.low || 0).toLocaleString()} - ${(data.price_range.high || 0).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {data.created_at && (
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Valuation Date:</span>
                      <span className="text-sm text-gray-600">
                        {new Date(data.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValuationResultPage;
