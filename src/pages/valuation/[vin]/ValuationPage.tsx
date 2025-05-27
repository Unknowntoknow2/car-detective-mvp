import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { ValuationResult } from '@/components/valuation/ValuationResult';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ValuationResponse } from '@/types/valuation';
import { ValuationAdjustment } from '@/types/adjustments';

interface ValuationPageProps {
  // No props needed
}

export default function ValuationPage() {
  const { vin } = useParams<{ vin: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ValuationResponse | null>(null);
  const [isPremium, setIsPremium] = useState(false);

  // Check if valuation has premium access
  const checkPremiumAccess = async (valuationId: string) => {
    if (!user) return false;
    
    try {
      const { data: premiumData, error } = await supabase
        .from('premium_valuations')
        .select('*')
        .eq('user_id', user.id)
        .eq('valuation_id', valuationId)
        .single();
      
      return !error && premiumData;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const fetchValuation = async () => {
      if (!vin) {
        setError('No VIN provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Query the valuations table
        const { data: valuationData, error: valuationError } = await supabase
          .from('valuations')
          .select('*')
          .eq('vin', vin)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (valuationError) {
          throw new Error(`Failed to fetch valuation: ${valuationError.message}`);
        }

        if (!valuationData) {
          throw new Error('No valuation found for this VIN');
        }

        // Check premium access
        const hasPremium = await checkPremiumAccess(valuationData.id);
        setIsPremium(hasPremium);

        // Transform the data to match our interface
        const transformedData: ValuationResponse = {
          success: true,
          data: {
            id: valuationData.id,
            vin: valuationData.vin,
            year: valuationData.year,
            make: valuationData.make,
            model: valuationData.model,
            bodyType: valuationData.body_type,
            fuelType: valuationData.fuel_type,
            transmission: valuationData.transmission,
            color: valuationData.color,
            mileage: valuationData.mileage,
            zipCode: valuationData.state,
            estimatedValue: valuationData.estimated_value,
            confidenceScore: valuationData.confidence_score,
            basePrice: valuationData.base_price,
            created_at: valuationData.created_at,
            isPremium: hasPremium
          }
        };

        setData(transformedData);
      } catch (err) {
        console.error('Error fetching valuation:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchValuation();
  }, [vin, user]);

  const handleUpgrade = () => {
    navigate('/premium');
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading valuation results...</p>
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
          <Card className="p-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => navigate('/')} variant="outline">
                Return Home
              </Button>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (!data?.data) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <Card className="p-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-600 mb-4">No Data</h1>
              <p className="text-gray-600 mb-4">No valuation data found for this VIN.</p>
              <Button onClick={() => navigate('/')} variant="outline">
                Return Home
              </Button>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {data.data.year} {data.data.make} {data.data.model}
          </h1>
          <p className="text-gray-600">VIN: {vin}</p>
        </div>

        <div className="grid gap-6">
          <Card className="p-6">
            <ValuationResult vin={vin!} />
          </Card>

          {!isPremium && (
            <Card className="p-6 border-amber-200 bg-amber-50">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Unlock Premium Features</h3>
                <p className="text-gray-600 mb-4">
                  Get detailed market analysis, CARFAX report, and more insights.
                </p>
                <Button onClick={handleUpgrade} className="bg-amber-600 hover:bg-amber-700">
                  Upgrade to Premium
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
