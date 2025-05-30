
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/ui/loading-button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Car, AlertCircle, CheckCircle } from 'lucide-react';
import { TabbedFollowUpForm } from '@/components/followup/TabbedFollowUpForm';
import { useVehicleLookup } from '@/hooks/useVehicleLookup';
import { useValuation } from '@/hooks/useValuation';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { validateVIN } from '@/utils/validation/vin-validation';

export default function ValuationPage() {
  const { vin } = useParams<{ vin: string }>();
  const { lookupByVin, isLoading: vinLoading, error: vinError, vehicleData } = useVehicleLookup();
  const { saveValuation, isLoading: valuationLoading } = useValuation();
  
  const [followUpData, setFollowUpData] = useState<FollowUpAnswers>({
    vin: vin || '',
    zip_code: '',
    mileage: undefined,
    condition: undefined,
    transmission: undefined,
  });

  const [hasLookedUp, setHasLookedUp] = useState(false);

  useEffect(() => {
    if (vin && validateVIN(vin).isValid && !hasLookedUp) {
      handleVinLookup();
    }
  }, [vin]);

  const handleVinLookup = async () => {
    if (!vin) return;
    
    try {
      await lookupByVin(vin);
      setHasLookedUp(true);
    } catch (error) {
      console.error('VIN lookup failed:', error);
    }
  };

  const updateFollowUpData = (updates: Partial<FollowUpAnswers>) => {
    setFollowUpData(prev => {
      // Ensure transmission values match the expected literal types
      const updatedData = { ...prev, ...updates };
      if (updates.transmission !== undefined) {
        // Validate transmission value
        const validTransmissions: Array<'automatic' | 'manual' | 'unknown'> = ['automatic', 'manual', 'unknown'];
        if (typeof updates.transmission === 'string' && !validTransmissions.includes(updates.transmission as any)) {
          updatedData.transmission = 'unknown';
        }
      }
      return updatedData;
    });
  };

  const handleSubmitValuation = async () => {
    try {
      const valuationData = {
        vin: followUpData.vin,
        make: vehicleData?.make || 'Unknown',
        model: vehicleData?.model || 'Unknown',
        year: vehicleData?.year || new Date().getFullYear(),
        mileage: followUpData.mileage || 0,
        condition: followUpData.condition || 'good',
        zip_code: followUpData.zip_code,
        transmission: followUpData.transmission,
        follow_up_answers: followUpData
      };

      await saveValuation(valuationData);
      console.log('Valuation submitted successfully');
    } catch (error) {
      console.error('Failed to submit valuation:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Vehicle Valuation
          </h1>
          <p className="text-gray-600">
            Get an accurate valuation for your vehicle
          </p>
        </div>

        {/* VIN Display and Status */}
        {vin && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                VIN: {vin}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {vehicleData ? (
                    <>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Vehicle Found
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {vehicleData.year} {vehicleData.make} {vehicleData.model}
                        {vehicleData.trim && ` ${vehicleData.trim}`}
                      </span>
                    </>
                  ) : vinError ? (
                    <Badge variant="destructive">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Lookup Failed
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      Ready for Lookup
                    </Badge>
                  )}
                </div>
                
                {!hasLookedUp && (
                  <LoadingButton
                    onClick={handleVinLookup}
                    isLoading={vinLoading}
                    loadingText="Looking up..."
                  >
                    Lookup VIN
                  </LoadingButton>
                )}
              </div>
              
              {vinError && (
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {vinError}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Follow-up Form */}
        <TabbedFollowUpForm
          formData={followUpData}
          updateFormData={updateFollowUpData}
          onSubmit={handleSubmitValuation}
          isLoading={valuationLoading}
        />
      </div>
    </div>
  );
}
