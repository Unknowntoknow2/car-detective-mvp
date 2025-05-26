
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Car, DollarSign, MapPin } from 'lucide-react';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { decodeVin } from '@/services/vinService';

export default function ValuationPage() {
  const { vin } = useParams<{ vin: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<DecodedVehicleInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVehicleData = async () => {
      if (!vin) {
        setError('No VIN provided');
        setIsLoading(false);
        return;
      }

      try {
        // First try to get from localStorage
        const storedData = localStorage.getItem('current_vehicle_data');
        const storedVin = localStorage.getItem('current_vin');
        
        if (storedData && storedVin === vin) {
          console.log('Loading vehicle data from localStorage');
          setVehicle(JSON.parse(storedData));
          setIsLoading(false);
          return;
        }

        // If not in localStorage, fetch from service
        console.log('Fetching vehicle data for VIN:', vin);
        const result = await decodeVin(vin);
        
        if (result.success && result.data) {
          setVehicle(result.data);
          // Store for future use
          localStorage.setItem('current_vin', vin);
          localStorage.setItem('current_vehicle_data', JSON.stringify(result.data));
        } else {
          setError(result.error || 'Vehicle not found');
        }
      } catch (err: any) {
        console.error('Error loading vehicle data:', err);
        setError(err.message || 'Failed to load vehicle data');
      } finally {
        setIsLoading(false);
      }
    };

    loadVehicleData();
  }, [vin]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vehicle information...</p>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <Car className="h-12 w-12 mx-auto mb-2" />
              <p className="font-semibold">Vehicle Not Found</p>
            </div>
            <p className="text-gray-600 mb-4">{error || 'Unable to find vehicle information for this VIN'}</p>
            <div className="space-y-2">
              <Button onClick={() => navigate('/')} className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Try Another VIN
              </Button>
              <Button variant="outline" onClick={() => window.history.back()} className="w-full">
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate('/')} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vehicle Valuation</h1>
            <p className="text-gray-600">VIN: {vin}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Car className="h-5 w-5 mr-2" />
                Vehicle Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Year:</span>
                  <span className="font-semibold">{vehicle.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Make:</span>
                  <span className="font-semibold">{vehicle.make}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Model:</span>
                  <span className="font-semibold">{vehicle.model}</span>
                </div>
                {vehicle.trim && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trim:</span>
                    <span className="font-semibold">{vehicle.trim}</span>
                  </div>
                )}
                {vehicle.engine && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Engine:</span>
                    <span className="font-semibold">{vehicle.engine}</span>
                  </div>
                )}
                {vehicle.transmission && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transmission:</span>
                    <span className="font-semibold">{vehicle.transmission}</span>
                  </div>
                )}
                {vehicle.mileage && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mileage:</span>
                    <span className="font-semibold">{vehicle.mileage.toLocaleString()} miles</span>
                  </div>
                )}
                {vehicle.condition && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Condition:</span>
                    <span className="font-semibold capitalize">{vehicle.condition}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Estimated Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  ${vehicle.estimatedValue?.toLocaleString() || 'N/A'}
                </div>
                {vehicle.confidenceScore && (
                  <div className="text-sm text-gray-600 mb-4">
                    Confidence Score: {vehicle.confidenceScore}%
                  </div>
                )}
                <div className="space-y-2">
                  <Button className="w-full">
                    Get Detailed Report
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MapPin className="h-4 w-4 mr-2" />
                    Find Local Dealers
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold text-blue-900 mb-2">
              Want a More Accurate Valuation?
            </h3>
            <p className="text-blue-700 mb-4">
              Get enhanced accuracy by providing additional details about your vehicle's condition, maintenance history, and more.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Start Enhanced Valuation
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
