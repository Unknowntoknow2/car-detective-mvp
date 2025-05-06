import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle, Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/integrations/supabase/client';
import { ZipValidation } from '@/components/common/ZipValidation';
import { Checkbox } from '@/components/ui/checkbox';
import { ManualEntryFormData } from './types/manualEntry';
import { VEHICLE_MAKES, VEHICLE_MODELS, VEHICLE_YEARS } from '@/data/vehicle-data';
import { VEHICLE_FEATURES } from '@/data/vehicle-features';

const formSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.coerce.number().min(1900, 'Year must be 1900 or later').max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
  mileage: z.coerce.number().min(0, 'Mileage cannot be negative').max(1000000, 'Mileage seems too high'),
  condition: z.string().min(1, 'Condition is required'),
  zipCode: z.string().min(5, 'ZIP code must be 5 digits').max(5, 'ZIP code must be 5 digits').regex(/^\d{5}$/, 'ZIP code must be 5 digits'),
  fuelType: z.string().optional(),
  accident: z.boolean().optional(),
  accidentDetails: z.object({
    count: z.string().optional(),
    severity: z.string().optional(),
    area: z.string().optional(),
  }).optional(),
  selectedFeatures: z.array(z.string()).optional(),
});

interface ManualEntryFormProps {
  onSubmit: (data: ManualEntryFormData, valuationId?: string) => void;
  isLoading?: boolean;
  submitButtonText?: string;
  isPremium?: boolean;
}

