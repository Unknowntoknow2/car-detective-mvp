
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CarFinderQaherCard } from '@/components/valuation/CarFinderQaherCard';
import { TabbedFollowUpForm } from '@/components/followup/TabbedFollowUpForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useValuationContext } from '@/contexts/ValuationContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { valuationLogger } from '@/utils/valuationLogger';

export default function ValuationFollowUpPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { rerunValuation } = useValuationContext();

  // Extract vehicle data from URL params
  const vehicleData = {
    year: parseInt(searchParams.get('year') || ''),
    make: searchParams.get('make') || '',
    model: searchParams.get('model') || '',
    trim: searchParams.get('trim') || '',
    vin: searchParams.get('vin') || '',
    plate: searchParams.get('plate') || '',
    state: searchParams.get('state') || '',
    engine: searchParams.get('engine') || '',
    transmission: searchParams.get('transmission') || '',
    bodyType: searchParams.get('bodyType') || '',
    fuelType: searchParams.get('fuelType') || '',
    drivetrain: searchParams.get('drivetrain') || '',
    source: searchParams.get('source') as 'vin' | 'plate' | 'manual' || 'vin'
  };

  const handleBackToSelection = () => {
    navigate(-1);
  };

  // Load actual follow-up data and create valuation
  const handleSubmitAnswers = async (): Promise<boolean> => {
    try {
      valuationLogger.followUp(vehicleData.vin, 'submit-start', { 
        vehicleData: {
          year: vehicleData.year,
          make: vehicleData.make,
          model: vehicleData.model,
          source: vehicleData.source
        }
      }, true);
      
      // FIX #1: Validate VIN first
      if (!vehicleData.vin || vehicleData.vin.length !== 17) {
        valuationLogger.followUp(vehicleData.vin || 'invalid', 'validation-failed', { 
          reason: 'invalid-vin',
          vinLength: vehicleData.vin?.length || 0 
        }, false, 'Invalid VIN format');
        toast.error('Invalid VIN. Please go back and enter a valid 17-character VIN.');
        return false;
      }

      // FIX #2: Ensure user session is valid or handle anonymous users
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.warn('⚠️ [DEBUG] Auth error, proceeding as anonymous user:', authError);
      }
      const userId = user?.id || null;
      console.log('🔍 [DEBUG] User ID:', userId || 'anonymous');
      
      // FIXED: Load actual follow-up data instead of using defaults
      const { FollowUpService } = await import('@/services/followUpService');
      const { data: followUpData, error: followUpError } = await FollowUpService.getAnswersByVin(vehicleData.vin);
      
      valuationLogger.followUp(vehicleData.vin, 'load-answers', { hasError: !!followUpError }, !followUpError);
      if (followUpError) {
        valuationLogger.followUp(vehicleData.vin, 'load-answers-error', { error: followUpError }, false, typeof followUpError === 'string' ? followUpError : 'Follow-up data error');
        toast.error('Failed to load your information. Please try again.');
        return false;
      }

      if (!followUpData || !followUpData.mileage || !followUpData.zip_code) {
        valuationLogger.followUp(vehicleData.vin, 'incomplete-data', { 
          hasMileage: !!followUpData?.mileage,
          hasZipCode: !!followUpData?.zip_code,
          data: followUpData
        }, false, 'Incomplete follow-up data');
        toast.error('Please complete all required fields before submitting.');
        return false;
      }

      // FIX #5: Use real follow-up data for valuation with robust fallbacks
      const valuationInput = {
        vin: vehicleData.vin,
        make: vehicleData.make || 'Unknown',
        model: vehicleData.model || 'Unknown',
        year: vehicleData.year || 2020,
        trim: vehicleData.trim || '',
        mileage: followUpData.mileage,
        condition: followUpData.condition || 'good',
        zipCode: followUpData.zip_code,
        fuelType: (vehicleData.fuelType as 'gasoline' | 'diesel' | 'hybrid' | 'electric') || 'gasoline'
      };

      valuationLogger.followUp(vehicleData.vin, 'valuation-start', { 
        valuationInput,
        userId: userId || 'anonymous'
      }, true);
      
      await rerunValuation(valuationInput);
      
      valuationLogger.followUp(vehicleData.vin, 'valuation-success', { 
        navigateTo: `/results/${valuationInput.vin}`
      }, true);
      
      toast.success('Valuation completed successfully!');
      navigate(`/results/${valuationInput.vin}`, { replace: true });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      valuationLogger.followUp(vehicleData.vin, 'submit-error', { 
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      }, false, errorMessage);
      toast.error('Failed to complete valuation. Please try again.');
      return false;
    }
  };

  // If no vehicle data, show error state
  if (!vehicleData.make || !vehicleData.model || !vehicleData.year) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              Missing Vehicle Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 mb-4">
              We couldn't find the vehicle information needed for the follow-up questions.
            </p>
            <Button onClick={handleBackToSelection} variant="outline">
              Go Back to Vehicle Selection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto py-8 max-w-6xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBackToSelection}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Vehicle Selection
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Complete Your Comprehensive Valuation
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We've identified your vehicle. Now let's gather some additional details to provide you with the most accurate valuation possible.
            </p>
          </div>
        </div>

        {/* Vehicle Found Card */}
        <CarFinderQaherCard vehicle={vehicleData} />

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
              ✓
            </div>
            <span className="text-sm font-medium text-green-700">Vehicle Identified</span>
          </div>
          
          <div className="w-16 h-0.5 bg-blue-200"></div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
              2
            </div>
            <span className="text-sm font-medium text-blue-700">Additional Details</span>
          </div>
          
          <div className="w-16 h-0.5 bg-gray-200"></div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
              3
            </div>
            <span className="text-sm font-medium text-gray-500">Final Results</span>
          </div>
        </div>

        {/* Follow-up Questions */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Complete Your Comprehensive Valuation
            </h2>
            <p className="text-gray-600">
              Navigate through each section using the tabs. Your progress is automatically saved.
            </p>
          </div>
          
          <TabbedFollowUpForm
            vehicleData={vehicleData}
            onSubmit={handleSubmitAnswers}
          />
        </div>

        {/* Footer Info */}
        <div className="text-center text-sm text-gray-500 border-t pt-6">
          <p>
            Your information is secure and will only be used to provide you with an accurate vehicle valuation.
          </p>
        </div>
      </div>
    </div>
  );
}
