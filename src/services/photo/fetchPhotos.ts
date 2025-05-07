
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
    // Use type assertion to work around TypeScript issues with the table name
    const { data, error } = await supabase
      .from('valuation_photos')
      .select('*')
      .eq('valuation_id', valuationId);
      
    if (error) {
      throw error;
    }
    
    // Use type assertion to safely access properties
    return (data || []).map((item: any) => ({
      id: item.id,
      url: item.photo_url,
      thumbnail: item.photo_url, // Use same URL for thumbnail
    }));
    
  } catch (err) {
    console.error('Error fetching valuation photos:', err);
    throw err;
  }
}
