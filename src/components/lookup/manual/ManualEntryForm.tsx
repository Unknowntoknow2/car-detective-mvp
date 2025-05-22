import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ConditionLevel } from '@/components/lookup/types/manualEntry';
import { cn } from '@/lib/utils';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';
import { toast } from 'sonner';
import { useValuation } from '@/hooks/useValuation';
import { useToast } from '@/components/ui/use-toast';
import { useMobile } from '@/hooks/use-mobile';
import { useSearchParams } from 'react-router-dom';

const formSchema = z.object({
  make: z.string().min(2, { message: "Make must be at least 2 characters." }),
  model: z.string().min(2, { message: "Model must be at least 2 characters." }),
  year: z.number().min(1900, { message: "Invalid year" }).max(new Date().getFullYear(), { message: "Invalid year" }),
  mileage: z.number().optional(),
  condition: z.nativeEnum(ConditionLevel, {
    invalid_type_error: "Please select a valid condition.",
  }),
  zipCode: z.string().optional(),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  trim: z.string().optional(),
  color: z.string().optional(),
  bodyType: z.string().optional(),
  vin: z.string().optional(),
});

export function ManualEntryForm() {
  const [searchParams] = useSearchParams();
  const isPremiumFlow = searchParams.get('flow') === 'premium';
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useMobile();
  const {
    isLoading,
    valuation,
    error,
    submitManualEntryForm,
    resetValuation,
  } = useValuation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      condition: ConditionLevel.Good,
    },
    mode: "onChange"
  });

  useEffect(() => {
    resetValuation();
  }, [resetValuation]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formattedData: ManualEntryFormData = {
        ...values,
        mileage: values.mileage || undefined,
        zipCode: values.zipCode || undefined,
        fuelType: values.fuelType || undefined,
        transmission: values.transmission || undefined,
        trim: values.trim || undefined,
        color: values.color || undefined,
        bodyType: values.bodyType || undefined,
        vin: values.vin || undefined,
        condition: values.condition || ConditionLevel.Good,
        isPremium: isPremiumFlow,
      };

      // In the part where formattedData.mileage is being accessed, add a null check:
      const mileageFormatted = formattedData.mileage ? formattedData.mileage.toLocaleString() : 'N/A';

      await submitManualEntryForm(formattedData);

      if (valuation) {
        toast({
          title: "Valuation Generated",
          description: "Successfully generated valuation.",
        });

        navigate(`/result?valuationId=${valuation.valuationId}&isPremium=${isPremiumFlow}`);
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate valuation.",
      });
      console.error(err);
    }
  };

  return (
    <Card className={cn("w-full", isMobile ? "border-0 shadow-none" : "")}>
      <CardHeader>
        <CardTitle>Manual Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="make"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Make</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Toyota" {...field} />
                  </FormControl>
                  <FormDescription>
                    What is the make of your vehicle?
                  </FormDescription>
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
                    <Input placeholder="e.g., Camry" {...field} />
                  </FormControl>
                  <FormDescription>
                    What is the model of your vehicle?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 2015"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What year was your vehicle manufactured?
                  </FormDescription>
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
                    <Input
                      type="number"
                      placeholder="e.g., 60000"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What is the mileage of your vehicle?
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
                  <FormLabel>Condition</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a condition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={ConditionLevel.Excellent}>Excellent</SelectItem>
                      <SelectItem value={ConditionLevel.VeryGood}>Very Good</SelectItem>
                      <SelectItem value={ConditionLevel.Good}>Good</SelectItem>
                      <SelectItem value={ConditionLevel.Fair}>Fair</SelectItem>
                      <SelectItem value={ConditionLevel.Poor}>Poor</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    What is the condition of your vehicle?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              Submit
            </Button>
            {error && (
              <div className="text-red-500">{error}</div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
