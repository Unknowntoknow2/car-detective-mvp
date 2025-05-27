
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Car, ArrowRight } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ValuationResult } from '@/components/valuation/ValuationResult';

// Define the adjustment type locally since it's simple
interface ValuationAdjustment {
  factor: string;
  impact: number;
  description: string;
}

const ValuationPage = () => {
  const { vin } = useParams<{ vin: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasValuation, setHasValuation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkValuation = async () => {
      if (!vin) {
        setError('No VIN provided');
        setLoading(false);
        return;
      }

      try {
        console.log('Checking for valuation with VIN:', vin);
        
        // Check if a valuation exists for this VIN
        const { data, error: supabaseError } = await supabase
          .from('valuations')
          .select('id')
          .eq('vin', vin)
          .maybeSingle();

        if (supabaseError) {
          console.error('Error checking valuation:', supabaseError);
          setError('Failed to check valuation status');
        } else if (data) {
          console.log('Valuation found for VIN:', vin);
          setHasValuation(true);
        } else {
          console.log('No valuation found for VIN:', vin);
          setHasValuation(false);
        }
      } catch (err) {
        console.error('Error in checkValuation:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    checkValuation();
  }, [vin]);

  const handleStartValuation = () => {
    // Navigate to VIN lookup page with the VIN pre-filled
    navigate(`/vin-lookup?vin=${vin}`);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Checking valuation status...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <Alert variant="destructive" className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="text-center mt-6">
            <Button onClick={handleGoHome}>Return Home</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!hasValuation) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center">
                  <Car className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">No Valuation Found</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We don't have a valuation for VIN: <span className="font-mono font-medium">{vin}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  To see the valuation results, you'll need to complete a valuation for this vehicle first.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                  <Button onClick={handleStartValuation} className="flex items-center gap-2">
                    Start Valuation
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={handleGoHome}>
                    Return Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  // If we have a valuation, show the ValuationResult component
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Valuation Results</h1>
        <Card className="p-6">
          <ValuationResult vin={vin!} />
        </Card>
      </div>
    </MainLayout>
  );
};

export default ValuationPage;
