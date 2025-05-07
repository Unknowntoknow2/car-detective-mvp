
import { supabase } from '@/integrations/supabase/client';
import { Photo } from '@/types/photo';

/**
 * Deletes photos from storage and database
 */
export async function deletePhotos(photos: Photo[]): Promise<void> {
  if (!photos.length) return;
  
  for (const photo of photos) {
    if (!photo.url) continue;
    
    try {
      // Extract path from URL
      const urlObj = new URL(photo.url);
      const filePath = urlObj.pathname.substring(urlObj.pathname.indexOf('/storage/') + 9);
      
      if (filePath) {
        // Delete from storage
        await supabase.storage
          .from('vehicle-photos')
          .remove([filePath]);
      }
      
      // Delete from valuation_photos table if we have an ID
      if (photo.id) {
        // Use type assertion to work around TypeScript issues
        await supabase
          .from('valuation_photos' as any)
          .delete()
          .eq('id', photo.id);
      }
    } catch (err) {
      console.error('Error deleting photo:', err);
    }
  }
}
