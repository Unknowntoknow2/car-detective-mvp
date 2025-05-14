
import { useState, useCallback } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

export const useVehicleUpload = (dealerId?: string) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  
  // Handle file selection
  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files);
    
    // Limit total number of photos to 10
    if (uploadedPhotos.length + newFiles.length > 10) {
      toast({
        title: 'Too many photos',
        description: 'You can upload a maximum of 10 photos per vehicle.',
        variant: 'destructive',
      });
      return;
    }
    
    // Add files to state
    setUploadedPhotos(prev => [...prev, ...newFiles]);
    
    // Create object URLs for previews
    const newUrls = newFiles.map(file => URL.createObjectURL(file));
    setPhotoUrls(prev => [...prev, ...newUrls]);
    
    // Reset the input value to allow selecting the same file again
    e.target.value = '';
  }, [uploadedPhotos]);
  
  // Remove a photo from the selection
  const removePhoto = useCallback((index: number) => {
    setPhotoUrls(prev => prev.filter((_, i) => i !== index));
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  }, []);
  
  // Upload files to Supabase Storage
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
  
  // Upload all selected photos to storage
  const uploadPhotosToStorage = async (): Promise<string[] | undefined> => {
    if (!user || uploadedPhotos.length === 0) return [];
    
    try {
      const uuid = crypto.randomUUID();
      // Use the dealer ID if available, otherwise use the user ID
      const targetId = dealerId || user.id;
      const folderPath = `${targetId}/${uuid}`;
      
      setIsUploading(true);
      return await uploadVehiclePhotos(uploadedPhotos, folderPath);
    } catch (error) {
      console.error('Error in uploadPhotosToStorage:', error);
      return undefined;
    } finally {
      setIsUploading(false);
    }
  };
  
  // Delete a photo from storage
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
    photoUrls,
    uploadedPhotos,
    isUploading,
    submitting,
    setSubmitting,
    handlePhotoUpload,
    removePhoto,
    uploadPhotosToStorage,
    uploadVehiclePhotos,
    deleteVehiclePhoto
  };
};
