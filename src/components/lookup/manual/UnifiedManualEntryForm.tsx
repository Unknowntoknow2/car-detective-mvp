// ✅ FILE: src/components/lookup/manual/UnifiedManualEntryForm.tsx

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { ManualEntryFormData, manualEntrySchema } from '@/types/manualEntry';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Select, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FeatureSelect } from '@/components/lookup/manual/FeatureSelect';

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
          <label>Make</label>
          <Input {...register('make')} placeholder="e.g. Toyota" />
          {errors.make && <p className="text-red-500">{errors.make.message}</p>}
        </div>

        <div>
          <label>Model</label>
          <Input {...register('model')} placeholder="e.g. Camry" />
          {errors.model && <p className="text-red-500">{errors.model.message}</p>}
        </div>

        <div>
          <label>Year</label>
          <Input {...register('year')} placeholder="e.g. 2020" />
          {errors.year && <p className="text-red-500">{errors.year.message}</p>}
        </div>

        <div>
          <label>Mileage</label>
          <Input {...register('mileage')} placeholder="e.g. 45000" />
          {errors.mileage && <p className="text-red-500">{errors.mileage.message}</p>}
        </div>

        <div>
          <label>Fuel Type</label>
          <Select {...register('fuel_type')}>
            <SelectItem value="gas">Gas</SelectItem>
            <SelectItem value="diesel">Diesel</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
            <SelectItem value="electric">Electric</SelectItem>
          </Select>
          {errors.fuel_type && <p className="text-red-500">{errors.fuel_type.message}</p>}
        </div>

        <div>
          <label>Transmission</label>
          <Select {...register('transmission')}>
            <SelectItem value="automatic">Automatic</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
          </Select>
          {errors.transmission && <p className="text-red-500">{errors.transmission.message}</p>}
        </div>

        <div>
          <label>Condition</label>
          <Select {...register('condition')}>
            <SelectItem value="excellent">Excellent</SelectItem>
            <SelectItem value="good">Good</SelectItem>
            <SelectItem value="fair">Fair</SelectItem>
            <SelectItem value="poor">Poor</SelectItem>
          </Select>
          {errors.condition && <p className="text-red-500">{errors.condition.message}</p>}
        </div>

        <div>
          <label>ZIP Code</label>
          <Input {...register('zip_code')} placeholder="e.g. 95814" />
          {errors.zip_code && <p className="text-red-500">{errors.zip_code.message}</p>}
        </div>
      </div>

      {/* 🔒 Premium-Only Fields */}
      {mode === 'premium' && (
        <>
          <h3 className="font-semibold text-lg mt-6">Additional Features</h3>
          <FeatureSelect control={register} />
        </>
      )}

      <Button type="submit" className="w-full mt-6">
        Get Valuation
      </Button>
    </form>
  );
};
