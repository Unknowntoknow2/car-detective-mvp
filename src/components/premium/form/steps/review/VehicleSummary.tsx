
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FormData } from '@/types/premium-valuation';

interface VehicleSummaryProps {
  formData: FormData;
}

interface SummaryField {
  label: string;
  value: string;
}

export function VehicleSummary({ formData }: VehicleSummaryProps) {
  const getSummaryFields = (): SummaryField[] => {
    const fields: (SummaryField | undefined)[] = [
      formData.identifierType && formData.vin ? { 
        label: 'Identification', 
        value: `${formData.identifierType.toUpperCase()}: ${formData.vin}` 
      } : undefined,
      { label: 'Vehicle', value: `${formData.make} ${formData.model} ${formData.year}` },
      { label: 'Mileage', value: formData.mileage ? `${formData.mileage.toLocaleString()} miles` : 'Not specified' },
      { label: 'Fuel Type', value: formData.fuelType || 'Not specified' },
      { label: 'Features', value: formData.features && formData.features.length ? `${formData.features.length} selected` : 'None selected' },
      { label: 'Condition', value: `${formData.conditionLabel || formData.condition} (${formData.conditionScore || 0}%)` },
      { label: 'Accident History', value: typeof formData.hasAccident === 'boolean' 
        ? (formData.hasAccident ? 'Yes' : 'No') 
        : (formData.hasAccident === 'yes' ? 'Yes' : 'No') 
      },
      formData.hasAccident === true || formData.hasAccident === 'yes' ? { 
        label: 'Accident Details', 
        value: formData.accidentDescription || 'Not provided' 
      } : undefined,
      { label: 'ZIP Code', value: formData.zipCode || 'Not specified' }
    ];

    return fields.filter((field): field is SummaryField => field !== undefined);
  };

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
