
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DealerVehicleFormData } from '@/types/dealerVehicle';
import { useAuth } from '@/hooks/useAuth';

export function useVehicleUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { user } = useAuth();

  const uploadVehicle = async (vehicleData: DealerVehicleFormData, photos?: File[]) => {
    if (!user) {
      toast.error('You must be logged in to upload vehicles');
      return { success: false, error: 'Not authenticated' };
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      // First, upload vehicle data to the database
      const { data: vehicleRecord, error } = await supabase
        .from('dealer_vehicles')
        .insert({
          ...vehicleData,
          dealer_id: user.id,
        })
        .select('id')
        .single();

      if (error) {
        throw error;
      }

      // Handle photo uploads if provided
      if (photos && photos.length > 0 && vehicleRecord.id) {
        const photoUrls = [];
        
        // Upload each photo
        for (let i = 0; i < photos.length; i++) {
          const photo = photos[i];
          const fileName = `${vehicleRecord.id}/${Date.now()}-${photo.name}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('vehicle-photos')
            .upload(fileName, photo, {
              cacheControl: '3600',
              upsert: false
            });
            
          if (uploadError) {
            console.error('Error uploading photo:', uploadError);
            continue;
          }
          
          // Get the public URL for the photo
          const { data: { publicUrl } } = supabase.storage
            .from('vehicle-photos')
            .getPublicUrl(fileName);
            
          photoUrls.push(publicUrl);
          
          // Update progress
          setUploadProgress(Math.round(((i + 1) / photos.length) * 100));
        }
        
        // Update the vehicle record with photo URLs
        if (photoUrls.length > 0) {
          await supabase
            .from('dealer_vehicles')
            .update({ photos: photoUrls })
            .eq('id', vehicleRecord.id);
        }
      }

      toast.success('Vehicle added to inventory');
      return { success: true, data: vehicleRecord };
    } catch (error: any) {
      console.error('Error uploading vehicle:', error);
      setUploadError(error.message || 'Failed to upload vehicle');
      toast.error(error.message || 'Failed to upload vehicle');
      return { success: false, error: error.message };
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadVehicle,
    isUploading,
    uploadProgress,
    uploadError
  };
}
