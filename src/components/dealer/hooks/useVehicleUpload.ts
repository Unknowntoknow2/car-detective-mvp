
import { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

export const useVehicleUpload = () => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  
  const uploadVehiclePhotos = async (
    files: File[], 
    vehicleId: string
  ): Promise<string[]> => {
    if (!user || !files.length) return [];
    
    setIsUploading(true);
    const uploadedUrls: string[] = [];
    
    try {
      for (const file of files) {
        // Create a unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${vehicleId}/${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;
        
        // Upload the file
        const { data, error } = await supabase.storage
          .from('inventory-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (error) {
          throw error;
        }
        
        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('inventory-images')
          .getPublicUrl(filePath);
        
        uploadedUrls.push(publicUrl);
      }
      
      return uploadedUrls;
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast({
        title: 'Upload Error',
        description: 'Failed to upload one or more photos.',
        variant: 'destructive',
      });
      return uploadedUrls; // Return any URLs that were successfully uploaded
    } finally {
      setIsUploading(false);
    }
  };
  
  const deleteVehiclePhoto = async (
    photoUrl: string
  ): Promise<boolean> => {
    try {
      // Extract the path from the URL
      const path = photoUrl.split('/').slice(-2).join('/');
      
      const { error } = await supabase.storage
        .from('inventory-images')
        .remove([path]);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({
        title: 'Delete Error',
        description: 'Failed to delete photo.',
        variant: 'destructive',
      });
      return false;
    }
  };
  
  return {
    isUploading,
    uploadVehiclePhotos,
    deleteVehiclePhoto
  };
};
