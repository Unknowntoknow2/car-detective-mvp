import React from 'react';
import { ConditionValues } from '../types';
import { ValuationFactorPaint } from './ValuationFactorPaint';
import { ValuationFactorTires } from './ValuationFactorTires';
import { ValuationFactorInterior } from './ValuationFactorInterior';
import { ValuationFactorExterior } from './ValuationFactorExterior';
import { ValuationFactorEngine } from './ValuationFactorEngine';
import { ValuationFactorTransmission } from './ValuationFactorTransmission';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ValuationFactorsGridProps {
  values: ConditionValues;
  onChange: (field: keyof ConditionValues, value: any) => void;
}

export const ValuationFactorsGrid: React.FC<ValuationFactorsGridProps> = ({
  values,
  onChange,
}) => {
  const factors = [
    {
      title: 'Exterior Body',
      component: <ValuationFactorExterior value={values.exteriorBody} onChange={(val) => onChange('exteriorBody', val)} />
    },
    {
      title: 'Exterior Paint',
      component: <ValuationFactorPaint value={values.exteriorPaint} onChange={(val) => onChange('exteriorPaint', val)} />
    },
    {
      title: 'Interior Condition',
      component: <ValuationFactorInterior value={values.interiorSeats} onChange={(val) => onChange('interiorSeats', val)} />
    },
    {
      title: 'Engine Condition',
      component: <ValuationFactorEngine value={values.mechanicalEngine} onChange={(val) => onChange('mechanicalEngine', val)} />
    },
    {
      title: 'Transmission',
      component: <ValuationFactorTransmission value={values.mechanicalTransmission} onChange={(val) => onChange('mechanicalTransmission', val)} />
    },
    {
      title: 'Tires',
      component: <ValuationFactorTires value={values.tiresCondition} onChange={(val) => onChange('tiresCondition', val)} />
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {factors.map((factor, index) => (
        <Card key={index} className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">{factor.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {factor.component}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
