
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { ValuationResult } from '@/types/valuation';
import { MainLayout } from '@/components/layout/MainLayout';
import FoundCarCard from '@/components/lookup/found/FoundCarCard';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { DecodedVehicleInfo } from '@/types/vehicle';

export default function ValuationResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [valuation, setValuation] = useState<ValuationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [followUpComplete, setFollowUpComplete] = useState(false);
  const [hasAccident, setHasAccident] = useState<boolean | null>(null);

  useEffect(() => {
    async function loadValuation() {
      if (!id) {
        setError('No valuation ID provided');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('valuations')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        setValuation(data as ValuationResult);
        setFollowUpComplete(data?.accident_count !== undefined);
      } catch (err: any) {
        console.error('Error loading valuation:', err);
        setError(err.message || 'Failed to load valuation data');
      } finally {
        setLoading(false);
      }
    }

    loadValuation();
  }, [id]);

  const handleAccidentResponse = async (hasBeenInAccident: boolean) => {
    if (!id) return;
    
    setHasAccident(hasBeenInAccident);
    
    try {
      const accidentCount = hasBeenInAccident ? 1 : 0;
      const { error } = await supabase
        .from('valuations')
        .update({ 
          accident_count: accidentCount
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setFollowUpComplete(true);
      
      toast({
        title: "Information Updated",
        description: "Thank you for providing additional information.",
        variant: "success",
      });
    } catch (err: any) {
      console.error('Error updating accident information:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to update information",
        variant: "destructive",
      });
    }
  };

  // Convert valuation to DecodedVehicleInfo for FoundCarCard
  const mapValuationToVehicleInfo = (valuation: ValuationResult): DecodedVehicleInfo => {
    return {
      vin: valuation.vin || '',
      year: valuation.year || 0,
      make: valuation.make || '',
      model: valuation.model || '',
      trim: valuation.trim || '',
      bodyType: valuation.bodyType || valuation.body_type,
      fuelType: valuation.fuelType || valuation.fuel_type,
      transmission: valuation.transmission || '',
      color: valuation.color || '',
    };
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (error || !valuation) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Valuation</h2>
          <p className="text-muted-foreground mb-6">{error || 'Valuation not found'}</p>
          <Button onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Vehicle Valuation Result</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Vehicle Details</CardTitle>
          </CardHeader>
          <CardContent>
            <FoundCarCard vehicle={mapValuationToVehicleInfo(valuation)} />
          </CardContent>
        </Card>

        {!followUpComplete && (
          <Card className="border border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-xl">Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Has this vehicle been in an accident?</p>
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => handleAccidentResponse(true)}
                  className="bg-white hover:bg-gray-100"
                >
                  Yes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleAccidentResponse(false)}
                  className="bg-white hover:bg-gray-100"
                >
                  No
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {hasAccident === true && (
          <Card className="mt-6 border border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <p className="font-medium">
                Accident history typically reduces a vehicle's value by 10-30% depending on severity.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Estimated Value</h2>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <p className="text-4xl font-bold text-primary">
              ${valuation.estimatedValue?.toLocaleString() || valuation.estimated_value?.toLocaleString()}
            </p>
            <p className="text-muted-foreground mt-2">
              Based on the vehicle's condition, year, make, model, and other factors.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
