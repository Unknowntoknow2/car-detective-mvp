
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Car, AlertCircle } from 'lucide-react';
import { validateVIN } from '@/utils/validation/vin-validation';
import { VehicleFoundCard } from '@/components/valuation/VehicleFoundCard';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UnifiedVinLookupProps {
  onSubmit?: (vin: string) => void;
  showHeader?: boolean;
  className?: string;
}

export function UnifiedVinLookup({ 
  onSubmit, 
  showHeader = true, 
  className = "" 
}: UnifiedVinLookupProps) {
  const [vin, setVin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vehicleData, setVehicleData] = useState<any>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '');
    if (value.length <= 17) {
      setVin(value);
      setError(null);
    }
  };

  const handleLookup = async () => {
    const validation = validateVIN(vin);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid VIN format');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First check if vehicle already exists in decoded_vehicles
      const { data: existingVehicle } = await supabase
        .from('decoded_vehicles')
        .select('*')
        .eq('vin', vin)
        .single();

      if (existingVehicle) {
        // Vehicle already exists, navigate to valuation page
        navigate(`/valuation/${vin}`);
        return;
      }

      // Call the NHTSA vPIC edge function to decode new VIN
      const { data: result, error: apiError } = await supabase.functions.invoke('fetch_vpic_data', {
        body: { vin }
      });

      if (apiError) {
        throw new Error(apiError.message || 'Failed to decode VIN');
      }

      if (!result?.data) {
        throw new Error('No vehicle data found for this VIN');
      }

      // Save decoded vehicle data to database
      const decodedVehicleData = {
        vin: result.data.vin,
        year: result.data.modelYear ? parseInt(result.data.modelYear) : null,
        make: result.data.make,
        model: result.data.model,
        trim: result.data.trim || result.data.series,
        engine: result.data.engineSize ? `${result.data.engineSize}L` : null,
        transmission: result.data.transmissionStyle,
        bodytype: result.data.bodyClass,
        fueltype: result.data.fuelType,
        drivetrain: result.data.driveType,
        doors: result.data.doors ? parseInt(result.data.doors) : null,
        seats: result.data.seats ? parseInt(result.data.seats) : null,
        displacementl: result.data.displacementL,
        enginecylinders: result.data.engineCylinders
      };

      const { data: savedVehicle, error: saveError } = await supabase
        .from('decoded_vehicles')
        .insert(decodedVehicleData)
        .select()
        .single();

      if (saveError) {
        console.error('Error saving vehicle data:', saveError);
        throw new Error('Failed to save vehicle data');
      }

      // Create car finder session if user is authenticated
      if (user) {
        await supabase.from('car_finder_sessions').insert({
          vin,
          user_id: user.id,
          status: 'decoded',
          decoded_vehicle_id: savedVehicle.id
        });
      }

      // Navigate to the valuation page
      navigate(`/valuation/${vin}`);
      
      if (onSubmit) {
        onSubmit(vin);
      }

    } catch (err: any) {
      console.error('VIN lookup error:', err);
      setError(err.message || 'Failed to decode VIN: Edge Function returned a non-2xx status code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLookup();
  };

  return (
    <div className={className}>
      {showHeader && (
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">VIN Lookup (NHTSA Database)</h1>
          <p className="text-muted-foreground">
            Enter your 17-character VIN to get detailed vehicle information
          </p>
        </div>
      )}

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Vehicle Identification Number (VIN)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Enter 17-character VIN"
                value={vin}
                onChange={handleVinChange}
                maxLength={17}
                className={`font-mono text-center ${error ? 'border-red-500' : ''}`}
              />
              <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                <span>Find your VIN on your dashboard, driver's side door, or vehicle registration</span>
                <span className={vin.length === 17 ? 'text-green-600' : ''}>
                  {vin.length}/17 characters
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                VIN format: letters and numbers only (no I, O, Q)
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              disabled={isLoading || vin.length !== 17}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Decoding VIN...
                </>
              ) : (
                'Decode VIN'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {vehicleData && (
        <div className="mt-8">
          <VehicleFoundCard vehicle={vehicleData} />
        </div>
      )}
    </div>
  );
}
