
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { LookupTabs } from '@/components/home/LookupTabs';
import { VehicleFoundCard } from '@/components/lookup/shared/VehicleFoundCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/utils/formatters';
import { DecodedVehicleInfo } from '@/types/vehicle';

export default function ValuationPage() {
  const { vin: urlVin } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [currentStep, setCurrentStep] = useState<'lookup' | 'details' | 'result'>('lookup');
  const [vehicleData, setVehicleData] = useState<DecodedVehicleInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form data for follow-up questions
  const [mileage, setMileage] = useState('');
  const [condition, setCondition] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [accidents, setAccidents] = useState('');
  
  // Check for existing vehicle data on mount
  useEffect(() => {
    console.log('ValuationPage: Checking for VIN:', urlVin);
    
    if (urlVin) {
      // Check localStorage for vehicle data
      const storedData = localStorage.getItem('current_vehicle_data');
      if (storedData) {
        try {
          const data = JSON.parse(storedData);
          console.log('ValuationPage: Found stored vehicle data:', data);
          setVehicleData(data);
          setCurrentStep('details');
        } catch (error) {
          console.error('Error parsing stored vehicle data:', error);
        }
      }
    }
  }, [urlVin]);

  const handleLookupSubmit = (type: string, value: string, state?: string) => {
    console.log('ValuationPage: Lookup submitted:', { type, value, state });
    // The lookup components will handle navigation internally
  };

  const handleBackToLookup = () => {
    setCurrentStep('lookup');
    setVehicleData(null);
    localStorage.removeItem('current_vin');
    localStorage.removeItem('current_vehicle_data');
    navigate('/valuation');
  };

  const handleSubmitDetails = async () => {
    if (!vehicleData) return;

    setIsLoading(true);

    try {
      // Calculate estimated value based on inputs
      const baseValue = vehicleData.estimatedValue || 20000;
      const mileageAdjustment = Math.max(0, (150000 - parseInt(mileage || '0')) / 150000) * 0.3;
      const conditionMultiplier = {
        'excellent': 1.15,
        'good': 1.0,
        'fair': 0.85,
        'poor': 0.7
      }[condition] || 1.0;
      
      const accidentAdjustment = accidents === 'yes' ? 0.9 : 1.0;
      
      const finalValue = Math.round(baseValue * (1 + mileageAdjustment) * conditionMultiplier * accidentAdjustment);

      // Create valuation result
      const valuationResult = {
        ...vehicleData,
        mileage: parseInt(mileage || '0'),
        condition,
        zipCode,
        accidents: accidents === 'yes',
        estimatedValue: finalValue,
        confidenceScore: 92,
        timestamp: new Date().toISOString(),
        valuationId: crypto.randomUUID()
      };

      // Store result
      localStorage.setItem('latest_valuation', JSON.stringify(valuationResult));
      
      setCurrentStep('result');
      toast.success('Valuation completed successfully!');
      
    } catch (error) {
      console.error('Error calculating valuation:', error);
      toast.error('Error calculating valuation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderValuationResult = () => {
    if (!vehicleData) return null;

    const estimatedValue = vehicleData.estimatedValue || 20000;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Valuation Complete</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {formatCurrency(estimatedValue)}
              </div>
              <p className="text-muted-foreground">Estimated Market Value</p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Trade-in Value</p>
                <p className="font-semibold">{formatCurrency(Math.round(estimatedValue * 0.85))}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Private Sale</p>
                <p className="font-semibold">{formatCurrency(estimatedValue)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Retail Value</p>
                <p className="font-semibold">{formatCurrency(Math.round(estimatedValue * 1.15))}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => navigate('/valuation-result')} className="flex-1">
                View Detailed Report
              </Button>
              <Button variant="outline" onClick={handleBackToLookup} className="flex-1">
                Start New Valuation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderFollowUpQuestions = () => {
    if (!vehicleData) return null;

    return (
      <div className="space-y-6">
        <VehicleFoundCard 
          vehicle={vehicleData}
          showActions={false}
        />

        <Card>
          <CardHeader>
            <CardTitle>Vehicle Details</CardTitle>
            <p className="text-sm text-muted-foreground">
              Please provide additional details for a more accurate valuation
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mileage">Current Mileage *</Label>
                <Input
                  id="mileage"
                  type="number"
                  placeholder="e.g. 50000"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  required
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

              <div>
                <Label htmlFor="zipcode">ZIP Code</Label>
                <Input
                  id="zipcode"
                  placeholder="e.g. 90210"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  maxLength={5}
                />
              </div>

              <div>
                <Label htmlFor="accidents">Any Accidents?</Label>
                <Select value={accidents} onValueChange={setAccidents}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No Accidents</SelectItem>
                    <SelectItem value="yes">Yes, Minor</SelectItem>
                    <SelectItem value="major">Yes, Major</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleSubmitDetails}
                disabled={!mileage || !condition || isLoading}
                className="flex-1"
              >
                {isLoading ? 'Calculating...' : 'Get My Valuation'}
              </Button>
              <Button variant="outline" onClick={handleBackToLookup}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Lookup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Container className="max-w-4xl py-10">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Get Your Car's Value</h1>
          <p className="text-xl text-gray-600">Enter your vehicle information for an instant, accurate valuation</p>
        </div>

        {currentStep === 'lookup' && (
          <LookupTabs 
            defaultTab="vin"
            onSubmit={handleLookupSubmit}
          />
        )}

        {currentStep === 'details' && renderFollowUpQuestions()}
        
        {currentStep === 'result' && renderValuationResult()}
      </div>
    </Container>
  );
}
