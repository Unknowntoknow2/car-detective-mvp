
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ConditionLevel, ManualEntryFormData } from '@/components/lookup/types/manualEntry';
import ConditionSelectorBar from '@/components/common/ConditionSelectorBar';

// Form schema with validation
const formSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number()
    .min(1900, "Year must be at least 1900")
    .max(new Date().getFullYear() + 1, `Year cannot exceed ${new Date().getFullYear() + 1}`),
  mileage: z.coerce.number().min(0, "Mileage cannot be negative"),
  condition: z.nativeEnum(ConditionLevel),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Please enter a valid ZIP code"),
  transmission: z.string().optional(),
  fuelType: z.string().optional(),
  trim: z.string().optional(),
  bodyStyle: z.string().optional(),
  color: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const PremiumManualEntryForm: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      mileage: 0,
      condition: ConditionLevel.Good,
      zipCode: '',
      transmission: '',
      fuelType: '',
      trim: '',
      bodyStyle: '',
      color: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Convert form data to the format expected by the API
      const valuationData = {
        make: data.make,
        model: data.model,
        year: data.year,
        mileage: data.mileage,
        condition: data.condition,
        zipCode: data.zipCode,
        transmission: data.transmission || null,
        fuelType: data.fuelType || null,
        trim: data.trim || null,
        bodyType: data.bodyStyle || null,
        color: data.color || null,
        manual_entry: true,
        estimated_value: calculateEstimatedValue(data), // Simple placeholder calculation
      };
      
      // Insert into Supabase
      const { data: insertedData, error } = await supabase
        .from('valuations')
        .insert(valuationData)
        .select('id')
        .single();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Valuation Created",
        description: "Your vehicle valuation is ready to view.",
        variant: "success",
      });
      
      // Navigate to the valuation result page
      navigate(`/valuation/${insertedData.id}`);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create valuation",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simple placeholder function to calculate a basic value
  const calculateEstimatedValue = (data: FormValues): number => {
    // Base value determined by make/model/year
    let baseValue = 20000;
    
    // Adjust for mileage (simplified)
    const mileageAdjustment = Math.max(0, 1 - (data.mileage / 150000));
    
    // Adjust for condition
    let conditionMultiplier = 1.0;
    if (data.condition === ConditionLevel.Excellent) {
      conditionMultiplier = 1.1; // +10%
    } else if (data.condition === ConditionLevel.Good) {
      conditionMultiplier = 1.0; // baseline
    } else if (data.condition === ConditionLevel.Fair) {
      conditionMultiplier = 0.9; // -10%
    } else if (data.condition === ConditionLevel.Poor) {
      conditionMultiplier = 0.75; // -25%
    }
    
    return Math.round(baseValue * mileageAdjustment * conditionMultiplier);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Make & Model Fields */}
          <FormField
            control={form.control}
            name="make"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Make</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Toyota" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Camry" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Year & Mileage Fields */}
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="mileage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mileage</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* ZIP Code Field */}
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ZIP Code</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 90210" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Fuel Type Field */}
          <FormField
            control={form.control}
            name="fuelType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fuel Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="gasoline">Gasoline</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Condition Selector Field */}
        <FormField
          control={form.control}
          name="condition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Condition</FormLabel>
              <FormControl>
                <ConditionSelectorBar 
                  value={field.value} 
                  onChange={field.onChange} 
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Additional Fields (Optional) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="trim"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trim Level (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. SE, Limited" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="bodyStyle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Body Style (Optional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select body style" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sedan">Sedan</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="truck">Truck</SelectItem>
                    <SelectItem value="coupe">Coupe</SelectItem>
                    <SelectItem value="convertible">Convertible</SelectItem>
                    <SelectItem value="wagon">Wagon</SelectItem>
                    <SelectItem value="van">Van</SelectItem>
                    <SelectItem value="hatchback">Hatchback</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="transmission"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transmission (Optional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select transmission" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="automatic">Automatic</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="cvt">CVT</SelectItem>
                    <SelectItem value="dualClutch">Dual Clutch</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Submit Button */}
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full md:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Get Valuation'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default PremiumManualEntryForm;
