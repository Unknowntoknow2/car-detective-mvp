
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

import { ConditionValues } from './types';
import { ValuationFactorPaint } from './ValuationFactorPaint';
import { ValuationFactorTires } from './ValuationFactorTires';
import { ValuationFactorInterior } from './ValuationFactorInterior';
import { ValuationFactorExterior } from './ValuationFactorExterior';
import { ValuationFactorEngine } from './ValuationFactorEngine';
import { ValuationFactorTransmission } from './ValuationFactorTransmission';

interface ValuationConditionFormProps {
  initialValues?: Partial<ConditionValues>;
  vehicleInfo?: {
    make: string;
    model: string;
    year: number;
    vin: string;
  };
  valuationId?: string;
}

export function ValuationConditionForm({ 
  initialValues,
  vehicleInfo,
  valuationId
}: ValuationConditionFormProps) {
  const navigate = useNavigate();

  const [conditionValues, setConditionValues] = useState<ConditionValues>({
    exteriorBody: '',
    exteriorPaint: '',
    interiorSeats: '',
    interiorDashboard: '',
    mechanicalEngine: '',
    mechanicalTransmission: '',
    tiresCondition: '',
    odometer: 0,
    accidents: initialValues?.accidents || 0,
    mileage: initialValues?.mileage || 50,
    year: initialValues?.year || 0,
    titleStatus: initialValues?.titleStatus || 'Clean',
    zipCode: initialValues?.zipCode || ''
  });

  const formMethods = useForm();

  const handleConditionChange = (field: keyof ConditionValues, value: string | number) => {
    setConditionValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (conditionValues.zipCode && !/^\d{5}$/.test(conditionValues.zipCode)) {
      toast("Please enter a valid 5-digit ZIP code.");
      return;
    }

    localStorage.setItem('condition_values', JSON.stringify(conditionValues));

    const id = valuationId || localStorage.getItem('latest_valuation_id');
    if (id) {
      navigate(`/result?id=${id}`);
    } else {
      toast("Missing valuation ID. Please try again.");
    }
  };

  return (
    <FormProvider {...formMethods}>
      <Card className="bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Vehicle Condition Factors</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {vehicleInfo && (
              <div className="bg-primary/5 p-4 rounded-md mb-6">
                <h3 className="font-semibold text-lg">
                  {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
                </h3>
                {vehicleInfo.vin && (
                  <p className="text-sm text-muted-foreground mt-1 font-mono">
                    VIN: {vehicleInfo.vin}
                  </p>
                )}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <ValuationFactorExterior
                value={conditionValues.exteriorBody}
                onChange={(val: string) => handleConditionChange('exteriorBody', val)}
              />
              <ValuationFactorPaint
                value={conditionValues.exteriorPaint}
                onChange={(val: string) => handleConditionChange('exteriorPaint', val)}
              />
              <ValuationFactorInterior
                value={conditionValues.interiorSeats}
                onChange={(val: string) => handleConditionChange('interiorSeats', val)}
              />
              <ValuationFactorEngine
                value={conditionValues.mechanicalEngine}
                onChange={(val: string) => handleConditionChange('mechanicalEngine', val)}
              />
              <ValuationFactorTransmission
                value={conditionValues.mechanicalTransmission}
                onChange={(val: string) => handleConditionChange('mechanicalTransmission', val)}
              />
              <ValuationFactorTires
                value={conditionValues.tiresCondition}
                onChange={(val: string) => handleConditionChange('tiresCondition', val)}
              />
            </div>

            <div className="pt-4">
              <Label htmlFor="zipCode">ZIP Code (Optional)</Label>
              <Input
                id="zipCode"
                value={conditionValues.zipCode}
                onChange={(e) => handleConditionChange('zipCode', e.target.value)}
                placeholder="Enter ZIP code for more accurate valuation"
                className="mt-1"
                maxLength={5}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Adding your ZIP code helps us provide more accurate regional pricing data.
              </p>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full">
                Calculate Value
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </FormProvider>
  );
}
