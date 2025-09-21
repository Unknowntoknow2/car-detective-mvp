
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import MakeAndModelSelector from "@/components/lookup/form-parts/MakeAndModelSelector";
import { ZipCodeInput } from "@/components/common/ZipCodeInput";
import { ConditionLevel } from "@/components/lookup/ConditionSelectorSegmented";
// Removed manual entry dependency

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
  const [selectedMakeId, setSelectedMakeId] = useState("");
  const [selectedModelId, setSelectedModelId] = useState("");

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

  const { setValue, register } = form;

  const onSubmit = async (data: PremiumValuationFormData) => {
    setIsSubmitting(true);
    try {
      toast.success("Valuation request submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit valuation request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <MakeAndModelSelector
          makeId={selectedMakeId}
          setMakeId={(makeId: string) => {
            setSelectedMakeId(makeId);
            setValue("make", makeId);
          }}
          modelId={selectedModelId}
          setModelId={(modelId: string) => {
            setSelectedModelId(modelId);
            setValue("model", modelId);
          }}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="2020"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
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
                  <Input 
                    type="number" 
                    placeholder="50000"
                    {...register("mileage", { valueAsNumber: true })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ZIP Code</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter ZIP code"
                  maxLength={5}
                  {...register("zipCode", { required: "ZIP code is required" })}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="vin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>VIN (Optional)</FormLabel>
              <FormControl>
                <Input 
                  type="text" 
                  placeholder="Enter VIN"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
