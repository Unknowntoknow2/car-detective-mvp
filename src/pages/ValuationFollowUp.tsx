
import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { useNavigate, useLocation } from 'react-router-dom';
import { ManualEntryForm } from '@/components/lookup/ManualEntryForm';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';

export default function ValuationFollowUp() {
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
  
  const handleSubmit = async (data: ManualEntryFormData) => {
    setLoading(true);
    
    try {
      // Add VIN to the data if available
      const formDataWithVin = {
        ...data,
        vin: vin || data.vin
      };
      
      // Store vehicle data for result page
      localStorage.setItem('vehicle_data', JSON.stringify(formDataWithVin));
      
      // Get current user if available
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Save to Supabase if user is logged in
        const { error } = await supabase
          .from('manual_entry_valuations')
          .insert({
            make: data.make,
            model: data.model,
            year: data.year,
            mileage: data.mileage,
            condition: data.condition,
            zip_code: data.zipCode,
            user_id: user.id,
            fuel_type: data.fuelType,
            transmission: data.transmission,
            vin: vin || data.vin || null,
            accident: data.accidentDetails?.hasAccident || false,
            accident_severity: data.accidentDetails?.severity || null,
            selected_features: data.selectedFeatures || []
          });
          
        if (error) {
          console.error('Error saving to Supabase:', error);
          toast.error("Error saving data: " + error.message);
        } else {
          toast.success("Vehicle details saved");
        }
      }
      
      // Navigate to results page
      setTimeout(() => {
        setLoading(false);
        navigate('/valuation-result');
      }, 1000);
    } catch (error: any) {
      console.error('Error in submit:', error);
      toast.error("Error: " + (error.message || "Something went wrong"));
      setLoading(false);
    }
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
      toast.error("Cannot skip without VIN information");
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
