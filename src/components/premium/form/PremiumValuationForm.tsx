<<<<<<< HEAD

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FormErrorBoundary } from '@/components/premium/common/FormErrorBoundary';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ZipCodeField } from '@/components/premium/lookup/form-parts/fields/ZipCodeField';
import { BasicVehicleInfo } from '@/components/premium/lookup/form-parts/BasicVehicleInfo';
import { ConditionInput } from '@/components/premium/lookup/form-parts/ConditionInput';
import { AccidentSection } from '@/components/premium/lookup/form-parts/AccidentSection';
import { ConditionLevel } from '@/components/lookup/types/manualEntry';
import { SubmitButton } from '@/components/premium/lookup/form-parts/SubmitButton';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { toast } from 'sonner';

interface PremiumValuationFormProps {
  onSubmit?: (data: any) => void;
}

const PremiumValuationForm: React.FC<PremiumValuationFormProps> = ({ onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { showPremiumUpsell } = useFeatureFlags();
  
  // Form state
  const [selectedMakeId, setSelectedMakeId] = React.useState('');
  const [selectedModel, setSelectedModel] = React.useState('');
  const [selectedYear, setSelectedYear] = React.useState<number | string>('');
  const [mileage, setMileage] = React.useState('');
  const [zipCode, setZipCode] = React.useState('');
  const [condition, setCondition] = React.useState<ConditionLevel>(ConditionLevel.Good);
  const [hasAccident, setHasAccident] = React.useState('no');
  const [accidentDescription, setAccidentDescription] = React.useState('');
  
  // Form validation
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  
  // Create form for the components that require it
  const form = useForm({
    defaultValues: {
      zipCode: '',
    },
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    
    if (!selectedMakeId) newErrors.make = 'Please select a make';
    if (!selectedModel) newErrors.model = 'Please select a model';
    if (!selectedYear) newErrors.year = 'Please select a year';
    if (!mileage) newErrors.mileage = 'Please enter mileage';
    if (zipCode && !/^\d{5}$/.test(zipCode)) newErrors.zipCode = 'Please enter a valid 5-digit ZIP code';
    if (hasAccident === 'yes' && !accidentDescription) newErrors.accidentDescription = 'Please describe the accident';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Clear errors
    setErrors({});
    setIsSubmitting(true);
    
    // Create submission data
    const formData = {
      make: selectedMakeId,
      model: selectedModel,
      year: selectedYear,
      mileage: parseInt(mileage, 10),
      zipCode,
      condition,
      hasAccident: hasAccident === 'yes',
      accidentDescription: hasAccident === 'yes' ? accidentDescription : '',
    };
    
    // Submit the form
    if (onSubmit) {
      onSubmit(formData);
    } else {
      // Demo mode - show toast
      setTimeout(() => {
        setIsSubmitting(false);
        toast.success('Premium valuation request submitted successfully!');
      }, 1500);
    }
=======
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function PremiumValuationForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    mileage: "",
    condition: "",
    zipCode: "",
    features: [] as string[],
    photos: [] as File[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    setLoading(true);

    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      toast.success(
        "Your premium valuation request has been submitted successfully!",
      );
      // Reset form or redirect
    }, 2000);
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  };

  return (
<<<<<<< HEAD
    <FormErrorBoundary>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Premium Vehicle Valuation</CardTitle>
          <CardDescription>
            Get a comprehensive valuation with detailed market analysis and comparable sales data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <Form {...form}>
              <div className="space-y-8">
                <BasicVehicleInfo
                  selectedMakeId={selectedMakeId}
                  setSelectedMakeId={setSelectedMakeId}
                  selectedModel={selectedModel}
                  setSelectedModel={setSelectedModel}
                  selectedYear={selectedYear}
                  setSelectedYear={setSelectedYear}
                  mileage={mileage}
                  setMileage={setMileage}
                  zipCode={zipCode}
                  setZipCode={setZipCode}
                  isDisabled={isSubmitting}
                  errors={errors}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <ConditionInput 
                      condition={condition}
                      setCondition={setCondition}
                    />
                  </div>
                  
                  <div>
                    <AccidentSection
                      hasAccident={hasAccident}
                      setHasAccident={setHasAccident}
                      accidentDescription={accidentDescription}
                      setAccidentDescription={setAccidentDescription}
                      isDisabled={isSubmitting}
                      error={errors.accidentDescription}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mt-8">
                  <SubmitButton 
                    isLoading={isSubmitting} 
                    text="Get Premium Valuation"
                    loadingText="Processing..."
                  />
                </div>
              </div>
            </Form>
          </form>
        </CardContent>
      </Card>
    </FormErrorBoundary>
=======
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Premium Valuation Form</CardTitle>
        <CardDescription>
          Complete all steps to get your comprehensive vehicle valuation
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1">
              <div
                className={`h-2 rounded-full mx-1 ${
                  i === step
                    ? "bg-primary"
                    : i < step
                    ? "bg-primary/70"
                    : "bg-gray-200"
                }`}
              />
              <p
                className={`text-xs mt-1 text-center ${
                  i === step
                    ? "text-primary font-medium"
                    : i < step
                    ? "text-primary/70"
                    : "text-gray-500"
                }`}
              >
                Step {i}
              </p>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Vehicle Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make">Make</Label>
                <Input
                  id="make"
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
                  placeholder="e.g., Toyota"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="e.g., Camry"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="e.g., 2020"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mileage">Mileage</Label>
                <Input
                  id="mileage"
                  name="mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={handleChange}
                  placeholder="e.g., 45000"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Vehicle Condition & Location
            </h3>

            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("condition", value)}
                value={formData.condition}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="e.g., 90210"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Review & Submit</h3>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-3">Vehicle Details</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Make:</p>
                  <p className="font-medium">
                    {formData.make || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Model:</p>
                  <p className="font-medium">
                    {formData.model || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Year:</p>
                  <p className="font-medium">
                    {formData.year || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Mileage:</p>
                  <p className="font-medium">
                    {formData.mileage || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Condition:</p>
                  <p className="font-medium capitalize">
                    {formData.condition || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">ZIP Code:</p>
                  <p className="font-medium">
                    {formData.zipCode || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
              <p className="font-medium">Your premium valuation includes:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Complete CARFAX® vehicle history report</li>
                <li>Market analysis with similar vehicles</li>
                <li>Dealer offers from your area</li>
                <li>12-month value prediction</li>
                <li>Professional PDF report</li>
              </ul>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          {step > 1
            ? (
              <Button type="button" variant="outline" onClick={prevStep}>
                Previous
              </Button>
            )
            : <div></div>}

          <Button
            type="button"
            onClick={nextStep}
            disabled={loading}
          >
            {loading ? "Processing..." : step < 3 ? "Next" : "Submit Valuation"}
          </Button>
        </div>
      </CardContent>
    </Card>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  );
};

export default PremiumValuationForm;
