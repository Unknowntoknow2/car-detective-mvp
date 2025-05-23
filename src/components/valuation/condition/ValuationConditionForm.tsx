import React from 'react';
import { ConditionValues } from '../types'; // ✅ FIXED path
import { ValuationFactorPaint } from './factors/ValuationFactorPaint';
import { ValuationFactorTires } from './factors/ValuationFactorTires';
import { ValuationFactorInterior } from './factors/ValuationFactorInterior';
import { ValuationFactorExterior } from './factors/ValuationFactorExterior';
import { ValuationFactorEngine } from './factors/ValuationFactorEngine';
import { ValuationFactorTransmission } from './factors/ValuationFactorTransmission';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ValuationFactorsGridProps {
  values: ConditionValues;
  onChange: (field: keyof ConditionValues, value: string | number) => void;
}

export const ValuationFactorsGrid: React.FC<ValuationFactorsGridProps> = ({
  values,
  onChange,
}) => {
  const factors = [
    {
      title: 'Exterior Body',
      component: (
        <ValuationFactorExterior
          value={values.exteriorBody}
          onChange={(val: string) => onChange('exteriorBody', val)}
        />
      ),
    },
    {
      title: 'Exterior Paint',
      component: (
        <ValuationFactorPaint
          value={values.exteriorPaint}
          onChange={(val: string) => onChange('exteriorPaint', val)}
        />
      ),
    },
    {
      title: 'Interior Seats',
      component: (
        <ValuationFactorInterior
          value={values.interiorSeats}
          onChange={(val: string) => onChange('interiorSeats', val)}
        />
      ),
    },
    {
      title: 'Engine Condition',
      component: (
        <ValuationFactorEngine
          value={values.mechanicalEngine}
          onChange={(val: string) => onChange('mechanicalEngine', val)}
        />
      ),
    },
    {
      title: 'Transmission',
      component: (
        <ValuationFactorTransmission
          value={values.mechanicalTransmission}
          onChange={(val: string) => onChange('mechanicalTransmission', val)}
        />
      ),
    },
    {
      title: 'Tires',
      component: (
        <ValuationFactorTires
          value={values.tiresCondition}
          onChange={(val: string) => onChange('tiresCondition', val)}
        />
      ),
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {factors.map((factor, index) => (
        <Card key={index} className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">{factor.title}</CardTitle>
          </CardHeader>
          <CardContent>{factor.component}</CardContent>
        </Card>
      ))}
    </div>
  );
};
