
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Car, Database } from 'lucide-react';
import { decodeVin } from '@/services/vinService';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { toast } from 'sonner';

export default function ValuationPage() {
  const { vin } = useParams<{ vin: string }>();
  const navigate = useNavigate();
  const [vehicleData, setVehicleData] = useState<DecodedVehicleInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('ValuationPage: Mounted with VIN:', vin);
    
    if (vin) {
      loadVehicleData(vin);
    } else {
      // Check localStorage for existing data
      const storedVin = localStorage.getItem('current_vin');
      const storedData = localStorage.getItem('current_vehicle_data');
      
      if (storedVin && storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setVehicleData(parsedData);
          console.log('ValuationPage: Loaded from localStorage:', parsedData);
        } catch (e) {
          console.error('ValuationPage: Failed to parse stored data');
          navigate('/');
        }
      } else {
        navigate('/');
      }
    }
  }, [vin, navigate]);

  const loadVehicleData = async (vinNumber: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('ValuationPage: Loading vehicle data for VIN:', vinNumber);
      const result = await decodeVin(vinNumber);
      
      if (result.success && result.data) {
        setVehicleData(result.data);
        // Update localStorage
        localStorage.setItem('current_vin', vinNumber);
        localStorage.setItem('current_vehicle_data', JSON.stringify(result.data));
        console.log('ValuationPage: Successfully loaded vehicle data:', result.data);
      } else {
        setError(result.error || 'Failed to load vehicle data');
        toast.error(result.error || 'Failed to load vehicle data');
      }
    } catch (error: any) {
      console.error('ValuationPage: Error loading vehicle data:', error);
      setError('Failed to connect to vehicle database');
      toast.error('Failed to connect to vehicle database');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Container className="max-w-4xl py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-lg">Loading vehicle data from NHTSA database...</p>
            <p className="text-sm text-muted-foreground">VIN: {vin}</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="max-w-4xl py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Vehicle Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="flex gap-2">
              <Button onClick={() => navigate('/')} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              {vin && (
                <Button onClick={() => loadVehicleData(vin)}>
                  Try Again
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (!vehicleData) {
    return (
      <Container className="max-w-4xl py-10">
        <Card>
          <CardHeader>
            <CardTitle>No Vehicle Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">No vehicle data available.</p>
            <Button onClick={() => navigate('/')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="max-w-4xl py-10">
      <div className="mb-6">
        <Button onClick={() => navigate('/')} variant="outline" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        
        <div className="flex items-center mb-2">
          <Car className="h-6 w-6 mr-2" />
          <h1 className="text-3xl font-bold">
            {vehicleData.year} {vehicleData.make} {vehicleData.model}
          </h1>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Database className="h-4 w-4 mr-1" />
          Data from NHTSA vPIC Database
        </div>
      </div>

      <div className="grid gap-6">
        {/* Vehicle Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">VIN</label>
                <p className="font-mono text-sm">{vehicleData.vin}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Year</label>
                <p>{vehicleData.year}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Make</label>
                <p>{vehicleData.make}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Model</label>
                <p>{vehicleData.model}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Trim</label>
                <p>{vehicleData.trim || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Body Type</label>
                <p>{vehicleData.bodyType || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Engine</label>
                <p>{vehicleData.engine || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Transmission</label>
                <p>{vehicleData.transmission || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Fuel Type</label>
                <p>{vehicleData.fuelType || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Drivetrain</label>
                <p>{vehicleData.drivetrain || 'Not specified'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Valuation Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Estimated Valuation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Estimated Value</label>
                <p className="text-2xl font-bold text-green-600">
                  ${vehicleData.estimatedValue?.toLocaleString() || 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Confidence Score</label>
                <p className="text-lg">{vehicleData.confidenceScore || 'N/A'}%</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Estimated Mileage</label>
                <p>{vehicleData.mileage?.toLocaleString() || 'N/A'} miles</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Condition</label>
                <p>{vehicleData.condition || 'Good'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
