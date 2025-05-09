
import { supabase } from '@/integrations/supabase/client';
import { Photo } from '@/types/photo';
import { v4 as uuidv4 } from 'uuid';

export async function uploadPhotos(photos: Photo[], valuationId: string): Promise<Photo[]> {
  try {
    if (!photos.length) {
      return [];
    }
    
    const uploadPromises = photos.map(async (photo) => {
      if (!photo.file) {
        throw new Error(`No file provided for photo ${photo.id}`);
      }
      
      const filename = `${valuationId}/${uuidv4()}-${photo.file.name}`;
      const { data, error } = await supabase.storage
        .from('vehicle-photos')
        .upload(filename, photo.file);
        
      if (error) {
        throw error;
      }
      
      const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/vehicle-photos/${data?.path}`;
      
      return {
        ...photo,
        url,
        uploaded: true,
        uploading: false
      };
    });
    
    const uploadedPhotos = await Promise.all(uploadPromises);
    return uploadedPhotos;
  } catch (error: any) {
    console.error('Error uploading photos:', error);
    throw new Error(`Failed to upload photos: ${error.message}`);
  }
}
