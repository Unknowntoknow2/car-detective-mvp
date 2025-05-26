
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VehicleFoundCard } from '@/components/valuation/VehicleFoundCard';
import { FollowUpForm } from '@/components/followup/FollowUpForm';
import { CarFinderQaherHeader } from '@/components/common/CarFinderQaherHeader';
import { Container } from '@/components/ui/container';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { ServiceStatus } from '@/components/common/ServiceStatus';

export default function ValuationPage() {
  const { vin } = useParams();
  const [vehicle, setVehicle] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!vin) {
      setError('No VIN provided');
      setLoading(false);
      return;
    }

    const fetchVehicle = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('decoded_vehicles')
          .select('*')
          .eq('vin', vin)
          .single();
        
        if (error) {
          console.error('Error fetching vehicle:', error);
          setError('Vehicle not found in our database');
        } else {
          setVehicle(data);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [vin]);

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
    return (
      <Container className="max-w-4xl py-10">
        <ServiceStatus className="mb-6" />
        <Alert variant="destructive">
          <AlertDescription>
            {error || 'Vehicle not found. Please try again or contact support.'}
          </AlertDescription>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="max-w-4xl py-10">
      <div className="space-y-8">
        <ServiceStatus />
        <CarFinderQaherHeader />
        <VehicleFoundCard vehicle={vehicle} />
        <FollowUpForm vin={vin!} />
      </div>
    </Container>
  );
}
