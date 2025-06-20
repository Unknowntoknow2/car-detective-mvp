
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUnifiedLookup } from "@/hooks/useUnifiedLookup";
import { MAKES, TRANSMISSION_TYPES, FUEL_TYPES, CONDITION_OPTIONS } from "@/lib/constants";

interface ManualEntryFormProps {
  onSubmit: (data: any) => void;
  tier: "free" | "premium";
}

export function ManualEntryForm({ onSubmit, tier }: ManualEntryFormProps) {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    mileage: '',
    condition: '',
    zipCode: '',
    trim: '',
    fuelType: '',
    transmission: ''
  });

  const { processManualEntry, isLoading } = useUnifiedLookup({ tier });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = processManualEntry({
      ...formData,
      year: parseInt(formData.year),
      mileage: formData.mileage ? parseInt(formData.mileage) : undefined
    });
    
    if (result && result.success) {
      onSubmit(formData);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="make">Make *</Label>
          <Select value={formData.make} onValueChange={(value) => updateField('make', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select make" />
            </SelectTrigger>
            <SelectContent>
              {MAKES.map((make) => (
                <SelectItem key={make} value={make}>
                  {make}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="model">Model *</Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) => updateField('model', e.target.value)}
            placeholder="Enter model"
            required
          />
        </div>

        <div>
          <Label htmlFor="year">Year *</Label>
          <Select value={formData.year} onValueChange={(value) => updateField('year', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="mileage">Mileage</Label>
          <Input
            id="mileage"
            type="number"
            value={formData.mileage}
            onChange={(e) => updateField('mileage', e.target.value)}
            placeholder="Enter mileage"
          />
        </div>

        <div>
          <Label htmlFor="condition">Condition *</Label>
          <Select value={formData.condition} onValueChange={(value) => updateField('condition', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              {CONDITION_OPTIONS.map((condition) => (
                <SelectItem key={condition} value={condition.toLowerCase()}>
                  {condition}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="zipCode">ZIP Code *</Label>
          <Input
            id="zipCode"
            value={formData.zipCode}
            onChange={(e) => updateField('zipCode', e.target.value)}
            placeholder="Enter ZIP code"
            required
          />
        </div>

        {tier === "premium" && (
          <>
            <div>
              <Label htmlFor="trim">Trim</Label>
              <Input
                id="trim"
                value={formData.trim}
                onChange={(e) => updateField('trim', e.target.value)}
                placeholder="Enter trim level"
              />
            </div>

            <div>
              <Label htmlFor="fuelType">Fuel Type</Label>
              <Select value={formData.fuelType} onValueChange={(value) => updateField('fuelType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  {FUEL_TYPES.map((fuel) => (
                    <SelectItem key={fuel} value={fuel.toLowerCase()}>
                      {fuel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="transmission">Transmission</Label>
              <Select value={formData.transmission} onValueChange={(value) => updateField('transmission', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  {TRANSMISSION_TYPES.map((trans) => (
                    <SelectItem key={trans} value={trans.toLowerCase()}>
                      {trans}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={!formData.make || !formData.model || !formData.year || !formData.condition || !formData.zipCode || isLoading}
      >
        {isLoading ? "Processing..." : tier === "premium" ? "Get Premium Valuation" : "Get Free Valuation"}
      </Button>
    </form>
  );
}
