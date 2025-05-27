import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Car, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ValuationResult } from '@/components/valuation/ValuationResult';
import { VinFollowupFlow } from '@/components/lookup/followup/VinFollowupFlow';
import { Progress } from '@/components/ui/progress';

interface ValuationData {
  id: string;
  vin?: string;
  estimated_value?: number;
  confidence_score?: number;
  created_at?: string;
  // ... other valuation fields
}

interface FollowUpData {
  completion_percentage: number;
  is_complete: boolean;
  // ... other follow-up fields
}

const ValuationPage = () => {
  const { vin } = useParams<{ vin: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [valuation, setValuation] = useState<ValuationData | null>(null);
  const [followUpData, setFollowUpData] = useState<FollowUpData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentStage, setCurrentStage] = useState<'checking' | 'no-valuation' | 'incomplete-followup' | 'complete'>('checking');

  // Get VIN from URL params or search params
  const currentVin = vin || searchParams.get('vin');

  useEffect(() => {
    const checkValuationStatus = async () => {
      if (!currentVin) {
        setError('No VIN provided');
        setLoading(false);
        return;
      }

      try {
        console.log('Checking valuation status for VIN:', currentVin);
        
        // Check for existing valuation
        const { data: valuationData, error: valuationError } = await supabase
          .from('valuations')
          .select('*')
          .eq('vin', currentVin)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (valuationError) {
          console.error('Error checking valuation:', valuationError);
          setError('Failed to check valuation status');
          setLoading(false);
          return;
        }

        if (!valuationData) {
          console.log('No valuation found, need to start new one');
          setCurrentStage('no-valuation');
          setLoading(false);
          return;
        }

        // Check follow-up completion if valuation exists
        const { data: followUpData, error: followUpError } = await supabase
          .from('follow_up_answers')
          .select('*')
          .eq('vin', currentVin)
          .eq('valuation_id', valuationData.id)
          .maybeSingle();

        if (followUpError) {
          console.error('Error checking follow-up:', followUpError);
        }

        setValuation(valuationData);
        setFollowUpData(followUpData);

        // Determine stage based on completion
        if (!followUpData || !followUpData.is_complete) {
          console.log('Follow-up incomplete, showing followup flow');
          setCurrentStage('incomplete-followup');
        } else {
          console.log('Valuation complete, showing results');
          setCurrentStage('complete');
        }

      } catch (err) {
        console.error('Error in checkValuationStatus:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    checkValuationStatus();
  }, [currentVin]);

  const handleStartValuation = () => {
    // Navigate to VIN lookup with pre-filled VIN
    navigate(`/vin-lookup?vin=${currentVin}`);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleFollowUpComplete = () => {
    // Refresh the page to check completion status
    window.location.reload();
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

  // No valuation exists - prompt to start
  if (currentStage === 'no-valuation') {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center">
                  <Car className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Start Vehicle Valuation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Ready to get an accurate valuation for VIN: <span className="font-mono font-medium">{currentVin}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  We'll guide you through a few questions to provide the most accurate estimate.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                  <Button onClick={handleStartValuation} className="flex items-center gap-2">
                    Start Valuation Process
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

  // Valuation exists but follow-up incomplete
  if (currentStage === 'incomplete-followup') {
    const completionPercentage = followUpData?.completion_percentage || 0;
    
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Progress Header */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Complete Your Valuation</span>
                  <span className="text-sm font-medium">{completionPercentage}% Complete</span>
                </CardTitle>
                <div className="space-y-2">
                  <Progress value={completionPercentage} className="w-full" />
                  <p className="text-sm text-muted-foreground">
                    VIN: {currentVin} • Just a few more questions to get your accurate valuation
                  </p>
                </div>
              </CardHeader>
            </Card>

            {/* Follow-up Flow */}
            <VinFollowupFlow />
          </div>
        </div>
      </MainLayout>
    );
  }

  // Complete valuation - show results
  if (currentStage === 'complete' && valuation) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Success Header */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  Valuation Complete
                </CardTitle>
                <p className="text-muted-foreground">
                  Your comprehensive vehicle valuation is ready
                </p>
              </CardHeader>
            </Card>

            {/* Valuation Results */}
            <Card className="p-6">
              <ValuationResult vin={currentVin!} />
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Fallback
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p>Loading valuation...</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default ValuationPage;
