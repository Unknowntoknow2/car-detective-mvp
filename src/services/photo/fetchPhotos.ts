
import { supabase } from '@/integrations/supabase/client';
import { Photo } from '@/types/photo';

/**
 * Fetches photos for a specific valuation
 */
export async function fetchValuationPhotos(valuationId: string): Promise<Photo[]> {
  if (!valuationId) {
    throw new Error("No valuation ID provided");
  }
  
  try {
    // Use any type to work around TypeScript type checking issues
    // This is temporary until Supabase types are regenerated
    const { data, error } = await supabase
      .from('valuation_photos' as any)
      .select('*')
      .eq('valuation_id', valuationId);
      
    if (error) {
      throw error;
    }
    
    return data?.map(item => ({
      id: item.id,
      url: item.photo_url
    })) || [];
    
  } catch (err) {
    console.error('Error fetching valuation photos:', err);
    throw err;
  }
}
