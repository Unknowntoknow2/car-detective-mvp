<<<<<<< HEAD

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ValuationFactorsGrid } from './factors/ValuationFactorsGrid';
import { ConditionValues } from './types';
=======
import React, { useCallback, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ConditionCategory } from "./ConditionCategory";
import { ConditionTips } from "./ConditionTips";
import { ConditionValues } from "./types";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

export interface ConditionEvaluationFormProps {
  initialValues?: Partial<ConditionValues>;
  vehicleInfo?: {
    year: number;
    make: string;
    model: string;
    vin?: string;
  };
  onSubmit?: (values: ConditionValues) => void;
  onCancel?: () => void;
}

<<<<<<< HEAD
export const ConditionEvaluationForm: React.FC<ConditionEvaluationFormProps> = ({
  initialValues,
  vehicleInfo,
  onSubmit,
  onCancel
}) => {
  const [values, setValues] = useState<ConditionValues>({
    exteriorBody: initialValues?.exteriorBody || '',
    exteriorPaint: initialValues?.exteriorPaint || '',
    interiorSeats: initialValues?.interiorSeats || '',
    interiorDashboard: initialValues?.interiorDashboard || '',
    mechanicalEngine: initialValues?.mechanicalEngine || '',
    mechanicalTransmission: initialValues?.mechanicalTransmission || '',
    tiresCondition: initialValues?.tiresCondition || '',
    odometer: initialValues?.odometer || 0,
    accidents: initialValues?.accidents || 0,
    mileage: initialValues?.mileage || 0,
    year: initialValues?.year || 0,
    titleStatus: initialValues?.titleStatus || 'Clean',
    zipCode: initialValues?.zipCode || ''
=======
export const ConditionEvaluationForm: React.FC<ConditionEvaluationFormProps> = (
  { onSubmit, onCancel, initialValues },
) => {
  const [localOverallScore, setLocalOverallScore] = useState<number | null>(
    null,
  );
  const navigate = useNavigate();

  // Initialize the form with useForm
  const form = useForm<ConditionValues>({
    resolver: zodResolver(conditionEvaluationSchema),
    defaultValues: initialValues || {
      exterior: 50,
      interior: 50,
      mechanical: 50,
      title: 50,
      undercarriage: 50,
    },
    mode: "onChange",
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  });

  // Create form methods to provide context
  const formMethods = useForm();

<<<<<<< HEAD
  const handleChange = (id: string, value: any) => {
    setValues(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(values);
=======
  // Function to handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate average score from all category scores
    const categories = Object.keys(values);
    const overallScore = categories.reduce((sum, key) => {
      return sum + values[key as keyof ConditionValues];
    }, 0) / categories.length;

    // Store the overall score if needed
    setLocalOverallScore(overallScore);

    // Only pass the values to the parent component
    onSubmit(values);
  };

  // Handle cancel operation
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/premium");
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    }
  };

  return (
<<<<<<< HEAD
    <FormProvider {...formMethods}>
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Condition Evaluation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {vehicleInfo && (
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h3 className="text-lg font-medium">
                  {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
                </h3>
                {vehicleInfo.vin && (
                  <p className="text-sm text-gray-500 mt-1">VIN: {vehicleInfo.vin}</p>
                )}
              </div>
            )}

            <ValuationFactorsGrid 
              values={values}
              onChange={handleChange}
            />

            <div className="mt-6 flex justify-end space-x-2">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit">
                Submit Evaluation
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </FormProvider>
=======
    <Form {...form}>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Condition Assessment</CardTitle>
            <CardDescription>
              Evaluate the condition of your vehicle in each category.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <ConditionCategory
              name="exterior"
              label="Exterior"
              form={form}
              description="Rate the condition of the vehicle's exterior, including paint, body panels, glass, and trim."
            />
            <ConditionCategory
              name="interior"
              label="Interior"
              form={form}
              description="Rate the condition of the vehicle's interior, including seats, carpets, dashboard, and controls."
            />
            <ConditionCategory
              name="mechanical"
              label="Mechanical"
              form={form}
              description="Rate the condition of the vehicle's mechanical components, including engine, transmission, brakes, and suspension."
            />
            <ConditionCategory
              name="title"
              label="Title"
              form={form}
              description="Rate the condition of the vehicle's title, considering factors such as liens, salvage history, and accuracy."
            />
            <ConditionCategory
              name="undercarriage"
              label="Undercarriage"
              form={form}
              description="Rate the condition of the vehicle's undercarriage, including frame, exhaust, and suspension components."
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Submit Condition
            </Button>
          </CardFooter>
        </Card>
        <ConditionTips />
      </form>
    </Form>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  );
};

export default ConditionEvaluationForm;