const ManualEntryForm: React.FC<ManualEntryFormProps> = ({ 
  onSubmit, 
  isLoading = false, 
  submitButtonText = "Get Valuation",
  isPremium = false
}) => {
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isZipValid, setIsZipValid] = useState(false);
  const [showAccidentDetails, setShowAccidentDetails] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  const { 
    control, 
    handleSubmit, 
    formState: { errors }, 
    watch,
    setValue,
    reset
  } = useForm<ManualEntryFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      mileage: 0,
      condition: '',
      zipCode: '',
      fuelType: 'Gasoline',
      accident: false,
      accidentDetails: {
        count: '1',
        severity: 'minor',
        area: 'front'
      },
      selectedFeatures: []
    }
  });

  const selectedMake = watch('make');
  const selectedZip = watch('zipCode');
  const hasAccident = watch('accident');

  // Update available models when make changes
  useEffect(() => {
    if (selectedMake) {
      // In a real app, this would filter models based on the selected make
      // For now, we'll just use a subset of models for demonstration
      const filteredModels = VEHICLE_MODELS.filter(model => 
        model.toLowerCase().includes(selectedMake.toLowerCase().substring(0, 3))
      );
      setAvailableModels(filteredModels.length > 0 ? filteredModels : VEHICLE_MODELS);
    } else {
      setAvailableModels([]);
    }
  }, [selectedMake]);

  // Update accident details visibility
  useEffect(() => {
    setShowAccidentDetails(!!hasAccident);
  }, [hasAccident]);

  // Update selected features in form when they change
  useEffect(() => {
    setValue('selectedFeatures', selectedFeatures);
  }, [selectedFeatures, setValue]);

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const getConditionScore = (condition: string): number => {
    switch (condition.toLowerCase()) {
      case 'excellent': return 90;
      case 'good': return 80;
      case 'fair': return 65;
      case 'poor': return 40;
      default: return 70;
    }
  };

  const handleFormSubmit = async (values: ManualEntryFormData) => {
    if (selectedZip && selectedZip.length === 5 && !isZipValid) {
      toast.error('Please enter a valid ZIP code');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Save to Supabase if premium
      let valuationId;
      if (isPremium) {
        const { data: valuation, error } = await supabase
          .from('valuations')
          .insert({
            make: values.make,
            model: values.model,
            year: values.year,
            mileage: values.mileage,
            condition_score: getConditionScore(values.condition),
            body_type: values.bodyType,
            user_id: user?.id || '00000000-0000-0000-0000-000000000000',
            state: values.zipCode,
            is_vin_lookup: false
          })
          .select()
          .single();
          
        if (error) {
          console.error('Error saving valuation:', error);
          toast.error('Failed to save valuation data');
        } else {
          valuationId = valuation.id;
          // Store in localStorage for persistence
          localStorage.setItem('latest_valuation_id', valuationId);
        }
      }
      
      // Call the original onSubmit with the valuationId
      onSubmit({ ...values }, valuationId);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit vehicle details');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="make">Make</Label>
          <Controller
            name="make"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isLoading || isSubmitting}
              >
                <SelectTrigger id="make" className={errors.make ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select make" />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLE_MAKES.map((make) => (
                    <SelectItem key={make} value={make}>
                      {make}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.make && (
            <p className="text-red-500 text-sm mt-1">{errors.make.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Controller
            name="model"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!selectedMake || isLoading || isSubmitting}
              >
                <SelectTrigger id="model" className={errors.model ? "border-red-500" : ""}>
                  <SelectValue placeholder={selectedMake ? "Select model" : "Select make first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableModels.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.model && (
            <p className="text-red-500 text-sm mt-1">{errors.model.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Controller
            name="year"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(value) => field.onChange(parseInt(value))}
                value={field.value.toString()}
                disabled={isLoading || isSubmitting}
              >
                <SelectTrigger id="year" className={errors.year ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLE_YEARS.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.year && (
            <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mileage">Mileage</Label>
          <Controller
            name="mileage"
            control={control}
            render={({ field }) => (
              <Input
                id="mileage"
                type="number"
                placeholder="Enter mileage"
                className={errors.mileage ? "border-red-500" : ""}
                disabled={isLoading || isSubmitting}
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            )}
          />
          {errors.mileage && (
            <p className="text-red-500 text-sm mt-1">{errors.mileage.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <Controller
            name="condition"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isLoading || isSubmitting}
              >
                <SelectTrigger id="condition" className={errors.condition ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Excellent">Excellent</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.condition && (
            <p className="text-red-500 text-sm mt-1">{errors.condition.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Controller
            name="zipCode"
            control={control}
            render={({ field }) => (
              <Input
                id="zipCode"
                placeholder="Enter ZIP code"
                className={errors.zipCode ? "border-red-500" : ""}
                disabled={isLoading || isSubmitting}
                maxLength={5}
                {...field}
              />
            )}
          />
          {errors.zipCode && (
            <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
          )}
          {selectedZip && selectedZip.length === 5 && (
            <ZipValidation 
              zip={selectedZip} 
              onValidChange={setIsZipValid} 
              compact={true} 
            />
          )}
        </div>

        {isPremium && (
          <>
            <div className="space-y-2">
              <Label htmlFor="fuelType">Fuel Type</Label>
              <Controller
                name="fuelType"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
                    disabled={isLoading || isSubmitting}
                  >
                    <SelectTrigger id="fuelType">
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gasoline">Gasoline</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Controller
                  name="accident"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="accident"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading || isSubmitting}
                    />
                  )}
                />
                <Label htmlFor="accident" className="cursor-pointer">
                  Vehicle has been in an accident
                </Label>
              </div>
            </div>
          </>
        )}
      </div>

      {isPremium && showAccidentDetails && (
        <div className="bg-slate-50 p-4 rounded-md border border-slate-200 mt-4">
          <h3 className="text-sm font-medium mb-3">Accident Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accidentCount">Number of Accidents</Label>
              <Controller
                name="accidentDetails.count"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || '1'}
                    disabled={isLoading || isSubmitting}
                  >
                    <SelectTrigger id="accidentCount">
                      <SelectValue placeholder="Select count" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4+">4 or more</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accidentSeverity">Severity</Label>
              <Controller
                name="accidentDetails.severity"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || 'minor'}
                    disabled={isLoading || isSubmitting}
                  >
                    <SelectTrigger id="accidentSeverity">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minor">Minor</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="severe">Severe</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accidentArea">Affected Area</Label>
              <Controller
                name="accidentDetails.area"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || 'front'}
                    disabled={isLoading || isSubmitting}
                  >
                    <SelectTrigger id="accidentArea">
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="front">Front</SelectItem>
                      <SelectItem value="rear">Rear</SelectItem>
                      <SelectItem value="side">Side</SelectItem>
                      <SelectItem value="multiple">Multiple Areas</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </div>
      )}

      {isPremium && (
        <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
          <h3 className="text-sm font-medium mb-3">Vehicle Features</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {VEHICLE_FEATURES.map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={`feature-${feature}`}
                  checked={selectedFeatures.includes(feature)}
                  onCheckedChange={() => handleFeatureToggle(feature)}
                  disabled={isLoading || isSubmitting}
                />
                <Label htmlFor={`feature-${feature}`} className="cursor-pointer text-sm">
                  {feature}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || isSubmitting}
      >
        {isLoading || isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          submitButtonText
        )}
      </Button>
    </form>
  );
};

export default ManualEntryForm;
