
import React from 'react';
import { AccidentFactorCard } from './AccidentFactorCard';
import { MileageFactorCard } from './MileageFactorCard';
import { YearFactorCard } from './YearFactorCard';
import { ConditionValues } from '../types';

interface ValuationFactorsGridProps {
  values: ConditionValues;
  onChange: (id: string, value: number) => void;
}

export function ValuationFactorsGrid({ values, onChange }: ValuationFactorsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <AccidentFactorCard 
        value={values.accidents || 0} 
        onChange={(value) => onChange('accidents', value)} 
      />
      <MileageFactorCard 
        value={values.mileage || 0} 
        onChange={(value) => onChange('mileage', value)} 
      />
      <YearFactorCard 
        value={values.year || 0} 
        onChange={(value) => onChange('year', value)} 
      />
    </div>
  );
}
