
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useValuation } from '@/contexts/ValuationContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const currentYear = new Date().getFullYear();

const valuationSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.coerce.number()
    .min(1900, 'Year must be at least 1900')
    .max(currentYear + 1, `Year cannot be greater than ${currentYear + 1}`),
  mileage: z.coerce.number()
    .min(0, 'Mileage cannot be negative')
    .max(1000000, 'Mileage seems too high'),
  zipCode: z.string()
    .min(5, 'ZIP code must be at least 5 characters')
    .max(10, 'ZIP code cannot exceed 10 characters'),
  condition: z.enum(['Excellent', 'Good', 'Fair', 'Poor']),
});

type ValuationFormData = z.infer<typeof valuationSchema>;

export const FreeValuationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { processFreeValuation } = useValuation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ValuationFormData>({
    resolver: zodResolver(valuationSchema),
    defaultValues: {
      make: '',
      model: '',
      year: currentYear,
      mileage: 0,
      zipCode: '',
      condition: 'Good',
    },
  });

  const onSubmit = async (data: ValuationFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Process the free valuation
      const result = await processFreeValuation(data);
      
      if (result && result.valuationId) {
        // Store the valuation data in localStorage for the result page
        localStorage.setItem(`valuation_${result.valuationId}`, JSON.stringify({
          ...data,
          valuationId: result.valuationId,
          estimatedValue: result.estimatedValue || 20000, // Ensure we have a default value
          confidenceScore: result.confidenceScore || 85,
          timestamp: new Date().toISOString(),
        }));
        
        // Set the latest valuation ID for easy access
        localStorage.setItem('latest_valuation_id', result.valuationId);
        
        // Navigate to the result page
        navigate(`/result?id=${result.valuationId}`);
        toast.success('Valuation completed successfully!');
      } else {
        setError('Failed to generate valuation. Please try again.');
        toast.error('Failed to generate valuation');
      }
    } catch (err) {
      console.error('Valuation error:', err);
      setError('An unexpected error occurred. Please try again later.');
      toast.error('An error occurred while processing your request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConditionChange = (value: string) => {
    setValue('condition', value as 'Excellent' | 'Good' | 'Fair' | 'Poor');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Free Basic Valuation</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="valuation-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="make">Make</Label>
            <Input
              id="make"
              placeholder="e.g. Toyota"
              {...register('make')}
              className={errors.make ? 'border-red-500' : ''}
            />
            {errors.make && (
              <p className="text-sm text-red-500">{errors.make.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              placeholder="e.g. Camry"
              {...register('model')}
              className={errors.model ? 'border-red-500' : ''}
            />
            {errors.model && (
              <p className="text-sm text-red-500">{errors.model.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                placeholder={currentYear.toString()}
                {...register('year')}
                className={errors.year ? 'border-red-500' : ''}
              />
              {errors.year && (
                <p className="text-sm text-red-500">{errors.year.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage">Mileage</Label>
              <Input
                id="mileage"
                type="number"
                placeholder="e.g. 50000"
                {...register('mileage')}
                className={errors.mileage ? 'border-red-500' : ''}
              />
              {errors.mileage && (
                <p className="text-sm text-red-500">{errors.mileage.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input
              id="zipCode"
              placeholder="e.g. 90210"
              {...register('zipCode')}
              className={errors.zipCode ? 'border-red-500' : ''}
            />
            {errors.zipCode && (
              <p className="text-sm text-red-500">{errors.zipCode.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Select
              onValueChange={handleConditionChange}
              defaultValue="Good"
            >
              <SelectTrigger id="condition">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Excellent">Excellent</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Fair">Fair</SelectItem>
                <SelectItem value="Poor">Poor</SelectItem>
              </SelectContent>
            </Select>
            {errors.condition && (
              <p className="text-sm text-red-500">{errors.condition.message}</p>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          form="valuation-form"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Valuation...
            </>
          ) : (
            'Get Free Valuation'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FreeValuationForm;
