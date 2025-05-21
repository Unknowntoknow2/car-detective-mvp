
import React from 'react';
import { AccidentFactorCard } from './AccidentFactorCard';
import { MileageFactorCard } from './MileageFactorCard';
import { YearFactorCard } from './YearFactorCard';
import { TitleStatusFactorCard } from './TitleStatusFactorCard';
import { ConditionValues } from '../types';

interface ValuationFactorsGridProps {
  values: ConditionValues;
  onChange: (id: string, value: any) => void;
}

export function ValuationFactorsGrid({ values, onChange }: ValuationFactorsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <AccidentFactorCard 
        value={Number(values.accidents) || 0} 
        onChange={(value) => onChange('accidents', value)} 
      />
      <MileageFactorCard 
        value={Number(values.mileage) || 0} 
        onChange={(value) => onChange('mileage', value)} 
      />
      <YearFactorCard 
        value={Number(values.year) || 0} 
        onChange={(value) => onChange('year', value)} 
      />
      <TitleStatusFactorCard 
        value={values.titleStatus || 'Clean'} 
        onChange={(value) => onChange('titleStatus', value)} 
      />
    </div>
  );
}
