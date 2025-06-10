
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { ManualEntryFormData, manualEntrySchema } from '@/types/manualEntry';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface UnifiedManualEntryFormProps {
  mode: 'free' | 'premium';
  onSubmit: (data: ManualEntryFormData) => void;
}

export const UnifiedManualEntryForm: React.FC<UnifiedManualEntryFormProps> = ({
  mode,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ManualEntryFormData>({
    resolver: zodResolver(manualEntrySchema),
    mode: 'onBlur',
  });

  const selectedMake = watch('make');

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 bg-white shadow-xl rounded-2xl p-6 w-full max-w-xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Make</Label>
          <Input {...register('make')} placeholder="e.g. Toyota" />
          {errors.make && <p className="text-red-500 text-sm">{errors.make.message}</p>}
        </div>

        <div>
          <Label>Model</Label>
          <Input {...register('model')} placeholder="e.g. Camry" />
          {errors.model && <p className="text-red-500 text-sm">{errors.model.message}</p>}
        </div>

        <div>
          <Label>Year</Label>
          <Input type="number" {...register('year', { valueAsNumber: true })} placeholder="e.g. 2020" />
          {errors.year && <p className="text-red-500 text-sm">{errors.year.message}</p>}
        </div>

        <div>
          <Label>Mileage</Label>
          <Input type="number" {...register('mileage', { valueAsNumber: true })} placeholder="e.g. 45000" />
          {errors.mileage && <p className="text-red-500 text-sm">{errors.mileage.message}</p>}
        </div>

        <div>
          <Label>Fuel Type</Label>
          <Select {...register('fuelType')}>
            <SelectTrigger>
              <SelectValue placeholder="Select fuel type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gas">Gas</SelectItem>
              <SelectItem value="diesel">Diesel</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="electric">Electric</SelectItem>
            </SelectContent>
          </Select>
          {errors.fuelType && <p className="text-red-500 text-sm">{errors.fuelType.message}</p>}
        </div>

        <div>
          <Label>Transmission</Label>
          <Select {...register('transmission')}>
            <SelectTrigger>
              <SelectValue placeholder="Select transmission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="automatic">Automatic</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
            </SelectContent>
          </Select>
          {errors.transmission && <p className="text-red-500 text-sm">{errors.transmission.message}</p>}
        </div>

        <div>
          <Label>Condition</Label>
          <Select {...register('condition')}>
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excellent">Excellent</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="poor">Poor</SelectItem>
            </SelectContent>
          </Select>
          {errors.condition && <p className="text-red-500 text-sm">{errors.condition.message}</p>}
        </div>

        <div>
          <Label>ZIP Code</Label>
          <Input {...register('zipCode')} placeholder="e.g. 95814" />
          {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode.message}</p>}
        </div>
      </div>

      {mode === 'premium' && (
        <div className="pt-4">
          <h3 className="font-semibold text-lg mb-4">Additional Features</h3>
          <p className="text-gray-600">Premium features would go here...</p>
        </div>
      )}

      <Button type="submit" className="w-full mt-6">
        Get Valuation
      </Button>
    </form>
  );
};
