
import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { useNavigate, useLocation } from 'react-router-dom';
import { ManualEntryForm } from '@/components/lookup/ManualEntryForm';
import { toast } from 'sonner';

export default function ValuationFollowupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [vin, setVin] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Extract VIN from query params or localStorage
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const vinParam = params.get('vin');
    
    if (vinParam) {
      setVin(vinParam);
    } else {
      // Try to get VIN from localStorage
      const storedVin = localStorage.getItem('current_vin');
      if (storedVin) {
        setVin(storedVin);
      }
    }
  }, [location.search]);
  
  const handleSubmit = (data: any) => {
    setLoading(true);
    
    // Store vehicle data for result page
    localStorage.setItem('vehicle_data', JSON.stringify({
      ...data,
      vin: vin || data.vin
    }));
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/valuation-result');
    }, 1500);
  };
  
  const handleSkip = () => {
    // If skipping, we'll still need some data
    if (vin) {
      localStorage.setItem('vehicle_data', JSON.stringify({
        vin,
        // Default values
        year: new Date().getFullYear(),
        make: 'Unknown',
        model: 'Unknown',
        mileage: 0,
        condition: 'good',
        zipCode: ''
      }));
      
      navigate('/valuation-result');
    } else {
      toast.error('Cannot skip without VIN information');
    }
  };
  
  return (
    <MainLayout>
      <Container className="py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Additional Vehicle Details</h1>
            <p className="text-muted-foreground">
              We need a few more details to provide an accurate valuation for your vehicle.
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent>
              {vin && (
                <div className="mb-6 p-4 bg-primary/5 rounded-md">
                  <p className="text-sm font-medium">VIN: {vin}</p>
                </div>
              )}
              
              <ManualEntryForm 
                onSubmit={handleSubmit}
                isLoading={loading}
                submitButtonText="Continue to Valuation"
              />
              
              <div className="mt-4 text-center">
                <Button 
                  variant="link" 
                  onClick={handleSkip} 
                  disabled={!vin || loading}
                >
                  Skip for now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </MainLayout>
  );
}
