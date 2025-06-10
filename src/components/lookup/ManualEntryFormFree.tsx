
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ManualEntryFormData, ConditionLevel } from '@/types/manualEntry';
import { AccidentDetailsForm } from './form-parts/AccidentDetailsForm';

interface ManualEntryFormFreeProps {
  formData: ManualEntryFormData;
  updateFormData: (updates: Partial<ManualEntryFormData>) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  submitButtonText?: string;
  isPremium?: boolean;
}

export function ManualEntryFormFree({
  formData,
  updateFormData,
  onSubmit,
  isLoading = false,
  submitButtonText = "Get Valuation",
  isPremium = false,
}: ManualEntryFormFreeProps) {
  const [activeTab, setActiveTab] = useState("details");

  const handleMakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ make: e.target.value });
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ model: e.target.value });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const year = parseInt(e.target.value);
    updateFormData({ year: isNaN(year) ? new Date().getFullYear() : year });
  };

  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const mileage = parseInt(e.target.value);
    updateFormData({ mileage: isNaN(mileage) ? 0 : mileage });
  };

  const handleConditionChange = (value: string) => {
    updateFormData({ condition: value });
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ zipCode: e.target.value });
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="details">Vehicle Details</TabsTrigger>
        {isPremium && (
          <TabsTrigger value="questions">
            Follow-up Questions
          </TabsTrigger>
        )}
      </TabsList>
      <TabsContent value="details" className="space-y-4">
        <div>
          <Label htmlFor="make">Make</Label>
          <Input
            type="text"
            id="make"
            value={formData.make || ''}
            onChange={handleMakeChange}
            placeholder="Enter make"
          />
        </div>
        <div>
          <Label htmlFor="model">Model</Label>
          <Input
            type="text"
            id="model"
            value={formData.model || ''}
            onChange={handleModelChange}
            placeholder="Enter model"
          />
        </div>
        <div>
          <Label htmlFor="year">Year</Label>
          <Input
            type="number"
            id="year"
            value={formData.year || new Date().getFullYear()}
            onChange={handleYearChange}
            placeholder="Enter year"
          />
        </div>
        <div>
          <Label htmlFor="mileage">Mileage</Label>
          <Input
            type="number"
            id="mileage"
            value={formData.mileage || 0}
            onChange={handleMileageChange}
            placeholder="Enter mileage"
          />
        </div>
        <div>
          <Label htmlFor="condition">Condition</Label>
          <Select value={formData.condition || ConditionLevel.Good} onValueChange={handleConditionChange}>
            <SelectTrigger id="condition">
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ConditionLevel.Excellent}>Excellent</SelectItem>
              <SelectItem value={ConditionLevel.Good}>Good</SelectItem>
              <SelectItem value={ConditionLevel.Fair}>Fair</SelectItem>
              <SelectItem value={ConditionLevel.Poor}>Poor</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            type="number"
            id="zipCode"
            value={formData.zipCode || ''}
            onChange={handleZipCodeChange}
            placeholder="Enter ZIP code"
          />
        </div>

        <AccidentDetailsForm
          accidentCount={formData.accidentDetails?.count}
          accidentLocation={formData.accidentDetails?.location}
          accidentSeverity={formData.accidentDetails?.severity}
          accidentDescription={formData.accidentDetails?.description}
          onAccidentCountChange={(count) => updateFormData({ 
            accidentDetails: { 
              ...formData.accidentDetails, 
              hadAccident: count !== undefined && count > 0,
              severity: formData.accidentDetails?.severity || 'minor',
              count 
            } 
          })}
          onAccidentLocationChange={(location) => updateFormData({ 
            accidentDetails: { 
              ...formData.accidentDetails, 
              hadAccident: formData.accidentDetails?.hadAccident || false,
              severity: formData.accidentDetails?.severity || 'minor',
              location 
            } 
          })}
          onAccidentSeverityChange={(severity) => updateFormData({ 
            accidentDetails: { 
              ...formData.accidentDetails, 
              hadAccident: formData.accidentDetails?.hadAccident || false,
              severity: severity as 'minor' | 'moderate' | 'severe'
            } 
          })}
          onAccidentDescriptionChange={(description) => updateFormData({ 
            accidentDetails: { 
              ...formData.accidentDetails, 
              hadAccident: formData.accidentDetails?.hadAccident || false,
              severity: formData.accidentDetails?.severity || 'minor',
              description 
            } 
          })}
        />
      </TabsContent>
    </Tabs>
  );
}
