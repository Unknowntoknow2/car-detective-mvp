
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BasicVehicleForm } from './form-parts/BasicVehicleForm';
import { UnifiedFollowUpQuestions } from './form-parts/UnifiedFollowUpQuestions';
import { ManualEntryFormData, ConditionLevel } from './types/manualEntry';
import { Loader2 } from 'lucide-react';

interface ManualEntryFormFreeProps {
  onSubmit: (data: ManualEntryFormData) => void;
  isLoading?: boolean;
  submitButtonText?: string;
  isPremium?: boolean;
}

export function ManualEntryFormFree({
  onSubmit,
  isLoading = false,
  submitButtonText = "Get Valuation",
  isPremium = false
}: ManualEntryFormFreeProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'details'>('basic');
  const [formData, setFormData] = useState<ManualEntryFormData>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: 0,
    condition: ConditionLevel.Good,
    zipCode: '',
    fuelType: 'gasoline',
    transmission: 'automatic',
    selectedFeatures: [],
    // Follow-up question defaults
    titleStatus: 'clean',
    previousOwners: 1,
    previousUse: 'personal',
    serviceHistory: 'unknown',
    hasRegularMaintenance: null,
    maintenanceNotes: '',
    accidentDetails: {
      hasAccident: false,
      severity: 'minor',
      repaired: false,
      description: ''
    },
    tireCondition: 'good',
    dashboardLights: [],
    hasModifications: false,
    modificationTypes: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (updates: Partial<ManualEntryFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    
    // Clear errors for updated fields
    const updatedFields = Object.keys(updates);
    const newErrors = { ...errors };
    updatedFields.forEach(field => {
      delete newErrors[field];
    });
    setErrors(newErrors);
  };

  const validateBasicForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.make.trim()) {
      newErrors.make = 'Make is required';
    }
    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    }
    if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'Please enter a valid year';
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'ZIP code must be 5 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBasicNext = () => {
    if (validateBasicForm()) {
      setActiveTab('details');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'basic') {
      handleBasicNext();
      return;
    }

    if (validateBasicForm()) {
      onSubmit(formData);
    }
  };

  const canProceedToDetails = formData.make && formData.model && formData.year && formData.zipCode;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Vehicle Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'basic' | 'details')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="details" disabled={!canProceedToDetails}>
                Additional Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="mt-6">
              <BasicVehicleForm
                formData={formData}
                updateFormData={updateFormData}
                errors={errors}
                isPremium={isPremium}
              />
              
              <div className="mt-6 flex justify-end">
                <Button 
                  type="button"
                  onClick={handleBasicNext}
                  disabled={!canProceedToDetails}
                >
                  Next: Additional Details
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="details" className="mt-6">
              <UnifiedFollowUpQuestions
                formData={formData}
                updateFormData={updateFormData}
              />
              
              <div className="mt-8 flex justify-between">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab('basic')}
                >
                  Back
                </Button>
                
                <Button 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    submitButtonText
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </CardContent>
    </Card>
  );
}
