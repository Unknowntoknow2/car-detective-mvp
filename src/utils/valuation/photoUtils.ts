
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
 * Updates valuation with photo metadata (when the valuation table schema has the required fields)
 * This will be needed in the future if we decide to add these fields to the valuations table
 */
export async function updateValuationWithPhotoMetadata(
  valuationId: string,
  photoUrl: string,
  photoScore: number,
  explanation?: string
): Promise<boolean> {
  try {
    // This is a placeholder for future implementation if the schema changes
    console.log(`Would update valuation ${valuationId} with photo metadata:`, {
      photoUrl,
      photoScore,
      explanation
    });
    
    // For now, just return success
    return true;
  } catch (err) {
    console.error('Error updating valuation with photo metadata:', err);
    return false;
  }
}
