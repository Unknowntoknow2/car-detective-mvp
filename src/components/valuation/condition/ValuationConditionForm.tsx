
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ValuationFactorsGrid } from './factors/ValuationFactorsGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ConditionValues } from './types';
import { useForm, FormProvider } from 'react-hook-form';

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

  // Create a form instance for the form context
  const formMethods = useForm();

  const handleConditionChange = (id: string, value: any) => {
    setConditionValues(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate ZIP code if provided
    if (conditionValues.zipCode && !/^\d{5}$/.test(conditionValues.zipCode as string)) {
      toast({
        description: "Please enter a valid 5-digit ZIP code.",
        variant: "destructive"
      });
      return;
    }
    
    // Store the condition values in localStorage
    localStorage.setItem('condition_values', JSON.stringify(conditionValues));
    
    // Get the valuation ID
    const id = valuationId || localStorage.getItem('latest_valuation_id');
    if (id) {
      navigate(`/result?id=${id}`);
    } else {
      toast({ 
        description: "Missing valuation ID. Please try again.",
        variant: "destructive"
      });
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
            
            <ValuationFactorsGrid 
              values={conditionValues}
              onChange={handleConditionChange}
            />
            
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
