
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ValuationFactorsGrid } from './factors/ValuationFactorsGrid';
import { ConditionValues } from './types';

export interface ConditionEvaluationFormProps {
  initialValues?: Partial<ConditionValues>;
  vehicleInfo?: {
    year: number;
    make: string;
    model: string;
    vin?: string;
  };
  onSubmit?: (values: ConditionValues) => void;
  onCancel?: () => void;
}

export const ConditionEvaluationForm: React.FC<ConditionEvaluationFormProps> = ({
  initialValues,
  vehicleInfo,
  onSubmit,
  onCancel
}) => {
  const [values, setValues] = useState<ConditionValues>({
    exteriorBody: initialValues?.exteriorBody || '',
    exteriorPaint: initialValues?.exteriorPaint || '',
    interiorSeats: initialValues?.interiorSeats || '',
    interiorDashboard: initialValues?.interiorDashboard || '',
    mechanicalEngine: initialValues?.mechanicalEngine || '',
    mechanicalTransmission: initialValues?.mechanicalTransmission || '',
    tiresCondition: initialValues?.tiresCondition || '',
    odometer: initialValues?.odometer || 0,
    accidents: initialValues?.accidents || 0,
    mileage: initialValues?.mileage || 0,
    year: initialValues?.year || 0,
    titleStatus: initialValues?.titleStatus || 'Clean',
    zipCode: initialValues?.zipCode || ''
  });

  // Create form methods to provide context
  const formMethods = useForm();

  const handleChange = (id: string, value: any) => {
    setValues(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(values);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Condition Evaluation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {vehicleInfo && (
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h3 className="text-lg font-medium">
                  {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
                </h3>
                {vehicleInfo.vin && (
                  <p className="text-sm text-gray-500 mt-1">VIN: {vehicleInfo.vin}</p>
                )}
              </div>
            )}

            <ValuationFactorsGrid 
              values={values}
              onChange={handleChange}
            />

            <div className="mt-6 flex justify-end space-x-2">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit">
                Submit Evaluation
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </FormProvider>
  );
};

export default ConditionEvaluationForm;
