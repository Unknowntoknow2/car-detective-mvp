
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Car, MapPin, Calendar, Gauge, ArrowRight } from 'lucide-react';
import { UnifiedVinLookup } from '@/components/lookup/UnifiedVinLookup';
import { decodeVin } from '@/services/vinService';
import { toast } from 'sonner';

export default function ValuationPage() {
  const { vin: urlVin } = useParams();
  const navigate = useNavigate();
  const [vehicleData, setVehicleData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'lookup' | 'details' | 'result'>('lookup');
  
  // Form data for follow-up
  const [mileage, setMileage] = useState('');
  const [condition, setCondition] = useState('');
  const [zipCode, setZipCode] = useState('');

  useEffect(() => {
    // If there's a VIN in the URL, try to decode it
    if (urlVin) {
      handleVinLookup(urlVin);
    } else {
      // Check localStorage for existing vehicle data
      const storedData = localStorage.getItem('current_vehicle_data');
      const storedVin = localStorage.getItem('current_vin');
      
      if (storedData && storedVin) {
        try {
          const data = JSON.parse(storedData);
          setVehicleData(data);
          setStep('details');
        } catch (error) {
          console.error('Error parsing stored vehicle data:', error);
        }
      }
    }
  }, [urlVin]);

  const handleVinLookup = async (vin: string) => {
    setLoading(true);
    try {
      const result = await decodeVin(vin);
      if (result.success && result.data) {
        setVehicleData(result.data);
        setStep('details');
        
        // Update URL to include VIN
        navigate(`/valuation/${vin}`, { replace: true });
      } else {
        toast.error('Vehicle not found');
      }
    } catch (error) {
      toast.error('Failed to lookup VIN');
    } finally {
      setLoading(false);
    }
  };

  const handleGetValuation = () => {
    if (!mileage || !condition || !zipCode) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Store complete valuation data
    const valuationData = {
      ...vehicleData,
      mileage: parseInt(mileage),
      condition,
      zipCode,
      estimatedValue: Math.floor(Math.random() * 20000) + 15000, // Mock calculation
      confidenceScore: 85,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('latest_valuation', JSON.stringify(valuationData));
    
    // Navigate to results page
    navigate('/valuation-result');
  };

  if (step === 'lookup') {
    return (
      <Container className="max-w-4xl py-10">
        <UnifiedVinLookup 
          showHeader={true} 
          onSubmit={handleVinLookup}
        />
      </Container>
    );
  }

  if (step === 'details' && vehicleData) {
    return (
      <Container className="max-w-4xl py-10">
        <div className="space-y-6">
          {/* Vehicle Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Car className="h-5 w-5 mr-2" />
                Vehicle Found
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-4">
                <h2 className="text-2xl font-bold">
                  {vehicleData.year} {vehicleData.make} {vehicleData.model}
                </h2>
                {vehicleData.trim && (
                  <Badge variant="outline">{vehicleData.trim}</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2 font-mono">
                VIN: {vehicleData.vin}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">{vehicleData.year}</span>
                </div>
                <div className="flex items-center">
                  <Car className="h-4 w-4 mr-2" />
                  <span className="text-sm">{vehicleData.bodyType || 'Sedan'}</span>
                </div>
                {vehicleData.engine && (
                  <div className="flex items-center">
                    <Gauge className="h-4 w-4 mr-2" />
                    <span className="text-sm">{vehicleData.engine}</span>
                  </div>
                )}
                {vehicleData.fuelType && (
                  <div className="flex items-center">
                    <span className="text-sm">{vehicleData.fuelType}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Valuation Details Form */}
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Valuation</CardTitle>
              <p className="text-muted-foreground">
                Help us provide a more accurate estimate by providing additional details.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mileage">Current Mileage *</Label>
                  <Input
                    id="mileage"
                    type="number"
                    placeholder="e.g., 45000"
                    value={mileage}
                    onChange={(e) => setMileage(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="condition">Vehicle Condition *</Label>
                  <Select value={condition} onValueChange={setCondition}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <Input
                    id="zipCode"
                    placeholder="e.g., 90210"
                    maxLength={5}
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Used for local market pricing analysis
                </p>
              </div>

              <Button 
                onClick={handleGetValuation} 
                className="w-full"
                disabled={!mileage || !condition || !zipCode}
              >
                Get My Valuation
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </Container>
    );
  }

  return null;
}
