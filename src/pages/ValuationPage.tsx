
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Award, Car } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { LookupTabs } from '@/components/lookup/LookupTabs';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const ValuationPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePremiumClick = () => {
    if (user) {
      navigate('/premium-valuation');
    } else {
      navigate('/auth');
    }
  };

  const handleLookupSubmit = async (type: string, value: string, state?: string) => {
    setIsSubmitting(true);
    try {
      let result;
      let valuationId;
      
      if (type === 'vin') {
        // Handle VIN lookup
        result = await performVinLookup(value);
        valuationId = result?.id;
      } else if (type === 'plate') {
        // Handle plate lookup
        result = await performPlateLookup(value, state || '');
        valuationId = result?.id;
      } else if (type === 'manual') {
        // Handle manual entry - parse the JSON string
        const manualData = JSON.parse(value);
        result = await performManualValuation(manualData);
        valuationId = result?.id;
      }

      if (valuationId) {
        navigate(`/valuation/result/${valuationId}`);
      } else {
        toast.error('Failed to generate valuation. Please try again.');
      }
    } catch (error) {
      console.error('Error during lookup:', error);
      toast.error('An error occurred during valuation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to perform VIN lookup
  const performVinLookup = async (vin: string) => {
    // Create a valuation entry in the database
    const { data, error } = await supabase
      .from('valuations')
      .insert({
        vin: vin,
        user_id: user?.id || null,
        is_vin_lookup: true,
        estimated_value: Math.floor(15000 + Math.random() * 10000), // Mock value for demo
        confidence_score: Math.floor(70 + Math.random() * 30),
        base_price: 15000,
        year: new Date().getFullYear() - Math.floor(Math.random() * 5),
        make: 'Auto-detected', // This would be filled by actual VIN decoder
        model: 'Auto-detected',
        mileage: Math.floor(20000 + Math.random() * 50000),
      })
      .select('*')
      .single();

    if (error) throw error;
    return data;
  };

  // Function to perform plate lookup
  const performPlateLookup = async (plate: string, state: string) => {
    // In a real app, this would first resolve the plate to a VIN
    // For demo, we'll create a valuation directly
    const { data, error } = await supabase
      .from('valuations')
      .insert({
        plate: plate,
        state: state,
        user_id: user?.id || null,
        is_vin_lookup: false,
        estimated_value: Math.floor(12000 + Math.random() * 8000), // Mock value for demo
        confidence_score: Math.floor(65 + Math.random() * 25),
        base_price: 12000,
        year: new Date().getFullYear() - Math.floor(Math.random() * 6),
        make: 'Auto-detected', // This would be filled by actual plate lookup
        model: 'Auto-detected',
        mileage: Math.floor(25000 + Math.random() * 60000),
      })
      .select('*')
      .single();

    if (error) throw error;
    return data;
  };

  // Function to perform manual valuation
  const performManualValuation = async (data: any) => {
    // Create a valuation entry based on manual input
    const { data: valuation, error } = await supabase
      .from('valuations')
      .insert({
        user_id: user?.id || null,
        is_vin_lookup: false,
        estimated_value: calculateEstimatedValue(data),
        confidence_score: 75, // Slightly lower confidence for manual entry
        base_price: 10000, // Base price would be determined by make/model/year
        year: data.year,
        make: data.make,
        model: data.model,
        mileage: data.mileage,
        condition: data.condition,
        state: data.zipCode?.substring(0, 2), // Using first two digits of ZIP as a placeholder for state
      })
      .select('*')
      .single();

    if (error) throw error;
    return valuation;
  };

  // Simple function to calculate estimated value based on manual entry
  const calculateEstimatedValue = (data: any) => {
    // Basic formula: base price adjusted for year, mileage, and condition
    const basePrice = 15000;
    const yearFactor = 1 + ((data.year - 2010) * 0.05);
    const mileageFactor = 1 - ((data.mileage / 100000) * 0.2);
    
    let conditionFactor = 1;
    switch (data.condition) {
      case 'excellent':
        conditionFactor = 1.2;
        break;
      case 'good':
        conditionFactor = 1.0;
        break;
      case 'fair':
        conditionFactor = 0.8;
        break;
      case 'poor':
        conditionFactor = 0.6;
        break;
      default:
        conditionFactor = 1.0;
    }
    
    return Math.floor(basePrice * yearFactor * mileageFactor * conditionFactor);
  };

  return (
    <div className="container mx-auto py-8">
      <Toaster position="top-center" richColors />
      <h1 className="text-3xl font-bold mb-6">Vehicle Valuation</h1>
      
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Instant Vehicle Valuation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LookupTabs 
                defaultTab="vin" 
                onSubmit={handleLookupSubmit}
                isSubmitting={isSubmitting}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <Award className="h-5 w-5" />
                Premium Valuation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-amber-700">Unlock comprehensive reports, market analysis, and dealer offers with our premium valuation.</p>
              
              <div className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="bg-amber-200 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                    <span>Full CARFAX® Vehicle History Report</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-amber-200 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                    <span>Detailed market analysis with similar vehicles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-amber-200 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                    <span>Connect with dealers for competitive offers</span>
                  </li>
                </ul>
                
                <Button 
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                  onClick={handlePremiumClick}
                >
                  Get Premium Valuation <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Recently Valued Cars */}
          <Card>
            <CardHeader>
              <CardTitle>Recently Valued</CardTitle>
            </CardHeader>
            <CardContent>
              {user ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Your recent valuations will appear here.</p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/dashboard">
                      View All Valuations
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Sign in to save and view your valuation history.</p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/auth">
                      Sign In
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ValuationPage;
