
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CarFinderQaherCard } from '@/components/valuation/CarFinderQaherCard';
import { TabbedFollowUpForm } from '@/components/followup/TabbedFollowUpForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useValuation } from '@/contexts/ValuationContext';
import { useFollowUpForm } from '@/hooks/useFollowUpForm';
import { toast } from 'sonner';

export default function ValuationFollowUpPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { processFreeValuation } = useValuation();

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

  // Initialize the follow-up form with enhanced error handling
  const {
    formData,
    updateFormData,
    submitForm,
    isLoading,
    isSaving,
    saveError,
    lastSaveTime
  } = useFollowUpForm(vehicleData.vin, {
    vin: vehicleData.vin,
    zip_code: '',
    mileage: 50000,
    condition: 'good',
    year: vehicleData.year
  });

  const handleBackToSelection = () => {
    navigate(-1);
  };

  const handleSubmitAnswers = async () => {
    setIsSubmitting(true);
    try {
      console.log('🚀 Starting valuation submission with follow-up data:', formData);
      
      // Save the form data first
      const saveSuccess = await submitForm();
      if (!saveSuccess) {
        throw new Error('Failed to save follow-up data');
      }
      
      // Process the valuation with the follow-up data
      const valuationResult = await processFreeValuation({
        make: vehicleData.make,
        model: vehicleData.model,
        year: vehicleData.year,
        mileage: formData.mileage || 50000,
        condition: formData.condition || 'Good',
        zipCode: formData.zip_code || '90210'
      });
      
      console.log('✅ ValuationFollowUpPage: Valuation completed successfully:', valuationResult);
      toast.success('Comprehensive valuation completed! Redirecting to results...');
      
      // Navigate to results page
      navigate(`/results/${valuationResult.valuationId}`);
    } catch (error) {
      console.error('❌ Error submitting follow-up answers:', error);
      toast.error('Failed to complete valuation. Please check your data and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveProgress = () => {
    // The auto-save functionality is already handled in the hook
    toast.success('Progress saved successfully!');
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

        {/* Vehicle Found Card - More Prominent at Top */}
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

        {/* Follow-up Questions - Enhanced with better error handling */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Complete Your Comprehensive Valuation
            </h2>
            <p className="text-gray-600">
              Navigate through each section using the tabs. Your progress is automatically saved.
            </p>
          </div>
          
          {isLoading ? (
            <Card className="p-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Loading your vehicle information...</span>
              </div>
            </Card>
          ) : (
            <TabbedFollowUpForm
              formData={formData}
              updateFormData={updateFormData}
              onSubmit={handleSubmitAnswers}
              onSave={handleSaveProgress}
              isLoading={isSubmitting}
              isSaving={isSaving}
              saveError={saveError}
              lastSaveTime={lastSaveTime}
            />
          )}
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
