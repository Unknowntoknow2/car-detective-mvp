
import { supabase } from '@/integrations/supabase/client';
import { Photo } from '@/types/photo';

/**
 * Deletes photos associated with a valuation
 */
export async function deletePhotos(photos: Photo[]): Promise<void> {
  if (!photos.length) return;
  
  for (const photo of photos) {
    if (photo.id) {
      try {
        // Delete from valuation_photos table
        // Cast the entire query chain to any to avoid TypeScript errors
        const query = supabase
          .from('valuation_photos')
          .delete()
          .eq('id', photo.id);
          
        await query as any;
          
        // Extract file path from URL to delete from storage
        const url = new URL(photo.url);
        const filePath = url.pathname.split('/').slice(2).join('/');
        
        if (filePath) {
          // Also try to remove from storage
          await supabase.storage
            .from('vehicle-photos')
            .remove([filePath]);
        }
      } catch (err) {
        console.error('Error deleting photo:', err);
      }
    }
  }
  
  try {
    // Define file URLs for querying photo_condition_scores
    const photoUrls = photos.map(photo => photo.url);
    
    if (photoUrls.length > 0) {
      // Delete corresponding scores
      // Cast the entire query chain to any to avoid TypeScript errors
      const query = supabase
        .from('photo_condition_scores')
        .delete()
        .in('image_url', photoUrls);
        
      await query as any;
    }
  } catch (error) {
    console.error('Error cleaning up condition scores:', error);
  }
}
