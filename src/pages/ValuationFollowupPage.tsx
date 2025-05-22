
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { MainLayout } from '@/components/layout/MainLayout';
import { Car, ArrowRight, Loader2 } from 'lucide-react';

export default function ValuationFollowupPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const vin = searchParams.get('vin');
  const plate = searchParams.get('plate');
  const state = searchParams.get('state');
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    mileage: '',
    condition: 'good',
    zipCode: '',
    selectedFeatures: [] as string[]
  });
  
  const [vehicleInfo, setVehicleInfo] = useState({
    year: '',
    make: '',
    model: '',
    vin: vin || '',
    trim: ''
  });
  
  useEffect(() => {
    // If we have a VIN or plate, simulate fetching vehicle data
    if (vin || (plate && state)) {
      setIsLoading(true);
      
      // Simulate API call to get vehicle data
      setTimeout(() => {
        // Simulated data response
        setVehicleInfo({
          year: '2019',
          make: 'Toyota',
          model: 'Camry',
          vin: vin || '',
          trim: 'XLE'
        });
        
        setIsLoading(false);
      }, 1500);
    }
  }, [vin, plate, state]);
  
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Combine vehicle info and form data
    const valuationData = {
      ...vehicleInfo,
      ...formData,
      mileage: parseInt(formData.mileage, 10)
    };
    
    // Store valuation data
    localStorage.setItem('valuation_data', JSON.stringify(valuationData));
    
    // Simulate valuation API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/valuation-result');
      toast.success('Valuation completed successfully!');
    }, 1500);
  };
  
  if (isLoading && !vehicleInfo.make) {
    return (
      <MainLayout>
        <div className="container py-20 flex justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold">Retrieving Vehicle Information</h2>
            <p className="text-muted-foreground mt-2">
              Please wait while we fetch details for your vehicle...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Complete Your Valuation</h1>
            <p className="text-muted-foreground mt-2">
              We need a few more details to provide an accurate valuation
            </p>
          </div>
          
          {vehicleInfo.make && (
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Vehicle Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Year</h3>
                    <p className="font-medium">{vehicleInfo.year}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Make</h3>
                    <p className="font-medium">{vehicleInfo.make}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Model</h3>
                    <p className="font-medium">{vehicleInfo.model}</p>
                  </div>
                  {vehicleInfo.trim && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Trim</h3>
                      <p className="font-medium">{vehicleInfo.trim}</p>
                    </div>
                  )}
                  {vehicleInfo.vin && (
                    <div className="col-span-2 md:col-span-4">
                      <h3 className="text-sm font-medium text-muted-foreground">VIN</h3>
                      <p className="font-mono">{vehicleInfo.vin}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Additional Details Needed</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="mileage">Current Mileage</Label>
                    <Input
                      id="mileage"
                      type="number"
                      placeholder="e.g. 50000"
                      value={formData.mileage}
                      onChange={(e) => handleChange('mileage', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="condition">Vehicle Condition</Label>
                    <Select
                      value={formData.condition}
                      onValueChange={(value) => handleChange('condition', value)}
                    >
                      <SelectTrigger id="condition">
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
                
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    placeholder="e.g. 90210"
                    maxLength={5}
                    value={formData.zipCode}
                    onChange={(e) => handleChange('zipCode', e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Your ZIP code helps us provide a location-specific valuation
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Get Valuation
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
