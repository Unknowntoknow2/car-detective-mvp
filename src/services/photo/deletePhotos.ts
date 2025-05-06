
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
        // Use type assertion on the from() call to avoid deep type recursion
        const { error } = await (supabase
          .from('valuation_photos' as any)
          .delete()
          .eq('id', photo.id));
          
        if (error) {
          console.error('Error deleting photo from database:', error);
        }
          
        // Extract file path from URL to delete from storage
        const url = new URL(photo.url);
        const filePath = url.pathname.split('/').slice(2).join('/');
        
        if (filePath) {
          // Also try to remove from storage
          const { error: storageError } = await supabase.storage
            .from('vehicle-photos')
            .remove([filePath]);
            
          if (storageError) {
            console.error('Error deleting photo from storage:', storageError);
          }
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
      // Use type assertion on the from() call to avoid deep type recursion
      const { error } = await (supabase
        .from('photo_condition_scores' as any)
        .delete()
        .in('image_url', photoUrls));
      
      if (error) {
        console.error('Error cleaning up condition scores:', error);
      }
    }
  } catch (error) {
    console.error('Error cleaning up condition scores:', error);
  }
}
