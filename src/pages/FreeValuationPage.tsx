import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { VehicleLookupForm } from '@/components/valuation/VehicleLookupForm';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Stepper } from '@/components/ui/stepper';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { UnifiedValuationResult } from '@/components/valuation/UnifiedValuationResult';

// Define the form schema for each step of the valuation
const mileageSchema = z.object({
  mileage: z.string().regex(/^\d+$/, "Please enter a valid mileage number")
});

const accidentSchema = z.object({
  hasAccident: z.enum(['yes', 'no']),
  accidentSeverity: z.enum(['minor', 'moderate', 'major']).optional(),
  accidentArea: z.enum(['front', 'rear', 'side', 'multiple']).optional(),
  repaired: z.enum(['yes', 'no']).optional()
});

const conditionSchema = z.object({
  condition: z.enum(['excellent', 'good', 'fair', 'poor']),
  tireCondition: z.enum(['new', 'good', 'fair', 'poor'])
});

const loanSchema = z.object({
  hasLoan: z.enum(['yes', 'no']),
  loanAmount: z.string().optional()
});

const zipSchema = z.object({
  zipCode: z.string().regex(/^\d{5}$/, "Please enter a valid 5-digit ZIP code")
});

type Step = 
  | 'vehicle-lookup'
  | 'mileage'
  | 'accident'
  | 'condition'
  | 'loan'
  | 'zip'
  | 'results';

