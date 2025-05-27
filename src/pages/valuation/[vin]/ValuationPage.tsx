
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { ValuationResult } from '@/components/valuation/ValuationResult';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { lookupVin } from '@/services/vehicleService';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@supabase/auth-helpers-react';

const ValuationPage = () => {
  const { vin } = useParams<{ vin: string }>();
  const navigate = useNavigate();
  const user = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [valuationData, setValuationData] = useState<any>(null);

  const fetchVinData = async () => {
    if (!vin) {
      setError('No VIN provided');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First try to look up the VIN
      const vehicleData = await lookupVin(vin);
      
      if (!vehicleData) {
        throw new Error('Vehicle not found for this VIN');
      }

      // Create a valuation based on the vehicle data
      const estimatedValue = calculateEstimatedValue(vehicleData);
      
      // Store the valuation in the database
      const { data: valuation, error: valuationError } = await supabase
        .from('valuations')
        .insert({
          vin: vin,
          make: vehicleData.make || 'Unknown',
          model: vehicleData.model || 'Unknown',
          year: vehicleData.year || new Date().getFullYear(),
          mileage: vehicleData.mileage || 0,
          condition: 'good',
          estimated_value: estimatedValue,
          confidence_score: 85,
          base_price: Math.round(estimatedValue * 0.9),
          is_vin_lookup: true,
          user_id: user?.id || null
        })
        .select()
        .single();

      if (valuationError) {
        console.error('Error saving valuation:', valuationError);
        throw new Error('Failed to save valuation');
      }

      // Create the response data with all required properties
      const responseData = {
        make: vehicleData.make || 'Unknown',
        model: vehicleData.model || 'Unknown',
        year: vehicleData.year || new Date().getFullYear(),
        mileage: vehicleData.mileage || 0,
        condition: 'good',
        estimatedValue: estimatedValue,
        confidenceScore: 85,
        basePrice: Math.round(estimatedValue * 0.9), // Add basePrice
        adjustments: [ // Add adjustments array
          {
            factor: 'VIN Decoded Data',
            impact: Math.round(estimatedValue * 0.1),
            description: 'Based on VIN decoded information'
          }
        ],
        valuationId: valuation.id,
        vin: vin,
        trim: vehicleData.trim,
        bodyType: vehicleData.bodyType,
        fuelType: vehicleData.fuelType,
        transmission: vehicleData.transmission,
        drivetrain: vehicleData.drivetrain,
        exteriorColor: vehicleData.exteriorColor,
        interiorColor: vehicleData.interiorColor,
        doors: vehicleData.doors,
        seats: vehicleData.seats,
        displacement: vehicleData.displacement,
        isPremium: false
      };

      setValuationData(responseData);
      toast.success('VIN lookup completed successfully!');

    } catch (error) {
      console.error('VIN lookup error:', error);
      setError(error instanceof Error ? error.message : 'Failed to lookup VIN');
      toast.error('Failed to lookup VIN');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateEstimatedValue = (vehicleData: any): number => {
    // Base calculation using year, make, model
    let baseValue = 20000; // Default base value
    
    // Adjust based on year (newer cars worth more)
    const currentYear = new Date().getFullYear();
    const age = currentYear - (vehicleData.year || currentYear);
    const yearMultiplier = Math.max(0.5, 1 - (age * 0.05)); // Depreciate 5% per year
    
    // Adjust based on mileage
    const mileage = vehicleData.mileage || 50000;
    const mileageMultiplier = Math.max(0.6, 1 - (mileage / 200000) * 0.4); // Up to 40% reduction for high mileage
    
    // Basic condition multipliers
    const conditionMultipliers: { [key: string]: number } = {
      excellent: 1.2,
      good: 1.0,
      fair: 0.8,
      poor: 0.6
    };
    
    const condition = 'good'; // Default condition
    const conditionMultiplier = conditionMultipliers[condition] || 1.0;
    
    // Calculate final value
    const estimatedValue = Math.round(baseValue * yearMultiplier * mileageMultiplier * conditionMultiplier);
    
    return Math.max(5000, estimatedValue); // Minimum value of $5,000
  };

  useEffect(() => {
    if (vin) {
      fetchVinData();
    }
  }, [vin]);

  const handleRetry = () => {
    fetchVinData();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (!vin) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No VIN provided in the URL
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-lg">Looking up VIN: {vin}</p>
            <p className="text-muted-foreground">This may take a few moments...</p>
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
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
            <div className="flex space-x-4">
              <Button onClick={handleRetry} variant="outline">
                Try Again
              </Button>
              <Button onClick={handleGoHome}>
                Go Home
              </Button>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (!valuationData) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No valuation data available
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">VIN Valuation Result</h1>
          <p className="text-muted-foreground">VIN: {vin}</p>
        </div>
        
        <Card className="p-6">
          <ValuationResult data={valuationData} />
        </Card>
      </div>
    </MainLayout>
  );
};

export default ValuationPage;
