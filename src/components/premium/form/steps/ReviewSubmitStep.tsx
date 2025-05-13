
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormData } from '@/types/premium-valuation';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

interface ReviewSubmitStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity?: (step: number, isValid: boolean) => void;
  isFormValid: boolean;
  handleSubmit: () => void;
  handleReset: () => void;
  isSubmitting?: boolean;
  submitError?: string | null;
  isFreeVersion?: boolean;
}

export function ReviewSubmitStep({
  step,
  formData,
  setFormData,
  updateValidity,
  isFormValid,
  handleSubmit,
  handleReset,
  isSubmitting = false,
  submitError = null,
  isFreeVersion = false
}: ReviewSubmitStepProps) {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmitClick = async () => {
    if (!isFormValid) {
      toast.error("Please complete all required fields before submitting");
      return;
    }
    
    try {
      setSubmitted(true);
      await handleSubmit();
      toast.success(`${isFreeVersion ? 'Free' : 'Premium'} valuation completed successfully!`);
      
      // The form data should now include the valuation ID
      if (formData.valuationId) {
        // Could navigate to a results page
        // navigate(`/valuation-result/${formData.valuationId}`);
      }
    } catch (error) {
      console.error("Error submitting valuation:", error);
      toast.error("Failed to submit valuation. Please try again.");
      setSubmitted(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Review & Submit</h2>
        <p className="text-gray-600 mb-6">
          Please review all information before submitting your {isFreeVersion ? 'free' : 'premium'} valuation request.
        </p>
      </div>
      
      <Card className="bg-slate-50 border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Vehicle Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Make & Model</p>
              <p className="font-medium">{formData.year} {formData.make} {formData.model}</p>
            </div>
            {formData.trim && (
              <div>
                <p className="text-sm text-gray-500">Trim</p>
                <p className="font-medium">{formData.trim}</p>
              </div>
            )}
            {formData.mileage !== undefined && (
              <div>
                <p className="text-sm text-gray-500">Mileage</p>
                <p className="font-medium">{formData.mileage.toLocaleString()} miles</p>
              </div>
            )}
            {formData.condition && (
              <div>
                <p className="text-sm text-gray-500">Condition</p>
                <p className="font-medium">{formData.conditionLabel || formData.condition}</p>
              </div>
            )}
            {formData.zipCode && (
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">ZIP: {formData.zipCode}</p>
              </div>
            )}
            {formData.hasAccident && (
              <div>
                <p className="text-sm text-gray-500">Accident History</p>
                <p className="font-medium">{formData.hasAccident === 'yes' ? 'Yes' : 'No'}</p>
              </div>
            )}
            {formData.drivingProfile && (
              <div>
                <p className="text-sm text-gray-500">Driving Profile</p>
                <p className="font-medium">{formData.drivingProfile.charAt(0).toUpperCase() + formData.drivingProfile.slice(1)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {formData.features && formData.features.length > 0 && (
        <Card className="bg-slate-50 border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Features & Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  {feature}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex flex-col gap-4 mt-8">
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            {submitError}
          </div>
        )}
        
        <Button
          onClick={handleSubmitClick}
          disabled={isSubmitting || !isFormValid || submitted}
          className="h-12"
          data-testid="submit-valuation"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : submitted ? (
            <>
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Submitted
            </>
          ) : (
            <>
              Submit {isFreeVersion ? 'Free' : 'Premium'} Valuation
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
        
        <Button variant="outline" onClick={handleReset} disabled={isSubmitting}>
          Start Over
        </Button>
      </div>
    </div>
  );
}
