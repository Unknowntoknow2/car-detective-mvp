
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { VehicleDetailsInputs } from '@/components/lookup/form-parts/VehicleDetailsInputs';
import { YearMileageInputs } from '@/components/lookup/form-parts/fields/YearMileageInputs';

export function PremiumManualLookup() {
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedModelId, setSelectedModelId] = useState('');
  const [selectedTrim, setSelectedTrim] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number | ''>('');
  const [mileage, setMileage] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation would go here
    console.log('Submitting form with:', { make, model, year, mileage, zipCode, trim: selectedTrim });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Manual Vehicle Entry</h2>
        <p className="text-muted-foreground">
          Enter your vehicle details to get a premium valuation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Make and Model Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="make" className="text-sm font-medium text-slate-700">
              Make <span className="text-red-500">*</span>
            </Label>
            <Input
              id="make"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              placeholder="e.g. Toyota"
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model" className="text-sm font-medium text-slate-700">
              Model <span className="text-red-500">*</span>
            </Label>
            <Input
              id="model"
              value={model}
              onChange={(e) => {
                setModel(e.target.value);
                setSelectedModel(e.target.value);
                setSelectedModelId(e.target.value);
              }}
              placeholder="e.g. Camry"
              className="h-10"
            />
          </div>
        </div>

        {/* Year and Mileage Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <YearMileageInputs
            selectedYear={year}
            setSelectedYear={setYear}
            mileage={mileage}
            setMileage={setMileage}
            errors={errors}
          />
        </div>

        {/* Additional Vehicle Details */}
        <VehicleDetailsInputs
          selectedModel={selectedModel}
          selectedModelId={selectedModelId}
          selectedTrim={selectedTrim}
          setSelectedTrim={setSelectedTrim}
          errors={errors}
        />

        {/* ZIP Code Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="zipCode" className="text-sm font-medium text-slate-700">
              ZIP Code <span className="text-red-500">*</span>
            </Label>
            <Input
              id="zipCode"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="e.g. 90210"
              maxLength={10}
              className="h-10"
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full md:w-auto">
          Get Premium Valuation
        </Button>
      </form>
    </div>
  );
}
