
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CarFinderQaherCard } from '@/components/valuation/CarFinderQaherCard';
import { FollowUpQuestions } from '@/components/valuation/FollowUpQuestions';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useValuation } from '@/contexts/ValuationContext';
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

  const handleBackToSelection = () => {
    navigate(-1);
  };

  const handleSubmitAnswers = async (answers: any) => {
    setIsSubmitting(true);
    try {
      console.log('Follow-up answers submitted:', answers);
      
      // Process the valuation with the follow-up data
      const valuationResult = await processFreeValuation({
        make: vehicleData.make,
        model: vehicleData.model,
        year: vehicleData.year,
        mileage: parseInt(answers.currentMileage) || 50000,
        condition: answers.exteriorCondition || 'Good',
        zipCode: '90210' // Default for now, should come from follow-up
      });
      
      console.log('✅ ValuationFollowUpPage: Valuation completed:', valuationResult);
      toast.success('Comprehensive valuation completed!');
      
      // Navigate to results page
      navigate(`/results/${valuationResult.valuationId}`);
    } catch (error) {
      console.error('Error submitting follow-up answers:', error);
      toast.error('Failed to complete valuation. Please try again.');
    } finally {
      setIsSubmitting(false);
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
      <div className="container mx-auto py-8 max-w-4xl space-y-8">
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
                Complete Your Accurate Valuation
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

        {/* Follow-up Questions */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Help Us Fine-Tune Your Valuation
            </h2>
            <p className="text-gray-600">
              The more details you provide, the more accurate your valuation will be.
            </p>
          </div>
          
          <FollowUpQuestions 
            onSubmit={handleSubmitAnswers}
            isLoading={isSubmitting}
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
