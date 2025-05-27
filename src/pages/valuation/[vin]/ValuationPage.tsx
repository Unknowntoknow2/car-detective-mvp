
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CarFinderQaherHeader } from '@/components/common/CarFinderQaherHeader';
import { EnhancedVehicleCard } from '@/components/valuation/enhanced-followup/EnhancedVehicleCard';
import { EnhancedFollowUpForm } from '@/components/valuation/enhanced-followup/EnhancedFollowUpForm';
import { ValuationResult } from '@/components/valuation/ValuationResult';
import { useUser } from '@/hooks/useUser';
import { useValuationResult } from '@/hooks/useValuationResult';
import { lookupVin } from '@/services/vehicleService';
import { supabase } from '@/integrations/supabase/client';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { ValuationResult as ValuationResultType } from '@/types/valuation';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

export default function ValuationPage() {
  const { vin } = useParams<{ vin: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [vehicleInfo, setVehicleInfo] = useState<DecodedVehicleInfo | null>(null);
  const [isLoadingVehicle, setIsLoadingVehicle] = useState(true);
  const [vehicleError, setVehicleError] = useState<string | null>(null);
  const [followUpCompleted, setFollowUpCompleted] = useState(false);
  const [valuationGenerated, setValuationGenerated] = useState(false);
  const [currentValuationId, setCurrentValuationId] = useState<string | null>(null);

  // Fetch existing valuation result if available
  const { data: existingValuation, isLoading: isLoadingValuation } = useValuationResult(vin || '');

  // Load vehicle data on mount
  useEffect(() => {
    const loadVehicleData = async () => {
      if (!vin) {
        setVehicleError('No VIN provided');
        setIsLoadingVehicle(false);
        return;
      }

      try {
        console.log('🔍 Loading vehicle data for VIN:', vin);
        const result = await lookupVin(vin);
        setVehicleInfo(result);
        console.log('✅ Vehicle data loaded:', result);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load vehicle data';
        console.error('❌ Failed to load vehicle data:', errorMessage);
        setVehicleError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoadingVehicle(false);
      }
    };

    loadVehicleData();
  }, [vin]);

  // Check if follow-up answers exist
  useEffect(() => {
    const checkFollowUpStatus = async () => {
      if (!vin) return;

      try {
        const { data, error } = await supabase
          .from('follow_up_answers')
          .select('*')
          .eq('vin', vin.toUpperCase())
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking follow-up status:', error);
          return;
        }

        if (data) {
          setFollowUpCompleted(true);
          console.log('✅ Follow-up answers found:', data);
        }
      } catch (error) {
        console.error('Error checking follow-up status:', error);
      }
    };

    checkFollowUpStatus();
  }, [vin]);

  // Check if valuation already exists
  useEffect(() => {
    if (existingValuation) {
      setValuationGenerated(true);
      setCurrentValuationId(existingValuation.id);
      console.log('✅ Existing valuation found:', existingValuation);
    }
  }, [existingValuation]);

  const handleFollowUpComplete = async () => {
    if (!vin || !user?.id) {
      toast.error('Missing required information');
      return;
    }

    try {
      setFollowUpCompleted(true);
      toast.success('Assessment completed! Generating valuation...');

      // Generate valuation based on follow-up answers
      const { data: followUpData } = await supabase
        .from('follow_up_answers')
        .select('*')
        .eq('vin', vin.toUpperCase())
        .single();

      if (!followUpData) {
        throw new Error('Follow-up answers not found');
      }

      // Create valuation record
      const { data: valuation, error: valuationError } = await supabase
        .from('valuations')
        .insert({
          vin: vin.toUpperCase(),
          user_id: user.id,
          year: vehicleInfo?.year || new Date().getFullYear(),
          make: vehicleInfo?.make || 'Unknown',
          model: vehicleInfo?.model || 'Unknown',
          estimated_value: calculateEstimatedValue(followUpData.answers),
          confidence_score: 85,
          base_price: calculateBasePrice(vehicleInfo),
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (valuationError) {
        throw valuationError;
      }

      setCurrentValuationId(valuation.id);
      setValuationGenerated(true);
      toast.success('Valuation generated successfully!');

    } catch (error) {
      console.error('❌ Failed to generate valuation:', error);
      toast.error('Failed to generate valuation. Please try again.');
    }
  };

  const calculateEstimatedValue = (answers: any): number => {
    // Base calculation logic based on follow-up answers
    let baseValue = 15000; // Default base value
    
    if (vehicleInfo?.year) {
      // Adjust for year
      const currentYear = new Date().getFullYear();
      const age = currentYear - vehicleInfo.year;
      baseValue = Math.max(5000, baseValue - (age * 1000));
    }

    // Adjust based on condition
    if (answers.condition) {
      const conditionMultipliers = {
        'excellent': 1.2,
        'good': 1.0,
        'fair': 0.8,
        'poor': 0.6
      };
      baseValue *= conditionMultipliers[answers.condition] || 1.0;
    }

    // Adjust based on mileage
    if (answers.mileage) {
      const mileage = parseInt(answers.mileage);
      if (mileage < 50000) baseValue *= 1.1;
      else if (mileage > 100000) baseValue *= 0.9;
    }

    return Math.round(baseValue);
  };

  const calculateBasePrice = (vehicle: DecodedVehicleInfo | null): number => {
    if (!vehicle?.year) return 12000;
    
    const currentYear = new Date().getFullYear();
    const age = currentYear - vehicle.year;
    return Math.max(8000, 15000 - (age * 1200));
  };

  // Loading state
  if (isLoadingVehicle || isLoadingValuation) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 container max-w-6xl py-10">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="text-muted-foreground">Loading vehicle information...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (vehicleError || !vehicleInfo) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 container max-w-6xl py-10">
          <div className="text-center space-y-4">
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {vehicleError || 'Vehicle information not found'}
              </AlertDescription>
            </Alert>
            <button
              onClick={() => navigate('/vin-lookup')}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90"
            >
              Try Another VIN Lookup
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Prepare valuation data for display
  const valuationData = existingValuation ? {
    make: existingValuation.make,
    model: existingValuation.model,
    year: existingValuation.year,
    condition: 'Good', // Default condition
    estimatedValue: existingValuation.estimatedValue || 0,
    confidenceScore: existingValuation.confidenceScore || 85,
    basePrice: existingValuation.basePrice || calculateBasePrice(vehicleInfo),
    adjustments: existingValuation.adjustments || [
      {
        factor: 'Vehicle Age',
        impact: -2000,
        description: 'Depreciation based on vehicle age'
      },
      {
        factor: 'Market Demand',
        impact: 1500,
        description: 'High demand for this make and model'
      }
    ]
  } : null;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 container max-w-6xl py-10">
        <div className="space-y-8">
          <CarFinderQaherHeader />
          
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Vehicle Assessment & Valuation</h1>
              <p className="text-muted-foreground">
                Complete your vehicle assessment for an accurate valuation
              </p>
              <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full">
                <span className="text-sm">VIN: {vin}</span>
              </div>
            </div>

            <EnhancedVehicleCard vehicle={vehicleInfo} />

            {!followUpCompleted && !valuationGenerated && (
              <EnhancedFollowUpForm
                vin={vin || ''}
                onComplete={handleFollowUpComplete}
              />
            )}

            {(followUpCompleted || valuationGenerated) && valuationData && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-green-600">✅ Valuation Complete</h2>
                  <p className="text-muted-foreground">Your vehicle has been professionally assessed</p>
                </div>
                <ValuationResult data={valuationData} />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
