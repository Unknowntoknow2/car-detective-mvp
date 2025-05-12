
import React from 'react';
import { Button } from '@/components/ui/button';
import { FormData } from '@/types/premium-valuation';
import { motion } from 'framer-motion';
import { VehicleSummary } from './prediction-review/VehicleSummary';
import { FeaturesDisplay } from './prediction-review/FeaturesDisplay';
import { GetValuationButton } from './prediction-review/GetValuationButton';
import { Loader2, AlertCircle } from 'lucide-react';
import { ValuationResultCard } from './prediction-review/ValuationResultCard';

interface ReviewSubmitStepProps {
  step: number;
  formData: FormData;
  isFormValid: boolean;
  handleSubmit: () => void;
  handleReset: () => void;
  isSubmitting?: boolean;
  submitError?: string | null;
  isFreeVersion?: boolean; // Add this prop
}

export function ReviewSubmitStep({
  step,
  formData,
  isFormValid,
  handleSubmit,
  handleReset,
  isSubmitting = false,
  submitError = null,
  isFreeVersion = false // Default to false
}: ReviewSubmitStepProps) {
  const hasEstimatedValue = formData.estimatedValue !== undefined;
  
  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-6 space-y-6 bg-white shadow-sm">
        <h3 className="text-xl font-semibold">Review Your Vehicle Information</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <VehicleSummary formData={formData} />
          
          {!isFreeVersion && formData.features && formData.features.length > 0 && (
            <FeaturesDisplay features={formData.features} />
          )}
        </div>

        {hasEstimatedValue && (
          <ValuationResultCard 
            estimatedValue={formData.estimatedValue}
            confidenceScore={formData.confidenceScore}
            priceRange={formData.priceRange}
          />
        )}
        
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3 text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p>{submitError}</p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-between pt-4">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isSubmitting}
          >
            Start Over
          </Button>
          
          {!hasEstimatedValue ? (
            <GetValuationButton 
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              isLoading={isSubmitting}
              isPremium={!isFreeVersion} // Premium button for premium valuation, standard for free
            />
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                isFreeVersion ? "Get Free Valuation" : "Download Premium Report"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
