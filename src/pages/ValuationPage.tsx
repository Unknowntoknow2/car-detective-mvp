import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Car, AlertCircle, ArrowRight, Upload, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VehicleSelectorWrapper } from '@/components/lookup/form-parts/vehicle-selector/VehicleSelectorWrapper';
import { useValuationPipeline } from '@/hooks/valuation-pipeline';
import { PhotoUploader } from '@/components/valuation/photo-upload/PhotoUploader';
import { Stepper } from '@/components/ui/stepper';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

// Define form schema with validation
const formSchema = z.object({
  make: z.string().min(1, { message: 'Make is required' }),
  model: z.string().min(1, { message: 'Model is required' }),
  year: z.coerce.number().min(1900, { message: 'Please enter a valid year' }).max(new Date().getFullYear() + 1),
  mileage: z.coerce.number().min(0, { message: 'Please enter a valid mileage' }),
  condition: z.string().min(1, { message: 'Condition is required' }),
  zipCode: z.string().regex(/^\d{5}$/, { message: 'Please enter a valid 5-digit ZIP code' }),
});

type FormValues = z.infer<typeof formSchema>;

// Steps for the valuation flow
const STEPS = [
  { id: 'vehicle', label: 'Vehicle Info' },
  { id: 'details', label: 'Details' },
  { id: 'photos', label: 'Photos' },
  { id: 'review', label: 'Review' }
];

const ValuationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  const [photoScore, setPhotoScore] = useState<number | null>(null);
  const [bestPhoto, setBestPhoto] = useState<string | undefined>(undefined);
  const [aiCondition, setAiCondition] = useState<any | null>(null);
  const [valuationId, setValuationId] = useState<string | null>(searchParams.get('valuationId'));
  
  // Initialize the valuation pipeline hook
  const {
    stage,
    vehicle,
    requiredInputs,
    valuationResult,
    error: pipelineError,
    isLoading: pipelineLoading,
    runLookup,
    submitValuation,
    reset
  } = useValuationPipeline();
  
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      make: '',
      model: '',
      year: undefined,
      mileage: undefined,
      condition: 'good',
      zipCode: '',
    },
  });

  // Update the form when make/model selection changes
  useEffect(() => {
    if (selectedMake) {
      form.setValue('make', selectedMake, { shouldValidate: true });
    }
    if (selectedModel) {
      form.setValue('model', selectedModel, { shouldValidate: true });
    }
  }, [selectedMake, selectedModel, form]);

  // Effect to update form when vehicle data is available
  useEffect(() => {
    if (vehicle) {
      setSelectedMake(vehicle.make || '');
      setSelectedModel(vehicle.model || '');
      setSelectedYear(vehicle.year);
      form.setValue('make', vehicle.make || '', { shouldValidate: true });
      form.setValue('model', vehicle.model || '', { shouldValidate: true });
      form.setValue('year', vehicle.year || undefined, { shouldValidate: true });
      
      // Move to the next step automatically when vehicle data is loaded
      if (currentStep === 0 && stage === 'details_required') {
        setCurrentStep(1);
      }
    }
  }, [vehicle, form, currentStep, stage]);

  // Effect to handle valuation result
  useEffect(() => {
    if (valuationResult && valuationResult.valuationId) {
      setValuationId(valuationResult.valuationId);
      localStorage.setItem('latest_valuation_id', valuationResult.valuationId);
      
      // Move to photo upload step if we have a valuation ID
      if (currentStep < 2) {
        setCurrentStep(2);
      }
    }
  }, [valuationResult, currentStep]);

  // Helper to convert condition string to number
  const getConditionNumber = (condition: string): number => {
    switch (condition.toLowerCase()) {
      case 'excellent': return 5;
      case 'good': return 3;
      case 'fair': return 2;
      case 'poor': return 1;
      default: return 3; // Default to 'good'
    }
  };

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setSubmissionError(null);
    
    try {
      // Submit the valuation request
      const conditionNumber = getConditionNumber(data.condition);
      
      const success = await submitValuation({
        mileage: data.mileage,
        condition: conditionNumber,
        conditionLabel: data.condition.charAt(0).toUpperCase() + data.condition.slice(1),
        zipCode: data.zipCode,
      });
      
      if (success && valuationResult) {
        toast.success('Vehicle details submitted successfully!');
        setCurrentStep(2); // Move to photo upload step
      } else {
        setSubmissionError('Could not calculate valuation. Please try again.');
      }
    } catch (err) {
      console.error('Valuation submission error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setSubmissionError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Initial lookup for manual entry
  const handleInitialLookup = async () => {
    if (!selectedMake || !selectedModel) {
      toast.error('Please select both make and model');
      return;
    }
    
    const yearValue = form.getValues('year');
    if (!yearValue) {
      toast.error('Please enter a valid year');
      return;
    }
    
    setSelectedYear(yearValue);
    
    try {
      // Using the correct parameters for manual lookup
      await runLookup('manual', 'manual-entry', undefined, {
        make: selectedMake,
        model: selectedModel,
        year: yearValue
      });
    } catch (err) {
      console.error('Lookup error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      toast.error(errorMessage);
    }
  };

  // Handle next step
  const handleNextStep = () => {
    if (currentStep === 0) {
      if (!vehicle) {
        handleInitialLookup();
        return;
      }
    }
    
    if (currentStep === 1) {
      form.handleSubmit(onSubmit)();
      return;
    }
    
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Handle photo score update
  const handlePhotoScoreUpdate = (score: number, bestPhotoUrl?: string, condition?: any) => {
    setPhotoScore(score);
    setBestPhoto(bestPhotoUrl);
    setAiCondition(condition);
    toast.success("Photos analyzed successfully!");
    
    // Move to review step after photo analysis
    setCurrentStep(3);
  };

  // Check if vehicle identification step is complete
  const isVehicleStepComplete = !!vehicle || (selectedMake && selectedModel && form.getValues('year'));

  // Check if details step is complete
  const isDetailsStepComplete = form.getValues('mileage') && form.getValues('zipCode') && form.getValues('condition');

  // Check if photo step is complete 
  const isPhotoStepComplete = !!photoScore;

  // Handle final submission to go to results
  const handleFinalSubmit = () => {
    if (valuationId) {
      navigate(`/results?valuationId=${valuationId}`);
    } else {
      toast.error("No valuation ID found. Please try again.");
    }
  };

  // Handle upgrade to premium
  const handleUpgradeToPremium = () => {
    if (valuationId) {
      navigate(`/premium?valuationId=${valuationId}`);
    } else {
      toast.error("No valuation ID found. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container mx-auto py-8 px-4 flex-grow">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Free Vehicle Valuation</h1>
          <p className="mb-8 text-muted-foreground">
            Get an accurate market value for your vehicle in minutes.
          </p>
          
          {/* Step indicator */}
          <div className="mb-8">
            <Stepper 
              steps={STEPS} 
              currentStep={currentStep}
              onStepClick={(step) => {
                // Only allow navigation to completed steps
                if (
                  (step === 0) || 
                  (step === 1 && isVehicleStepComplete) ||
                  (step === 2 && isDetailsStepComplete) ||
                  (step === 3 && isPhotoStepComplete)
                ) {
                  setCurrentStep(step);
                }
              }}
            />
          </div>
          
          {/* Error display */}
          {(submissionError || pipelineError) && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {submissionError || pipelineError}
              </AlertDescription>
            </Alert>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>
                {STEPS[currentStep].label}
              </CardTitle>
              <CardDescription>
                {currentStep === 0 && "Provide basic information about your vehicle."}
                {currentStep === 1 && "Let's add some specifics about your vehicle condition."}
                {currentStep === 2 && "Upload photos for more accurate valuation."}
                {currentStep === 3 && "Review your information before getting results."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                {/* Step 1: Vehicle Selection */}
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4 col-span-2">
                        <FormLabel>Make & Model</FormLabel>
                        <VehicleSelectorWrapper
                          selectedMake={selectedMake}
                          setSelectedMake={setSelectedMake}
                          selectedModel={selectedModel}
                          setSelectedModel={setSelectedModel}
                          disabled={pipelineLoading}
                          required={true}
                        />
                      </div>
                    
                      <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="e.g. 2019" 
                                {...field} 
                                disabled={pipelineLoading}
                                onChange={e => {
                                  field.onChange(e.target.valueAsNumber || undefined);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
                
                {/* Step 2: Additional Details */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    {vehicle && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center">
                          <Car className="h-5 w-5 text-green-500 mr-2" />
                          <p className="text-green-800">
                            {vehicle.year} {vehicle.make} {vehicle.model} verified!
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="mileage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Mileage</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="e.g. 45000" 
                                {...field} 
                                onChange={e => field.onChange(e.target.valueAsNumber || undefined)}
                              />
                            </FormControl>
                            <FormDescription>
                              Enter the current odometer reading
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="condition"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Vehicle Condition</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="excellent">Excellent</SelectItem>
                                <SelectItem value="good">Good</SelectItem>
                                <SelectItem value="fair">Fair</SelectItem>
                                <SelectItem value="poor">Poor</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Honest assessment helps with accuracy
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP Code</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g. 90210" 
                                {...field} 
                                maxLength={5}
                              />
                            </FormControl>
                            <FormDescription>
                              For regional market adjustment
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
                
                {/* Step 3: Photo Upload */}
                {currentStep === 2 && valuationId && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                        <div>
                          <p className="text-blue-800 font-medium mb-1">
                            Photo Analysis Improves Accuracy
                          </p>
                          <p className="text-blue-700 text-sm">
                            Upload photos of your vehicle to get a more accurate valuation. Our AI will analyze the condition from your photos.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <PhotoUploader 
                      valuationId={valuationId} 
                      onScoreUpdate={handlePhotoScoreUpdate} 
                    />
                    
                    <div className="mt-4 text-sm text-muted-foreground">
                      <p>Don't have photos? You can <button 
                        type="button"
                        onClick={() => setCurrentStep(3)} 
                        className="text-primary underline"
                      >
                        continue without photos
                      </button> but your valuation may be less accurate.</p>
                    </div>
                  </div>
                )}
                
                {/* Step 4: Review */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium mb-3">Vehicle Information</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between border-b pb-1">
                            <span className="text-muted-foreground">Year:</span>
                            <span className="font-medium">{form.getValues('year') || vehicle?.year}</span>
                          </div>
                          <div className="flex justify-between border-b pb-1">
                            <span className="text-muted-foreground">Make:</span>
                            <span className="font-medium">{form.getValues('make') || vehicle?.make}</span>
                          </div>
                          <div className="flex justify-between border-b pb-1">
                            <span className="text-muted-foreground">Model:</span>
                            <span className="font-medium">{form.getValues('model') || vehicle?.model}</span>
                          </div>
                          <div className="flex justify-between border-b pb-1">
                            <span className="text-muted-foreground">Mileage:</span>
                            <span className="font-medium">{form.getValues('mileage')?.toLocaleString()} miles</span>
                          </div>
                          <div className="flex justify-between border-b pb-1">
                            <span className="text-muted-foreground">Condition:</span>
                            <span className="font-medium">{form.getValues('condition')?.charAt(0).toUpperCase() + form.getValues('condition')?.slice(1)}</span>
                          </div>
                          <div className="flex justify-between pb-1">
                            <span className="text-muted-foreground">ZIP Code:</span>
                            <span className="font-medium">{form.getValues('zipCode')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3">Photo Assessment</h3>
                        {photoScore ? (
                          <div className="space-y-3">
                            {bestPhoto && (
                              <div className="aspect-video relative bg-slate-100 rounded-lg overflow-hidden">
                                <img 
                                  src={bestPhoto} 
                                  alt="Vehicle" 
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            )}
                            <div className="space-y-2 text-sm mt-2">
                              <div className="flex justify-between border-b pb-1">
                                <span className="text-muted-foreground">Photo Score:</span>
                                <span className="font-medium">{Math.round(photoScore * 100)}%</span>
                              </div>
                              {aiCondition && (
                                <>
                                  <div className="flex justify-between border-b pb-1">
                                    <span className="text-muted-foreground">AI Assessment:</span>
                                    <span className="font-medium">{aiCondition.condition}</span>
                                  </div>
                                  {aiCondition.issuesDetected?.length > 0 && (
                                    <div className="flex justify-between pb-1">
                                      <span className="text-muted-foreground">Issues Detected:</span>
                                      <span className="font-medium text-right">{aiCondition.issuesDetected.join(', ')}</span>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-50 rounded-lg p-4 text-center h-full flex flex-col items-center justify-center">
                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-gray-500">No photos submitted</p>
                            <p className="text-xs text-gray-400 mt-1">Valuation will be based on reported condition only</p>
                            <Button 
                              variant="link" 
                              className="mt-2"
                              onClick={() => setCurrentStep(2)}
                            >
                              Add photos for better accuracy
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Form>
              
              {/* Navigation buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  disabled={currentStep === 0 || isSubmitting || pipelineLoading}
                >
                  Back
                </Button>
                
                {currentStep < STEPS.length - 1 ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    disabled={
                      isSubmitting || 
                      pipelineLoading || 
                      (currentStep === 0 && !isVehicleStepComplete) ||
                      (currentStep === 1 && !isDetailsStepComplete)
                    }
                  >
                    {isSubmitting || pipelineLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleUpgradeToPremium}
                    >
                      Upgrade to Premium
                    </Button>
                    <Button
                      type="button"
                      onClick={handleFinalSubmit}
                    >
                      See Results
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ValuationPage;
