
import { supabase } from '@/integrations/supabase/client';
import { Photo } from '@/types/photo';
import { v4 as uuidv4 } from 'uuid';

export async function uploadPhotos(photos: Photo[], valuationId: string): Promise<Photo[]> {
  const uploadPromises = photos.map(async (photo) => {
    if (!photo.url && !photo.uploading && !photo.error) {
      try {
        // Create a URL from the Blob/File
        const photoFile = await fetch(URL.createObjectURL(photo as unknown as Blob)).then(r => r.blob());
        
        // Prepare the file path
        const fileExt = photo.name?.split('.').pop() || 'jpg';
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${valuationId}/${fileName}`;
        
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('vehicle-photos')
          .upload(filePath, photoFile, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (error) {
          throw error;
        }
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('vehicle-photos')
          .getPublicUrl(filePath);
        
        return {
          ...photo,
          url: urlData.publicUrl,
          uploaded: true,
          uploading: false
        };
      } catch (error) {
        console.error(`Error uploading photo ${photo.id}:`, error);
        return {
          ...photo,
          error: (error as Error).message || 'Upload failed',
          uploading: false
        };
      }
    }
    return photo;
  });
  
  return Promise.all(uploadPromises);
}
