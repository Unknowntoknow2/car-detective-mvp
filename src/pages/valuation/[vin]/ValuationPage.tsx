
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ValuationResult } from '@/components/valuation/ValuationResult';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Car, Calendar, Gauge, Wrench } from 'lucide-react';
import { lookupVin } from '@/services/vehicleService';
import { DecodedVehicleInfo, ValuationResponse } from '@/types/vehicle';
import { formatCurrency } from '@/utils/formatters';
import { useUser } from '@/hooks/useUser';

interface EnhancedVehicleCardProps {
  vehicle: DecodedVehicleInfo;
  onViewValuation: () => void;
}

const EnhancedVehicleCard: React.FC<EnhancedVehicleCardProps> = ({ 
  vehicle, 
  onViewValuation 
}) => {
  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-2 border-gray-200 hover:border-blue-300 transition-colors">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Car className="h-8 w-8 text-blue-600" />
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </CardTitle>
              {vehicle.trim && (
                <p className="text-lg text-gray-600 mt-1">{vehicle.trim}</p>
              )}
            </div>
          </div>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            VIN: {vehicle.vin?.slice(-6) || 'Unknown'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {vehicle.year && (
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Year</p>
                <p className="font-semibold">{vehicle.year}</p>
              </div>
            </div>
          )}
          
          {vehicle.mileage && (
            <div className="flex items-center space-x-3">
              <Gauge className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Mileage</p>
                <p className="font-semibold">{vehicle.mileage.toLocaleString()} miles</p>
              </div>
            </div>
          )}
          
          {vehicle.transmission && (
            <div className="flex items-center space-x-3">
              <Wrench className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Transmission</p>
                <p className="font-semibold">{vehicle.transmission}</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {vehicle.bodyType && (
            <div>
              <p className="text-sm text-gray-500">Body Type</p>
              <p className="font-medium">{vehicle.bodyType}</p>
            </div>
          )}
          
          {vehicle.fuelType && (
            <div>
              <p className="text-sm text-gray-500">Fuel Type</p>
              <p className="font-medium">{vehicle.fuelType}</p>
            </div>
          )}
          
          {vehicle.drivetrain && (
            <div>
              <p className="text-sm text-gray-500">Drivetrain</p>
              <p className="font-medium">{vehicle.drivetrain}</p>
            </div>
          )}
          
          {vehicle.exteriorColor && (
            <div>
              <p className="text-sm text-gray-500">Color</p>
              <p className="font-medium">{vehicle.exteriorColor}</p>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <Button 
            onClick={onViewValuation}
            size="lg"
            className="px-8 py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
          >
            Get Market Valuation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ValuationPage: React.FC = () => {
  const { vin } = useParams<{ vin: string }>();
  const [vehicle, setVehicle] = useState<DecodedVehicleInfo | null>(null);
  const [showValuation, setShowValuation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (vin) {
      handleVinLookup(vin);
    }
  }, [vin]);

  const handleVinLookup = async (vinValue: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const vehicleData = await lookupVin(vinValue);
      setVehicle(vehicleData);
    } catch (err) {
      console.error('VIN lookup failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to decode VIN');
    } finally {
      setLoading(false);
    }
  };

  const generateValuationData = (vehicleData: DecodedVehicleInfo): ValuationResponse & { isPremium?: boolean } => {
    if (!vehicleData) {
      throw new Error('Vehicle data is required');
    }

    // Define condition multipliers with proper typing
    const conditionMultipliers: Record<string, number> = {
      excellent: 1.1,
      good: 1.0,
      fair: 0.9,
      poor: 0.75
    };

    // Ensure condition is a valid key
    const condition = vehicleData.condition?.toLowerCase() || 'good';
    const validCondition = condition in conditionMultipliers ? condition : 'good';
    
    // Base pricing logic
    const currentYear = new Date().getFullYear();
    const age = currentYear - (vehicleData.year || currentYear);
    const baseValue = Math.max(5000, 25000 - (age * 1500));
    
    // Apply condition multiplier
    const conditionMultiplier = conditionMultipliers[validCondition];
    const estimatedValue = Math.round(baseValue * conditionMultiplier);
    
    // Calculate adjustments
    const adjustments = [
      {
        factor: `Vehicle Age (${age} years)`,
        impact: -(age * 1500),
        description: 'Depreciation based on vehicle age'
      },
      {
        factor: `${validCondition.charAt(0).toUpperCase() + validCondition.slice(1)} Condition`,
        impact: Math.round(baseValue * (conditionMultiplier - 1)),
        description: `Adjustment for ${validCondition} condition rating`
      }
    ];

    // Add mileage adjustment if available
    if (vehicleData.mileage) {
      const avgMileagePerYear = 12000;
      const expectedMileage = age * avgMileagePerYear;
      const mileageDiff = vehicleData.mileage - expectedMileage;
      const mileageAdjustment = Math.round(mileageDiff * -0.1);
      
      if (Math.abs(mileageAdjustment) > 100) {
        adjustments.push({
          factor: mileageDiff > 0 ? 'High Mileage' : 'Low Mileage',
          impact: mileageAdjustment,
          description: `${Math.abs(mileageDiff).toLocaleString()} miles ${mileageDiff > 0 ? 'above' : 'below'} average`
        });
      }
    }

    return {
      make: vehicleData.make || '',
      model: vehicleData.model || '',
      year: vehicleData.year || currentYear,
      condition: validCondition,
      estimatedValue,
      confidenceScore: 85,
      valuationId: `val_${Date.now()}`,
      basePrice: baseValue,
      adjustments,
      vin: vehicleData.vin,
      mileage: vehicleData.mileage,
      fuelType: vehicleData.fuelType,
      transmission: vehicleData.transmission,
      bodyType: vehicleData.bodyType,
      color: vehicleData.exteriorColor,
      trim: vehicleData.trim,
      userId: user?.id,
      isPremium: false
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Decoding VIN...</h2>
              <p className="text-gray-500">Please wait while we retrieve vehicle information</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center min-h-[60vh] flex items-center justify-center">
            <Card className="max-w-md mx-auto">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button 
                  onClick={() => vin && handleVinLookup(vin)}
                  variant="outline"
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center min-h-[60vh] flex items-center justify-center">
            <Card className="max-w-md mx-auto">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">No Vehicle Found</h2>
                <p className="text-gray-600">Unable to find vehicle information for this VIN.</p>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {!showValuation ? (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Vehicle Information
              </h1>
              <p className="text-lg text-gray-600">
                VIN: <span className="font-mono">{vin}</span>
              </p>
            </div>
            
            <EnhancedVehicleCard 
              vehicle={vehicle}
              onViewValuation={() => setShowValuation(true)}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">
                Market Valuation Results
              </h1>
              <Button 
                variant="outline" 
                onClick={() => setShowValuation(false)}
              >
                Back to Vehicle Details
              </Button>
            </div>
            
            <ValuationResult data={generateValuationData(vehicle)} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ValuationPage;
