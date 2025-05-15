
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DealerVehicleFormData, DealerVehicle } from '@/types/dealerVehicle';
import { useAuth } from '@/hooks/useAuth';

export function useVehicleUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
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
      // Ensure condition is set (since it's required in the database)
      const formattedData = {
        ...vehicleData,
        dealer_id: user.id,
        condition: vehicleData.condition || 'Good', // Default value if not provided
      };

      // First, upload vehicle data to the database
      const { data: vehicleRecord, error } = await supabase
        .from('dealer_vehicles')
        .insert(formattedData)
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
            
          setPhotoUrls(photoUrls);
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newPhotos: string[] = [];
    
    // Create object URLs for preview
    Array.from(files).forEach(file => {
      const objectUrl = URL.createObjectURL(file);
      newPhotos.push(objectUrl);
    });
    
    setPhotoUrls(prev => [...prev, ...newPhotos]);
  };
  
  const removePhoto = (index: number) => {
    setPhotoUrls(prev => prev.filter((_, i) => i !== index));
  };
  
  const addVehicle = async (data: DealerVehicleFormData) => {
    return await uploadVehicle(data);
  };
  
  const updateVehicle = async (id: string, data: DealerVehicleFormData) => {
    if (!user) {
      toast.error('You must be logged in to update vehicles');
      return { success: false, error: 'Not authenticated' };
    }
    
    try {
      const { error } = await supabase
        .from('dealer_vehicles')
        .update({
          ...data,
          condition: data.condition || 'Good', // Ensure condition is set
          photos: photoUrls
        })
        .eq('id', id)
        .eq('dealer_id', user.id);
        
      if (error) throw error;
      
      toast.success('Vehicle updated successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Error updating vehicle:', error);
      toast.error(error.message || 'Failed to update vehicle');
      return { success: false, error: error.message };
    }
  };
  
  const fetchVehicle = async (id: string) => {
    if (!user) {
      toast.error('You must be logged in to fetch vehicle details');
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .from('dealer_vehicles')
        .select('*')
        .eq('id', id)
        .eq('dealer_id', user.id)
        .single();
        
      if (error) throw error;
      
      if (data.photos) {
        setPhotoUrls(Array.isArray(data.photos) ? data.photos : []);
      }
      
      return data;
    } catch (error: any) {
      console.error('Error fetching vehicle:', error);
      toast.error(error.message || 'Failed to fetch vehicle');
      return null;
    }
  };

  return {
    uploadVehicle,
    isUploading,
    uploadProgress,
    uploadError,
    photoUrls,
    setPhotoUrls,
    handlePhotoUpload,
    removePhoto,
    addVehicle,
    updateVehicle,
    fetchVehicle
  };
}
