
import React from 'react';
import { useSearchParams } from 'react-router-dom';
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
  titleStatus: 'Clean',
  odometer: 0,
  zipCode: '90210' // Add zipCode
};

export default function ResultPage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  
  // Mock data for example
  const mockData = {
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    mileage: 35000,
    accidents: 0,
    condition: 'Good',
    estimatedValue: 18500
  };
  
  return (
    <div className="container mx-auto py-8">
      <ValuationResult 
        valuationId={id || undefined} 
        data={mockData}
      />
    </div>
  );
}
