
import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VehicleFoundCard } from '@/components/valuation/VehicleFoundCard';
import { FollowUpForm } from '@/components/followup/FollowUpForm';
import { CarFinderQaherHeader } from '@/components/common/CarFinderQaherHeader';
import { Container } from '@/components/ui/container';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, RotateCcw } from 'lucide-react';
import { ServiceStatus } from '@/components/common/ServiceStatus';
import { decodeVin, retryDecode } from '@/services/vehicleDecodeService';
import { VehicleDecodeResponse } from '@/types/vehicle-decode';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function ValuationPage() {
  const { vin } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [vehicle, setVehicle] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [decodeResponse, setDecodeResponse] = useState<VehicleDecodeResponse | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!vin) {
      setError('No VIN provided');
      setLoading(false);
      return;
    }

    fetchVehicleData();
  }, [vin]);

  const fetchVehicleData = async () => {
    if (!vin) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // First try to get from decoded_vehicles table
      const { data: existingData, error: dbError } = await supabase
        .from('decoded_vehicles')
        .select('*')
        .eq('vin', vin)
        .single();
      
      if (existingData) {
        console.log('✅ Found existing vehicle data');
        setVehicle(existingData);
        setLoading(false);
        return;
      }

      // If not found, try to decode
      console.log('🔍 Vehicle not found in DB, attempting decode');
      const response = await decodeVin(vin);
      setDecodeResponse(response);
      
      if (response.success && response.decoded) {
        setVehicle(response.decoded);
        toast.success(`Vehicle decoded via ${response.source.toUpperCase()}`);
      } else {
        setError(response.error || 'Unable to decode VIN');
        console.error('❌ Decode failed:', response.error);
      }
    } catch (err) {
      console.error('❌ Unexpected error:', err);
      setError('An unexpected error occurred while loading vehicle data');
    } finally {
      setLoading(false);
    }
  };

  const handleRetryDecode = async () => {
    if (!vin) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await retryDecode(vin, retryCount);
      setDecodeResponse(response);
      setRetryCount(prev => prev + 1);
      
      if (response.success && response.decoded) {
        setVehicle(response.decoded);
        toast.success('Vehicle decoded successfully!');
      } else {
        setError(response.error || 'Unable to decode VIN');
        toast.error('Decode failed - consider manual entry');
      }
    } catch (error) {
      console.error('Retry failed:', error);
      setError('Retry failed. Please try manual entry.');
      toast.error('Retry failed');
    } finally {
      setLoading(false);
    }
  };

  const handleManualEntry = () => {
    navigate('/valuation', { state: { prefillVin: vin } });
  };

  if (loading) {
    return (
      <Container className="max-w-4xl py-10">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading vehicle data...</span>
        </div>
      </Container>
    );
  }

  if (error || !vehicle) {
    const isDecodeError = decodeResponse && !decodeResponse.success;
    const canRetry = isDecodeError && retryCount < 2;
    const shouldShowManualEntry = retryCount >= 1 || (decodeResponse && decodeResponse.source === 'failed');

    return (
      <Container className="max-w-4xl py-10">
        <ServiceStatus className="mb-6" />
        
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p>{error || 'Vehicle not found. We couldn\'t decode this VIN.'}</p>
              {isDecodeError && (
                <p className="text-sm">
                  Source attempted: {decodeResponse.source.toUpperCase()}
                </p>
              )}
            </div>
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          {canRetry && (
            <Button 
              onClick={handleRetryDecode}
              variant="outline"
              className="w-full"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Retry VIN Decode
            </Button>
          )}

          {shouldShowManualEntry && (
            <div className="text-center space-y-4">
              <div className="text-muted-foreground">
                Having trouble with VIN decode? Try manual entry instead.
              </div>
              <Button 
                onClick={handleManualEntry}
                className="w-full"
              >
                Continue with Manual Entry
              </Button>
            </div>
          )}

          <Button 
            variant="outline"
            onClick={() => navigate('/valuation')}
            className="w-full"
          >
            Start New Search
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="max-w-4xl py-10">
      <div className="space-y-8">
        <ServiceStatus />
        <CarFinderQaherHeader />
        
        {decodeResponse && decodeResponse.success && (
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">
              ✅ Vehicle successfully decoded via {decodeResponse.source.toUpperCase()}
            </AlertDescription>
          </Alert>
        )}
        
        <VehicleFoundCard vehicle={vehicle} />
        <FollowUpForm vin={vin!} />
      </div>
    </Container>
  );
}
