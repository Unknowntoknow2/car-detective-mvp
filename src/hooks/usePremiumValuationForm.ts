import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { premiumValuationSchema, FormData } from '@/types/premium-valuation';
import { createPremiumValuation } from '@/services/valuationService';
import { toast } from 'sonner';

export const usePremiumValuationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const vinFromUrl = searchParams.get('vin');

  const [activeStep, setActiveStep] = useState(1);
  const [isStepValid, setIsStepValid] = useState<boolean[]>([]);
  const [valuationId, setValuationId] = useState<string | null>(null);
  const [vin, setVin] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with react-hook-form
  const form = useForm<FormData>({
    resolver: zodResolver(premiumValuationSchema),
    defaultValues: {
      vin: '',
      mileage: '',
      zipCode: '',
      email: '',
      agreeToTerms: false,
    },
    mode: "onChange"
  });

  // Set vin from URL
  useEffect(() => {
    setVin(vinFromUrl ?? null);
  }, [vinFromUrl]);

  // Update form with vin from URL
  useEffect(() => {
    if (vin) {
      form.setValue('vin', vin);
    }
  }, [vin, form.setValue]);

  // Function to proceed to the next step
  const nextStep = () => {
    if (activeStep < 3) {
      setActiveStep(activeStep + 1);
    }
  };

  // Function to go back to the previous step
  const prevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  // Function to set the validity of a step
  const updateValidity = (step: number, isValid: boolean) => {
    setIsStepValid(prev => {
      const newValidity = [...prev];
      newValidity[step] = isValid;
      return newValidity;
    });
  };

  // Function to handle form submission
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Call the createPremiumValuation service
      const result = await createPremiumValuation(data);

      if (result && result.id) {
        // Set the valuation ID
        setValuationId(result.id);

        // Show success message
        toast.success('Premium Valuation created successfully!');

        // Navigate to the success page
        navigate(`/premium/success?valuationId=${result.id}`);
      } else {
        // Show error message if something goes wrong
        toast.error('Failed to create premium valuation. Please try again.');
      }
    } catch (error) {
      console.error('There was an error submitting the form:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    activeStep,
    nextStep,
    prevStep,
    form,
    onSubmit,
    updateValidity,
    isStepValid,
    valuationId,
    isSubmitting
  };
};
