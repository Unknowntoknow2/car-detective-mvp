
import { supabase } from '@/integrations/supabase/client';

export const uploadPhotos = async (files: File[]): Promise<string[]> => {
  try {
    const uploadPromises = files.map(async (file) => {
      // Use Supabase storage for real photo uploads
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('vehicle-photos')
        .upload(fileName, file);
      
      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('vehicle-photos')
        .getPublicUrl(fileName);
      
      return publicUrl;
    });
    
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Photo upload error:', error);
    throw error;
  }
};

export const deletePhoto = async (url: string): Promise<boolean> => {
  try {
    // Extract file name from URL
    const fileName = url.split('/').pop();
    if (!fileName) {
      throw new Error('Invalid photo URL');
    }
    
    const { error } = await supabase.storage
      .from('vehicle-photos')
      .remove([fileName]);
    
    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
    
    return true;
  } catch (error) {
    console.error('Photo delete error:', error);
    throw error;
  }
};
