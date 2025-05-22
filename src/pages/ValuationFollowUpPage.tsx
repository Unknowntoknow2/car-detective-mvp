
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import FollowUpForm from '@/components/followup/FollowUpForm';
import { useVinDecoder } from '@/hooks/useVinDecoder';
import { toast } from 'sonner';

const ValuationFollowUpPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const vin = searchParams.get('vin');
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleInfo, setVehicleInfo] = useState<any>(null);
  const { result, lookupVin, isLoading: decoderLoading, error } = useVinDecoder();

  useEffect(() => {
    if (vin) {
      // Load basic vehicle info if available
      const storedData = localStorage.getItem(`vin_lookup_${vin}`);
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setVehicleInfo(parsedData);
        } catch (e) {
          console.error('Error parsing stored vehicle data:', e);
        }
      } else {
        // If not found in localStorage, fetch it
        lookupVin(vin);
      }
    }
  }, [vin, lookupVin]);

  useEffect(() => {
    if (result && !vehicleInfo) {
      setVehicleInfo(result);
    }
  }, [result, vehicleInfo]);

  const handleSubmit = (followUpData: any) => {
    setIsLoading(true);

    // Combine basic vehicle info with follow-up answers
    const baseVehicleData = vehicleInfo || result || {};
    const combinedData = {
      ...baseVehicleData,
      ...followUpData,
      vin: vin,
      // Set default values if not provided
      mileage: followUpData.mileage || 35000,
      condition: followUpData.condition || 'Good',
      zipCode: followUpData.zipCode || '90210',
    };

    // Store the complete data for the result page
    localStorage.setItem(`vin_lookup_${vin}`, JSON.stringify(combinedData));
    
    // Simulate processing time
    setTimeout(() => {
      setIsLoading(false);
      navigate(`/valuation-result?vin=${vin}`);
    }, 1500);
  };

  if (decoderLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-lg">Retrieving vehicle information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-destructive">Error Retrieving Vehicle Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
          <Button 
            onClick={() => navigate('/lookup')} 
            className="mt-4"
          >
            Try Another VIN
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container max-w-3xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Additional Vehicle Details</CardTitle>
          {vehicleInfo && (
            <p className="text-muted-foreground">
              {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
            </p>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Processing your valuation...</p>
            </div>
          ) : (
            <FollowUpForm 
              onSubmit={handleSubmit} 
              initialData={vehicleInfo || {}}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ValuationFollowUpPage;
