import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface ValuationFactors {
  accidents: number;
  mileage: number;
  year: number;
  titleStatus: string;
}

export interface ValuationFactorsGridProps {
  values: ValuationFactors;
  onChange: (id: keyof ValuationFactors, value: any) => void;
}

export const ValuationFactorsGrid: React.FC<ValuationFactorsGridProps> = ({
  values,
  onChange,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <Label htmlFor="accidents">Accidents Reported</Label>
        <Input
          id="accidents"
          type="number"
          value={values.accidents}
          onChange={(e) => onChange('accidents', parseInt(e.target.value))}
        />
      </div>
      <div>
        <Label htmlFor="mileage">Mileage</Label>
        <Input
          id="mileage"
          type="number"
          value={values.mileage}
          onChange={(e) => onChange('mileage', parseInt(e.target.value))}
        />
      </div>
      <div>
        <Label htmlFor="year">Year</Label>
        <Input
          id="year"
          type="number"
          value={values.year}
          onChange={(e) => onChange('year', parseInt(e.target.value))}
        />
      </div>
      <div>
        <Label htmlFor="titleStatus">Title Status</Label>
        <Input
          id="titleStatus"
          type="text"
          value={values.titleStatus}
          onChange={(e) => onChange('titleStatus', e.target.value)}
        />
      </div>
    </div>
  );
};

export default ValuationFactorsGrid;
