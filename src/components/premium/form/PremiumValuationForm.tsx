
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { AutoCompleteVehicleSelector } from "@/components/lookup/form-parts/AutoCompleteVehicleSelector";
import { VehicleBasicInfoFields } from "@/components/lookup/manual/components/VehicleBasicInfoFields";
import { ConditionAndZipFields } from "@/components/lookup/manual/components/ConditionAndZipFields";
import { VehicleDetailsFields } from "@/components/lookup/manual/components/VehicleDetailsFields";
import { VinInputField } from "@/components/lookup/manual/components/VinInputField";
import { ConditionLevel } from "@/components/lookup/types/manualEntry";

const premiumValuationSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  mileage: z.number().min(0),
  condition: z.nativeEnum(ConditionLevel),
  zipCode: z.string().min(5, "Valid ZIP code required"),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  bodyStyle: z.string().optional(),
  color: z.string().optional(),
  vin: z.string().optional(),
});

type PremiumValuationFormData = z.infer<typeof premiumValuationSchema>;

const conditionOptions = [
  { value: ConditionLevel.Excellent, label: "Excellent" },
  { value: ConditionLevel.VeryGood, label: "Very Good" },
  { value: ConditionLevel.Good, label: "Good" },
  { value: ConditionLevel.Fair, label: "Fair" },
  { value: ConditionLevel.Poor, label: "Poor" },
];

export function PremiumValuationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PremiumValuationFormData>({
    resolver: zodResolver(premiumValuationSchema),
    defaultValues: {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      mileage: 0,
      condition: ConditionLevel.Good,
      zipCode: "",
      fuelType: "",
      transmission: "",
      bodyStyle: "",
      color: "",
      vin: "",
    },
  });

  const onSubmit = async (data: PremiumValuationFormData) => {
    setIsSubmitting(true);
    try {
      console.log("Premium valuation form submitted:", data);
      toast.success("Valuation request submitted successfully!");
      
      // Here you would typically send the data to your backend
      // For now, we'll just log it and show success
      
    } catch (error) {
      console.error("Error submitting valuation:", error);
      toast.error("Failed to submit valuation request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <AutoCompleteVehicleSelector form={form} />
        
        <VehicleBasicInfoFields form={form} />
        
        <ConditionAndZipFields 
          form={form} 
          conditionOptions={conditionOptions}
        />
        
        <VehicleDetailsFields form={form} />
        
        <VinInputField form={form} />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Get Premium Valuation"}
        </Button>
      </form>
    </Form>
  );
}
