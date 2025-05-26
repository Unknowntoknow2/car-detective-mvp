
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { ValuationResultPremium } from '@/components/valuation/result/ValuationResultPremium';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { supabase } from '@/integrations/supabase/client';
import { ValuationResponse } from '@/types/vehicle';

export default function ResultsPage() {
  const [searchParams] = useSearchParams();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get valuationId from URL params or search params, ensure it's clean
  const rawValuationId = id || searchParams.get('valuationId');
  const valuationId = rawValuationId && rawValuationId !== ':id' && rawValuationId !== '%3Aid' 
    ? decodeURIComponent(rawValuationId) 
    : null;
  
  console.log('ResultsPage - Route ID:', id);
  console.log('ResultsPage - Search param valuationId:', searchParams.get('valuationId'));
  console.log('ResultsPage - Final cleaned valuationId:', valuationId);
  
  // Check premium access
  const { hasPremiumAccess } = usePremiumAccess(valuationId || undefined);

  // Fetch valuation data
  useEffect(() => {
    const fetchValuationData = async () => {
      if (!valuationId || valuationId === ':id' || valuationId === '%3Aid') {
        setError('No valuation ID or VIN provided');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log('Fetching valuation data for ID/VIN:', valuationId);
        
        let result = null;
        let apiError = null;

        // Helper function to validate UUID format
        const isValidUUID = (id: string): boolean => {
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          return uuidRegex.test(id);
        };

        // Helper function to validate VIN format
        const isValidVIN = (vin: string): boolean => {
          return /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);
        };

        // First try to fetch by ID if it's a valid UUID
        if (isValidUUID(valuationId)) {
          console.log('Attempting fetch by UUID:', valuationId);
          const response = await supabase
            .from('valuations')
            .select('*')
            .eq('id', valuationId)
            .maybeSingle();
          
          result = response.data;
          apiError = response.error;
        }
        
        // If no result and it looks like a VIN, try fetching by VIN
        if (!result && isValidVIN(valuationId)) {
          console.log('Attempting fetch by VIN:', valuationId);
          const response = await supabase
            .from('valuations')
            .select('*')
            .eq('vin', valuationId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
          
          result = response.data;
          apiError = response.error;
        }

        // If still no result, try to trigger a new VIN lookup
        if (!result && isValidVIN(valuationId)) {
          console.log('No existing valuation found, triggering new VIN lookup');
          
          // Call the car-price-prediction function to create a new valuation
          const { data: newValuation, error: predictionError } = await supabase.functions.invoke('car-price-prediction', {
            body: {
              make: 'Toyota', // Mock data - in real app this would come from VIN decode
              model: 'Camry',
              year: 2020,
              mileage: 45000,
              condition: 'good',
              zipCode: '90210',
              fuelType: 'Gasoline',
              transmission: 'Automatic',
              color: 'Silver',
              bodyType: 'Sedan',
              vin: valuationId
            }
          });

          if (predictionError) {
            console.error('Error creating new valuation:', predictionError);
            throw new Error('Failed to create valuation for VIN');
          }

          // Try to fetch the newly created valuation
          if (newValuation?.id) {
            const response = await supabase
              .from('valuations')
              .select('*')
              .eq('id', newValuation.id)
              .maybeSingle();
            
            result = response.data;
            apiError = response.error;
          } else {
            // Use the response data directly if no ID
            result = {
              id: newValuation?.id || `temp-${Date.now()}`,
              vin: valuationId,
              make: newValuation?.make || 'Toyota',
              model: newValuation?.model || 'Camry',
              year: newValuation?.year || 2020,
              mileage: newValuation?.mileage || 45000,
              estimated_value: newValuation?.estimatedValue || 15000,
              confidence_score: newValuation?.confidenceScore || 85,
              fuel_type: newValuation?.fuelType || 'Gasoline',
              transmission: newValuation?.transmission || 'Automatic',
              body_type: newValuation?.bodyType || 'Sedan',
              color: newValuation?.color || 'Silver'
            };
          }
        }

        if (apiError && !result) {
          console.error('Supabase API error:', apiError);
          throw new Error(apiError.message || 'Failed to fetch valuation data');
        }

        if (result) {
          console.log('Valuation data fetched successfully:', result);
          setData(result);
        } else {
          throw new Error('Valuation not found');
        }
      } catch (err: any) {
        console.error('Error fetching valuation result:', err);
        setError(err.message || 'Failed to load valuation data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchValuationData();
  }, [valuationId]);
  
  const handleUpgrade = () => {
    navigate(`/premium?valuationId=${valuationId}`);
  };
  
  // Convert ValuationResult to ValuationResponse
  const convertToValuationResponse = (data: any): ValuationResponse => {
    return {
      make: data.make || '',
      model: data.model || '',
      year: data.year || 0,
      estimatedValue: data.estimatedValue || data.estimated_value || 0,
      confidenceScore: data.confidenceScore || data.confidence_score || 0,
      valuationId: data.valuationId || data.id || '',
      condition: data.condition || 'Unknown',
      mileage: data.mileage || 0,
      vin: data.vin || '',
      zipCode: data.zipCode || data.zip_code || '',
      fuelType: data.fuelType || data.fuel_type || '',
      transmission: data.transmission || '',
      bodyType: data.bodyType || data.body_type || '',
      color: data.color || '',
      trim: data.trim || '',
      price_range: data.price_range || {
        low: Math.round((data.estimatedValue || data.estimated_value || 0) * 0.95),
        high: Math.round((data.estimatedValue || data.estimated_value || 0) * 1.05)
      },
      isPremium: hasPremiumAccess,
      aiCondition: data.aiCondition || {
        condition: data.condition || 'Unknown',
        confidenceScore: data.confidence_score || 75,
        issuesDetected: []
      },
      userId: data.userId || ''
    };
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
  
  if (!valuationId) {
    return (
      <MainLayout>
        <main className="py-8">
          <div className="container mx-auto px-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Missing Information</AlertTitle>
              <AlertDescription>
                No valuation ID or VIN was provided in the URL. Please check the link and try again.
              </AlertDescription>
            </Alert>
          </div>
        </main>
      </MainLayout>
    );
  }
  
  if (error) {
    return (
      <MainLayout>
        <main className="py-8">
          <div className="container mx-auto px-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          </div>
        </main>
      </MainLayout>
    );
  }
  
  if (!data) {
    return (
      <MainLayout>
        <main className="py-8">
          <div className="container mx-auto px-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Data Found</AlertTitle>
              <AlertDescription>
                The valuation data could not be found for ID/VIN: {valuationId}
              </AlertDescription>
            </Alert>
          </div>
        </main>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <main className="py-8">
        <div className="container mx-auto px-4">
          <ValuationResultPremium
            valuationId={valuationId}
            data={convertToValuationResponse(data)}
            isPremium={hasPremiumAccess}
            onUpgrade={handleUpgrade}
          />
        </div>
      </main>
    </MainLayout>
  );
}
