
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Car, AlertCircle, CheckCircle } from 'lucide-react';
import { lookupVin } from '@/services/vehicleService';
import { useAuth } from '@/hooks/useAuth';
import { ValuationResult } from '@/components/valuation/ValuationResult';
import { toast } from 'sonner';

interface VehicleData {
  year: number;
  make: string;
  model: string;
  trim?: string;
  engine?: string;
  transmission?: string;
  fuelType?: string;
  drivetrain?: string;
}

interface ValuationResponse {
  estimatedValue: number;
  confidenceScore: number;
  make: string;
  model: string;
  year: number;
  condition: string;
}

interface ValuationAdjustment {
  factor: string;
  impact: number;
  description?: string;
}

type ConditionType = 'excellent' | 'good' | 'fair' | 'poor';

const ValuationPage: React.FC = () => {
  const { vin } = useParams<{ vin: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [mileage, setMileage] = useState<string>('');
  const [condition, setCondition] = useState<ConditionType>('good');
  const [zipCode, setZipCode] = useState<string>('');
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [isValuating, setIsValuating] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [valuationResult, setValuationResult] = useState<ValuationResponse | null>(null);
  const [showValuation, setShowValuation] = useState(false);

  // Perform VIN lookup on component mount
  useEffect(() => {
    if (vin && vin.length === 17) {
      performVinLookup();
    } else {
      setLookupError('Invalid VIN provided');
    }
  }, [vin]);

  const performVinLookup = async () => {
    if (!vin) return;
    
    setIsLookingUp(true);
    setLookupError(null);
    
    try {
      const result = await lookupVin(vin);
      setVehicleData({
        year: result.year || 0,
        make: result.make || '',
        model: result.model || '',
        trim: result.trim,
        engine: result.engine,
        transmission: result.transmission,
        fuelType: result.fuelType,
        drivetrain: result.drivetrain
      });
      toast.success('Vehicle information retrieved successfully');
    } catch (error) {
      console.error('VIN lookup failed:', error);
      setLookupError(error instanceof Error ? error.message : 'Failed to lookup VIN');
      toast.error('Failed to lookup VIN information');
    } finally {
      setIsLookingUp(false);
    }
  };

  const calculateValuation = async () => {
    if (!vehicleData || !mileage || !zipCode) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsValuating(true);
    
    try {
      // Mock valuation calculation
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      const baseValue = getBaseValue(vehicleData.year, vehicleData.make, vehicleData.model);
      const mileageAdjustment = getMileageAdjustment(parseInt(mileage), vehicleData.year);
      const conditionMultipliers: Record<ConditionType, number> = {
        excellent: 1.15,
        good: 1.0,
        fair: 0.85,
        poor: 0.7
      };
      
      const conditionMultiplier = conditionMultipliers[condition];
      const estimatedValue = Math.round((baseValue + mileageAdjustment) * conditionMultiplier);
      
      const result: ValuationResponse = {
        estimatedValue,
        confidenceScore: 85,
        make: vehicleData.make,
        model: vehicleData.model,
        year: vehicleData.year,
        condition
      };
      
      setValuationResult(result);
      setShowValuation(true);
      toast.success('Valuation completed successfully');
    } catch (error) {
      console.error('Valuation failed:', error);
      toast.error('Failed to calculate valuation');
    } finally {
      setIsValuating(false);
    }
  };

  const getBaseValue = (year: number, make: string, model: string): number => {
    // Mock base value calculation
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;
    const baseValue = Math.max(5000, 35000 - (age * 2500));
    
    // Adjust for make/model popularity
    const popularMakes = ['toyota', 'honda', 'nissan'];
    const luxuryMakes = ['bmw', 'mercedes', 'audi', 'lexus'];
    
    if (luxuryMakes.includes(make.toLowerCase())) {
      return baseValue * 1.4;
    } else if (popularMakes.includes(make.toLowerCase())) {
      return baseValue * 1.1;
    }
    
    return baseValue;
  };

  const getMileageAdjustment = (mileage: number, year: number): number => {
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;
    const expectedMileage = age * 12000; // 12k miles per year average
    const mileageDifference = expectedMileage - mileage;
    
    // $0.10 per mile difference
    return mileageDifference * 0.10;
  };

  if (showValuation && valuationResult) {
    const valuationData = {
      ...valuationResult,
      basePrice: Math.round(valuationResult.estimatedValue * 0.9),
      adjustments: [
        {
          factor: 'Mileage Adjustment',
          impact: getMileageAdjustment(parseInt(mileage), vehicleData?.year || 0),
          description: 'Based on vehicle mileage compared to average'
        },
        {
          factor: 'Condition Assessment',
          impact: Math.round(valuationResult.estimatedValue * 0.1),
          description: `Vehicle rated as ${condition} condition`
        }
      ] as ValuationAdjustment[]
    };

    return (
      <div className="container mx-auto py-8 px-4">
        <ValuationResult data={valuationData} />
        <div className="mt-6 text-center">
          <Button 
            variant="outline" 
            onClick={() => setShowValuation(false)}
            className="mr-4"
          >
            Edit Details
          </Button>
          <Button onClick={() => navigate('/valuation')}>
            New Valuation
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Vehicle Valuation</h1>
        <p className="text-muted-foreground">
          VIN: {vin}
        </p>
      </div>

      {/* VIN Lookup Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Vehicle Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLookingUp && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Looking up vehicle information...
            </div>
          )}
          
          {lookupError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{lookupError}</AlertDescription>
            </Alert>
          )}
          
          {vehicleData && !isLookingUp && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-600 mb-4">
                <CheckCircle className="h-4 w-4" />
                Vehicle information found
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Year</Label>
                  <p className="font-semibold">{vehicleData.year}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Make</Label>
                  <p className="font-semibold">{vehicleData.make}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Model</Label>
                  <p className="font-semibold">{vehicleData.model}</p>
                </div>
                {vehicleData.trim && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Trim</Label>
                    <p className="font-semibold">{vehicleData.trim}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Valuation Form */}
      {vehicleData && !lookupError && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="mileage">Current Mileage *</Label>
              <Input
                id="mileage"
                type="number"
                placeholder="Enter mileage"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="condition">Vehicle Condition *</Label>
              <select
                id="condition"
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
                value={condition}
                onChange={(e) => setCondition(e.target.value as ConditionType)}
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                type="text"
                placeholder="Enter ZIP code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                maxLength={5}
              />
            </div>
            
            <Button 
              onClick={calculateValuation}
              disabled={isValuating || !mileage || !zipCode}
              className="w-full"
            >
              {isValuating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isValuating ? 'Calculating...' : 'Get Valuation'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ValuationPage;
