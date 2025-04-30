
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FormData } from '@/types/premium-valuation';

interface VehicleSummaryProps {
  formData: FormData;
}

export function VehicleSummary({ formData }: VehicleSummaryProps) {
  const getSummaryFields = () => [
    formData.identifierType && formData.identifier && { 
      label: 'Identification', 
      value: `${formData.identifierType.toUpperCase()}: ${formData.identifier}` 
    },
    { label: 'Vehicle', value: `${formData.make} ${formData.model} ${formData.year}` },
    { label: 'Mileage', value: formData.mileage ? `${formData.mileage.toLocaleString()} miles` : 'Not specified' },
    { label: 'Fuel Type', value: formData.fuelType || 'Not specified' },
    { label: 'Features', value: formData.features && formData.features.length ? `${formData.features.length} selected` : 'None selected' },
    { label: 'Condition', value: `${formData.conditionLabel} (${formData.condition}%)` },
    { label: 'Accident History', value: formData.hasAccident ? 'Yes' : 'No' },
    formData.hasAccident && { label: 'Accident Details', value: formData.accidentDescription },
    { label: 'ZIP Code', value: formData.zipCode || 'Not specified' }
  ].filter(Boolean);

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardContent className="p-6">
        <div className="grid gap-4">
          {getSummaryFields().map((field, index) => (
            <div key={index} className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0">
              <span className="text-gray-600 font-medium">{field.label}:</span>
              <span className="text-right font-medium text-gray-800">{field.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
