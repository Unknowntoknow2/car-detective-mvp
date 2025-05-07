import { supabase } from '@/integrations/supabase/client';

/**
 * Gets the best photo URL for a valuation
 * @param valuationId The valuation ID
 * @returns The URL of the best photo, or null if no photos exist
 */
export async function getBestPhotoUrl(valuationId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('valuation_photos')
      .select('photo_url, score')
      .eq('valuation_id', valuationId)
      .order('score', { ascending: false })
      .limit(1)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    return data.photo_url;
  } catch (err) {
    console.error('Error getting best photo URL:', err);
    return null;
  }
}

/**
 * Gets all photos for a valuation
 * @param valuationId The valuation ID
 * @returns Array of photo objects
 */
export async function getValuationPhotos(valuationId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('valuation_photos')
      .select('*')
      .eq('valuation_id', valuationId)
      .order('score', { ascending: false });
    
    if (error || !data) {
      return [];
    }
    
    return data;
  } catch (err) {
    console.error('Error getting valuation photos:', err);
    return [];
  }
}

/**
 * Updates valuation with photo metadata
 * This function saves photo metadata to the valuation_photos table
 */
export async function updateValuationWithPhotoMetadata(
  valuationId: string,
  photoUrl: string,
  photoScore: number,
  explanation?: string
): Promise<boolean> {
  try {
    // Insert or update valuation_photos table
    const { error } = await supabase
      .from('valuation_photos')
      .upsert({
        valuation_id: valuationId,
        photo_url: photoUrl,
        score: photoScore,
        // If explanation is supported in your schema, include it
        // otherwise it will be ignored
        uploaded_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error updating valuation photo metadata:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error updating valuation with photo metadata:', err);
    return false;
  }
}
