
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { CarFinderQaherHeader } from '@/components/common/CarFinderQaherHeader';
import { UnifiedFollowUpForm } from '@/components/followup/UnifiedFollowUpForm';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { toast } from 'sonner';

export default function ValuationPage() {
  const { vin } = useParams<{ vin: string }>();
  const [isLoading, setIsLoading] = useState(false);

  const handleFollowUpSubmit = async (followUpAnswers: FollowUpAnswers) => {
    console.log('✅ VIN follow-up submitted:', followUpAnswers);
    setIsLoading(true);
    
    try {
      // Handle final valuation submission here
      toast.success('Valuation completed successfully!');
    } catch (error) {
      console.error('Error submitting valuation:', error);
      toast.error('Failed to submit valuation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowUpSave = async (followUpAnswers: FollowUpAnswers) => {
    console.log('📝 VIN follow-up saved:', followUpAnswers);
    // Progress is automatically saved by the UnifiedFollowUpForm
  };

  const initialData: Partial<FollowUpAnswers> = {
    vin: vin || '',
    zip_code: '',
    mileage: undefined,
    condition: undefined,
    transmission: undefined,
    previous_use: 'personal',
    completion_percentage: 0,
    is_complete: false
  };

  if (!vin) {
    return (
      <Container className="max-w-6xl py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">VIN Required</h1>
          <p className="mt-2 text-gray-600">Please provide a valid VIN to continue.</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="max-w-6xl py-10">
      <CarFinderQaherHeader />
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          Vehicle Valuation
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          VIN: {vin}
        </p>
        <p className="text-sm text-gray-500">
          Please provide additional details for an accurate valuation.
        </p>
      </div>

      <UnifiedFollowUpForm 
        vin={vin}
        initialData={initialData}
        onSubmit={handleFollowUpSubmit}
        onSave={handleFollowUpSave}
      />
    </Container>
  );
}
