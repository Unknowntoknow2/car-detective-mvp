
import React from 'react';
import { z } from 'zod';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ConditionFormProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

// Zod validation schema for this tab
export const conditionFormSchema = z.object({
  condition: z.enum(['excellent', 'good', 'fair', 'poor'], {
    required_error: 'Please select a condition',
  }),
  mileage: z.number().min(0, 'Mileage must be positive').max(999999, 'Mileage seems too high'),
  transmission: z.enum(['automatic', 'manual', 'unknown']).optional(),
  tire_condition: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
  brake_condition: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
});

export const ConditionForm: React.FC<ConditionFormProps> = ({ formData, updateFormData }) => {
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateField = (field: string, value: any) => {
    try {
      conditionFormSchema.pick({ [field]: true } as any).parse({ [field]: value });
      setErrors(prev => ({ ...prev, [field]: '' }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ 
          ...prev, 
          [field]: error.errors[0]?.message || 'Invalid value' 
        }));
      }
      return false;
    }
  };

  const handleInputChange = (field: keyof FollowUpAnswers, value: any) => {
    updateFormData({ [field]: value });
    validateField(field, value);
  };

  const validateAllFields = () => {
    try {
      conditionFormSchema.parse({
        condition: formData.condition,
        mileage: formData.mileage,
        transmission: formData.transmission,
        tire_condition: formData.tire_condition,
        brake_condition: formData.brake_condition,
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        toast.error('Please fix the validation errors before proceeding');
      }
      return false;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Condition Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Overall Condition */}
          <div className="space-y-2">
            <Label htmlFor="condition">Overall Condition *</Label>
            <Select 
              value={formData.condition || ''} 
              onValueChange={(value) => handleInputChange('condition', value)}
            >
              <SelectTrigger className={errors.condition ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
            {errors.condition && (
              <p className="text-sm text-red-500">{errors.condition}</p>
            )}
          </div>

          {/* Mileage */}
          <div className="space-y-2">
            <Label htmlFor="mileage">Mileage *</Label>
            <Input
              id="mileage"
              type="number"
              placeholder="Enter mileage"
              value={formData.mileage || ''}
              onChange={(e) => handleInputChange('mileage', parseInt(e.target.value) || undefined)}
              className={errors.mileage ? 'border-red-500' : ''}
            />
            {errors.mileage && (
              <p className="text-sm text-red-500">{errors.mileage}</p>
            )}
          </div>

          {/* Transmission */}
          <div className="space-y-2">
            <Label htmlFor="transmission">Transmission</Label>
            <Select 
              value={formData.transmission || ''} 
              onValueChange={(value) => handleInputChange('transmission', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select transmission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="automatic">Automatic</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tire Condition */}
          <div className="space-y-2">
            <Label htmlFor="tire_condition">Tire Condition</Label>
            <Select 
              value={formData.tire_condition || ''} 
              onValueChange={(value) => handleInputChange('tire_condition', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tire condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Brake Condition */}
          <div className="space-y-2">
            <Label htmlFor="brake_condition">Brake Condition</Label>
            <Select 
              value={formData.brake_condition || ''} 
              onValueChange={(value) => handleInputChange('brake_condition', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select brake condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={validateAllFields} variant="outline" className="w-full mt-4">
            Validate This Section
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
