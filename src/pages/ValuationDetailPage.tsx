
import React from 'react';
import { useParams } from 'react-router-dom';
import { ValuationResult } from '@/components/valuation/ValuationResult';
import { ConditionValues } from '@/components/valuation/condition/types';

// Update the condition values to include all required properties with correct types
const conditionValues: ConditionValues = {
  exteriorBody: "4",
  exteriorPaint: "4",
  interiorSeats: "4",
  interiorDashboard: "4",
  mechanicalEngine: "4",
  mechanicalTransmission: "4",
  tiresCondition: "4",
  accidents: 0,
  mileage: 0,
  year: 0,
  titleStatus: 'Clean'
};

export default function ValuationDetailPage() {
  const { id } = useParams<{ id: string }>();
  
  // Mock item for example
  const mockItem = {
    make: 'Honda',
    model: 'Accord',
    year: 2019,
    mileage: 42000,
    accidents: 0,
    condition: 'Excellent',
    estimatedValue: 19500
  };
  
  return (
    <div className="container mx-auto py-8">
      <ValuationResult 
        valuationId={id} 
        data={mockItem}
      />
    </div>
  );
}