export default function FreeValuationPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('vehicle-lookup');
  const [vehicleInfo, setVehicleInfo] = useState<DecodedVehicleInfo | null>(null);
  
  const [mileageData, setMileageData] = useState({ mileage: '' });
  const [accidentData, setAccidentData] = useState({
    hasAccident: 'no' as 'yes' | 'no',
    accidentSeverity: undefined as 'minor' | 'moderate' | 'major' | undefined,
    accidentArea: undefined as 'front' | 'rear' | 'side' | 'multiple' | undefined,
    repaired: undefined as 'yes' | 'no' | undefined
  });
  const [conditionData, setConditionData] = useState({
    condition: 'good' as 'excellent' | 'good' | 'fair' | 'poor',
    tireCondition: 'good' as 'new' | 'good' | 'fair' | 'poor'
  });
  const [loanData, setLoanData] = useState({
    hasLoan: 'no' as 'yes' | 'no',
    loanAmount: ''
  });
  const [zipData, setZipData] = useState({ zipCode: '' });
  
  const [valuationResult, setValuationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Define forms for each step
  const mileageForm = useForm({
    resolver: zodResolver(mileageSchema),
    defaultValues: mileageData
  });
  
  const accidentForm = useForm({
    resolver: zodResolver(accidentSchema),
    defaultValues: accidentData
  });
  
  const conditionForm = useForm({
    resolver: zodResolver(conditionSchema),
    defaultValues: conditionData
  });
  
  const loanForm = useForm({
    resolver: zodResolver(loanSchema),
    defaultValues: loanData
  });
  
  const zipForm = useForm({
    resolver: zodResolver(zipSchema),
    defaultValues: zipData
  });
  
  // Define handlers for each step
  const handleVehicleDecoded = (data: DecodedVehicleInfo) => {
    setVehicleInfo(data);
    
    // If zipCode is already provided, use it
    if (data.zipCode) {
      setZipData({ zipCode: data.zipCode });
      zipForm.setValue('zipCode', data.zipCode);
    }
    
    // If mileage is provided, use it
    if (data.mileage) {
      setMileageData({ mileage: data.mileage.toString() });
      mileageForm.setValue('mileage', data.mileage.toString());
    }
  };
  
  const handleMileageSubmit = (data: any) => {
    setMileageData(data);
    setCurrentStep('accident');
  };
  
  const handleAccidentSubmit = (data: any) => {
    setAccidentData(data);
    setCurrentStep('condition');
  };
  
  const handleConditionSubmit = (data: any) => {
    setConditionData(data);
    setCurrentStep('loan');
  };
  
  const handleLoanSubmit = (data: any) => {
    setLoanData(data);
    setCurrentStep('zip');
  };
  
  const handleZipSubmit = async (data: any) => {
    setZipData(data);
    await getValuation();
  };
  
  const getValuation = async () => {
    if (!vehicleInfo) return;
    
    setIsLoading(true);
    
    try {
      // Build the valuation payload
      const valuationParams = {
        make: vehicleInfo.make,
        model: vehicleInfo.model,
        year: vehicleInfo.year,
        trim: vehicleInfo.trim,
        mileage: parseInt(mileageData.mileage),
        condition: conditionData.condition,
        zipCode: zipData.zipCode,
        accidentCount: accidentData.hasAccident === 'yes' ? 1 : 0,
        accidentSeverity: accidentData.accidentSeverity,
        accidentArea: accidentData.accidentArea,
        accidentRepaired: accidentData.repaired === 'yes',
        tireCondition: conditionData.tireCondition,
        hasLoan: loanData.hasLoan === 'yes',
        loanAmount: loanData.hasLoan === 'yes' ? parseFloat(loanData.loanAmount || '0') : 0,
        vin: vehicleInfo.vin,
        bodyType: vehicleInfo.bodyType,
        fuelType: vehicleInfo.fuelType,
        transmission: vehicleInfo.transmission,
        drivetrain: vehicleInfo.drivetrain,
        color: vehicleInfo.color
      };
      
      // Call the car-price-prediction edge function
      const { data, error } = await supabase.functions.invoke('car-price-prediction', {
        body: valuationParams
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // If we got data back, store it and proceed to results
      if (data) {
        setValuationResult(data);
        setCurrentStep('results');
        
        // Save to localStorage for non-logged-in users
        localStorage.setItem('latest_valuation_data', JSON.stringify(data));
        if (data.id) {
          localStorage.setItem('latest_valuation_id', data.id);
        }
        
        // If user is logged in, we assume the backend function saved the valuation to the user's account
      }
    } catch (error) {
      console.error('Valuation error:', error);
      toast.error('Unable to generate valuation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveReport = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      // Redirect to login, saving the valuation data in localStorage for retrieval later
      localStorage.setItem('valuation_to_save', JSON.stringify({
        vehicleInfo,
        mileageData,
        accidentData,
        conditionData,
        loanData,
        zipData,
        valuationResult
      }));
      navigate('/login?redirect=/valuation-result');
      return;
    }
    
    // If already logged in, the valuation is already saved, just navigate to dashboard
    if (valuationResult?.id) {
      navigate(`/valuation-result?id=${valuationResult.id}`);
    }
  };
  
  const handleEmailReport = async () => {
    if (!valuationResult) return;
    
    try {
      toast.info('Sending email...');
      
      const { error } = await supabase.functions.invoke('email-valuation-pdf', {
        body: { valuationId: valuationResult.id }
      });
      
      if (error) throw new Error(error.message);
      
      toast.success('Valuation report has been emailed to you!');
    } catch (error) {
      console.error('Email error:', error);
      toast.error('Unable to email report. Please try again.');
    }
  };
  
  const getStepIndex = () => {
    const steps = [
      'vehicle-lookup', 
      'mileage', 
      'accident', 
      'condition', 
      'loan', 
      'zip', 
      'results'
    ];
    return steps.indexOf(currentStep);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 container max-w-3xl py-10 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Free Vehicle Valuation</h1>
          <p className="text-muted-foreground">
            Get an instant estimate of your vehicle's value based on market data.
          </p>
        </div>
        
        {/* Show progress steps except on results page */}
        {currentStep !== 'results' && (
          <div className="mb-8">
            <Stepper 
              currentStep={getStepIndex()} 
              steps={[
                'Vehicle Details',
                'Mileage',
                'Accident History',
                'Condition',
                'Financing',
                'Location'
              ]}
            />
          </div>
        )}
        
        {/* Vehicle lookup step */}
        {currentStep === 'vehicle-lookup' && (
          <VehicleLookupForm
            onVehicleDecoded={handleVehicleDecoded}
            onContinue={() => setCurrentStep('mileage')}
          />
        )}
        
        {/* Mileage step */}
        {currentStep === 'mileage' && (
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Mileage</CardTitle>
              <CardDescription>
                Enter the current mileage of your {vehicleInfo?.year} {vehicleInfo?.make} {vehicleInfo?.model}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...mileageForm}>
                <form onSubmit={mileageForm.handleSubmit(handleMileageSubmit)} className="space-y-6">
                  <FormField
                    control={mileageForm.control}
                    name="mileage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Mileage</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="e.g., 45000"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setCurrentStep('vehicle-lookup')}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button type="submit">
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
        
        {/* Accident history step */}
        {currentStep === 'accident' && (
          <Card>
            <CardHeader>
              <CardTitle>Accident History</CardTitle>
              <CardDescription>
                Tell us if your vehicle has been in any accidents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...accidentForm}>
                <form onSubmit={accidentForm.handleSubmit(handleAccidentSubmit)} className="space-y-6">
                  <FormField
                    control={accidentForm.control}
                    name="hasAccident"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Has this vehicle been in an accident?</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="no">No, never been in an accident</SelectItem>
                            <SelectItem value="yes">Yes, has accident history</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {accidentForm.watch('hasAccident') === 'yes' && (
                    <>
                      <FormField
                        control={accidentForm.control}
                        name="accidentSeverity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>How severe was the accident?</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select severity" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="minor">Minor - Cosmetic damage only</SelectItem>
                                <SelectItem value="moderate">Moderate - Required some repairs</SelectItem>
                                <SelectItem value="major">Major - Significant damage/repairs</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={accidentForm.control}
                        name="accidentArea"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Which area was damaged?</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select area" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="front">Front</SelectItem>
                                <SelectItem value="rear">Rear</SelectItem>
                                <SelectItem value="side">Side</SelectItem>
                                <SelectItem value="multiple">Multiple Areas</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={accidentForm.control}
                        name="repaired"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Was the damage fully repaired?</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an option" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="yes">Yes, fully repaired</SelectItem>
                                <SelectItem value="no">No, still has damage</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                  
                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setCurrentStep('mileage')}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button type="submit">
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
        
        {/* Condition step */}
        {currentStep === 'condition' && (
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Condition</CardTitle>
              <CardDescription>
                Tell us about the overall condition of your vehicle.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...conditionForm}>
                <form onSubmit={conditionForm.handleSubmit(handleConditionSubmit)} className="space-y-6">
                  <FormField
                    control={conditionForm.control}
                    name="condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Overall Condition</FormLabel>
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
                            <SelectItem value="excellent">Excellent - Like new, no visible issues</SelectItem>
                            <SelectItem value="good">Good - Minor wear, well maintained</SelectItem>
                            <SelectItem value="fair">Fair - Some wear, may need minor repairs</SelectItem>
                            <SelectItem value="poor">Poor - Significant wear, needs repairs</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={conditionForm.control}
                    name="tireCondition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tire Condition</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select tire condition" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="new">New - Recently replaced</SelectItem>
                            <SelectItem value="good">Good - Plenty of tread left</SelectItem>
                            <SelectItem value="fair">Fair - Some wear, still usable</SelectItem>
                            <SelectItem value="poor">Poor - Need replacement soon</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setCurrentStep('accident')}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button type="submit">
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
        
        {/* Loan step */}
        {currentStep === 'loan' && (
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Financing</CardTitle>
              <CardDescription>
                Tell us if you have any outstanding loans on this vehicle.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...loanForm}>
                <form onSubmit={loanForm.handleSubmit(handleLoanSubmit)} className="space-y-6">
                  <FormField
                    control={loanForm.control}
                    name="hasLoan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Do you still owe money on this vehicle?</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="no">No, I own it free and clear</SelectItem>
                            <SelectItem value="yes">Yes, I still have a loan</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {loanForm.watch('hasLoan') === 'yes' && (
                    <FormField
                      control={loanForm.control}
                      name="loanAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Approximate payoff amount (optional)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="e.g., 12000"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setCurrentStep('condition')}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button type="submit">
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
        
        {/* Zip code step */}
        {currentStep === 'zip' && (
          <Card>
            <CardHeader>
              <CardTitle>Your Location</CardTitle>
              <CardDescription>
                We need your ZIP code to provide an accurate valuation based on your local market.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...zipForm}>
                <form onSubmit={zipForm.handleSubmit(handleZipSubmit)} className="space-y-6">
                  <FormField
                    control={zipForm.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="e.g., 90210"
                            maxLength={5}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setCurrentStep('loan')}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Calculating...' : 'Get My Valuation'}
                      {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
        
        {/* Results step */}
        {currentStep === 'results' && valuationResult && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Your Vehicle Valuation</CardTitle>
                    <CardDescription>
                      {vehicleInfo?.year} {vehicleInfo?.make} {vehicleInfo?.model} {vehicleInfo?.trim || ''}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1 text-sm px-3 py-1 bg-green-50 text-green-700 rounded-full">
                    <Check className="h-4 w-4" />
                    <span>Free Valuation</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <UnifiedValuationResult
                  displayMode="full"
                  valuationId={valuationResult.id}
                  vehicleInfo={{
                    make: vehicleInfo?.make || '',
                    model: vehicleInfo?.model || '',
                    year: vehicleInfo?.year || 0,
                    trim: vehicleInfo?.trim,
                    mileage: parseInt(mileageData.mileage),
                    condition: conditionData.condition,
                    vin: vehicleInfo?.vin
                  }}
                  estimatedValue={valuationResult.estimatedValue}
                  confidenceScore={valuationResult.confidenceScore}
                  priceRange={valuationResult.priceRange}
                  adjustments={valuationResult.adjustments}
                />
                
                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  <Button onClick={handleSaveReport} className="flex-1">
                    Save This Report
                  </Button>
                  <Button variant="outline" onClick={handleEmailReport} className="flex-1">
                    Email This Report
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={() => navigate('/premium-valuation')} 
                    className="flex-1"
                  >
                    Get Premium Report
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-center">
              <Button 
                variant="ghost" 
                onClick={() => {
                  setCurrentStep('vehicle-lookup');
                  setVehicleInfo(null);
                  setValuationResult(null);
                }}
              >
                Appraise Another Vehicle
              </Button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default FreeValuationPage;
