import React, { useState, useCallback } from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ConditionCategory } from './ConditionCategory';
import { ConditionTips } from './ConditionTips';
import { ConditionValues } from './types';

// Define the schema for the condition evaluation form
const conditionEvaluationSchema = z.object({
  exterior: z.number().min(0).max(100).default(50),
  interior: z.number().min(0).max(100).default(50),
  mechanical: z.number().min(0).max(100).default(50),
  title: z.number().min(0).max(100).default(50),
  undercarriage: z.number().min(0).max(100).default(50),
});

// Make sure the onSubmit prop accepts just the values parameter
interface ConditionEvaluationFormProps {
  onSubmit: (values: ConditionValues) => void;
  onCancel?: () => void;
  initialValues?: Partial<ConditionValues>;
}

export const ConditionEvaluationForm: React.FC<ConditionEvaluationFormProps> = ({ onSubmit, onCancel, initialValues }) => {
  const [localOverallScore, setLocalOverallScore] = useState<number | null>(null);
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
    mode: "onChange"
  });

  // Access the values from the form state
  const values = form.watch();

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
      navigate('/premium');
    }
  };

  return (
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
  );
};
