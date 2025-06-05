// ✅ FILE: src/services/valuation/submitManualValuation.ts

import { supabase } from '@/lib/supabaseClient';
import { ManualEntryFormData } from '@/types/manualEntry';

export const submitManualValuation = async (
  formData: ManualEntryFormData,
  userId?: string
) => {
  const {
    make,
    model,
    year,
    mileage,
    fuel_type,
    transmission,
    condition,
    zip_code,
    vin,
    plate,
    state,
  } = formData;

  const { data, error } = await supabase
    .from('valuations')
    .insert([
      {
        user_id: userId || null,
        vin: vin || null,
        plate: plate || null,
        state: state || null,
        make,
        model,
        year,
        mileage,
        fuel_type,
        transmission,
        condition,
        zip_code,
        source: 'manual', // ✅ optional: identify the source type
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('❌ Supabase Insert Error:', error.message);
    throw new Error('Could not submit valuation. Please try again.');
  }

  return data.id;
};
