
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DealerVehicleFormData } from '@/types/dealerVehicle';

export const useVehicleUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadPhoto = useCallback(async (photo: File): Promise<string> => {
    try {
      const fileName = `${Date.now()}-${photo.name}`;
      const { data, error } = await supabase.storage
        .from('vehicle-photos')
        .upload(fileName, photo);

      if (error) throw error;
      
      const { data: urlData } = supabase.storage
        .from('vehicle-photos')
        .getPublicUrl(data.path);
        
      return urlData.publicUrl;
    } catch (err: any) {
      console.error('Error uploading photo:', err);
      throw err;
    }
  }, []);

  const handlePhotoUpload = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const uploadPromises = files.map(uploadPhoto);
      const uploadedUrls = await Promise.all(uploadPromises);
      
      setPhotoUrls(prev => [...prev, ...uploadedUrls]);
      toast.success(`${files.length} photo${files.length > 1 ? 's' : ''} uploaded`);
    } catch (err) {
      toast.error('Failed to upload one or more photos');
    } finally {
      setIsUploading(false);
      setUploadProgress(100);
    }
  }, [uploadPhoto]);

  const removePhoto = useCallback((index: number) => {
    setPhotoUrls(prev => prev.filter((_, i) => i !== index));
  }, []);

  const addVehicle = useCallback(async (vehicleData: DealerVehicleFormData) => {
    try {
      const { data: userResponse, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error } = await supabase
        .from('dealer_inventory')
        .insert({
          dealer_id: userResponse.user?.id,
          ...vehicleData,
          photos: photoUrls
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error('Error adding vehicle:', err);
      throw err;
    }
  }, [photoUrls]);

  const updateVehicle = useCallback(async (id: string, vehicleData: DealerVehicleFormData) => {
    try {
      const { error } = await supabase
        .from('dealer_inventory')
        .update({
          ...vehicleData,
          photos: photoUrls,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
    } catch (err: any) {
      console.error('Error updating vehicle:', err);
      throw err;
    }
  }, [photoUrls]);

  const fetchVehicle = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('dealer_inventory')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error('Error fetching vehicle:', err);
      throw err;
    }
  }, []);

  // Add the uploadVehicle method
  const uploadVehicle = useCallback(async (data: DealerVehicleFormData, photos?: File[]) => {
    setUploadError(null);
    setIsUploading(true);
    
    try {
      // Upload photos if provided
      if (photos && photos.length > 0) {
        await handlePhotoUpload(photos);
      }
      
      // Add the vehicle
      const result = await addVehicle(data);
      return { success: true, data: result };
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload vehicle');
      return { success: false, error: err.message };
    } finally {
      setIsUploading(false);
    }
  }, [addVehicle, handlePhotoUpload]);

  return {
    isUploading,
    photoUrls,
    setPhotoUrls,
    uploadProgress,
    handlePhotoUpload,
    removePhoto,
    addVehicle,
    updateVehicle,
    fetchVehicle,
    uploadVehicle,
    uploadError
  };
};
