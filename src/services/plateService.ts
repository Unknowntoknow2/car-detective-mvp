
import { supabase } from '@/integrations/supabase/client';
import { PlateLookupInfo } from '@/types/vehicle';

export async function lookupPlate(plate: string, state: string): Promise<PlateLookupInfo | null> {
  try {
    // First check our local database
    const { data, error } = await supabase
      .from('plate_lookups')
      .select('*')
      .eq('plate', plate)
      .eq('state', state)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (data) {
      return {
        plate: data.plate,
        state: data.state,
        year: data.year,
        make: data.make,
        model: data.model,
        color: data.color,
      };
    }

    // If not found, return null (could implement external API call here)
    return null;
  } catch (error) {
    return null;
  }
}
