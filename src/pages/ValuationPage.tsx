
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Car, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { VehicleSelectorWrapper } from '@/components/lookup/form-parts/vehicle-selector/VehicleSelectorWrapper';
import { useValuationPipeline } from '@/hooks/valuation-pipeline';

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

const ValuationPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  
  // Use the valuation pipeline hook
  const {
    stage,
    error: pipelineError,
    isLoading: pipelineLoading,
    runLookup,
    submitValuation,
    valuationResult
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
  React.useEffect(() => {
    if (selectedMake) {
      form.setValue('make', selectedMake, { shouldValidate: true });
    }
    if (selectedModel) {
      form.setValue('model', selectedModel, { shouldValidate: true });
    }
  }, [selectedMake, selectedModel, form]);

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setSubmissionError(null);
    
    try {
      // Submit the valuation request
      const success = await submitValuation({
        mileage: data.mileage,
        condition: data.condition,
        conditionLabel: data.condition.charAt(0).toUpperCase() + data.condition.slice(1),
        zipCode: data.zipCode,
      });
      
      if (success && valuationResult) {
        toast.success('Valuation completed successfully!');
        
        // Store ID in localStorage for persistence
        if (valuationResult.id) {
          localStorage.setItem('latest_valuation_id', valuationResult.id);
        }
        
        // Navigate to the results page with the valuation ID
        navigate(`/results?valuationId=${valuationResult.id}`);
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
    
    try {
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

  // Check if first step is complete
  const isFirstStepComplete = selectedMake && selectedModel && form.getValues('year');

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Vehicle Valuation</h1>
        <p className="mb-8 text-muted-foreground">
          Get an accurate market value for your vehicle in seconds. Just enter some basic details below.
        </p>
        
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
            <CardTitle>Vehicle Information</CardTitle>
            <CardDescription>
              Please provide accurate information to get the most precise valuation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Vehicle Selection */}
                <div className={`space-y-4 ${stage !== 'initial' && 'opacity-50 pointer-events-none'}`}>
                  <h3 className="text-lg font-medium">Step 1: Identify Your Vehicle</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4 col-span-2">
                      <FormLabel>Make & Model</FormLabel>
                      <VehicleSelectorWrapper
                        selectedMake={selectedMake}
                        setSelectedMake={setSelectedMake}
                        selectedModel={selectedModel}
                        setSelectedModel={setSelectedModel}
                        disabled={stage !== 'initial'}
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
                              disabled={stage !== 'initial'}
                              onChange={e => {
                                field.onChange(e.target.valueAsNumber || undefined)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex items-end">
                      <Button 
                        type="button" 
                        onClick={handleInitialLookup}
                        disabled={!isFirstStepComplete || stage !== 'initial' || pipelineLoading}
                        className="h-10 w-full"
                      >
                        {pipelineLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          'Continue'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Step 2: Additional Details */}
                {stage === 'details_required' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Step 2: Additional Details</h3>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center">
                        <Car className="h-5 w-5 text-green-500 mr-2" />
                        <p className="text-green-800">
                          {selectedYear} {selectedMake} {selectedModel} verified!
                        </p>
                      </div>
                    </div>
                    
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
                    
                    <div className="flex justify-end space-x-4 pt-4">
                      <Button
                        type="submit"
                        disabled={!form.formState.isValid || isSubmitting}
                        className="w-full md:w-auto"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Calculating...
                          </>
                        ) : (
                          'Get Valuation'
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ValuationPage;
