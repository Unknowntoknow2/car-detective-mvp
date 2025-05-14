
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuid } from 'uuid';
import { toast } from 'sonner';

export const useVehicleUpload = (dealerId?: string) => {
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Upload photos to Supabase Storage
  const uploadPhotosToStorage = async (): Promise<string[]> => {
    if (!dealerId || uploadedPhotos.length === 0) return [];

    try {
      setPhotoUploading(true);
      const uploadPromises = uploadedPhotos.map(async (photo) => {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${uuid()}.${fileExt}`;
        const filePath = `${dealerId}/${fileName}`;

        const { data, error } = await supabase.storage
          .from('vehicle_photos')
          .upload(filePath, photo);

        if (error) {
          console.error('Error uploading photo:', error);
          throw error;
        }

        // Get public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from('vehicle_photos')
          .getPublicUrl(filePath);

        return publicUrl;
      });

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast.error('Failed to upload photos');
      return [];
    } finally {
      setPhotoUploading(false);
    }
  };

  // Handle photo uploads
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Limit to 5 photos total
    const remainingSlots = 5 - uploadedPhotos.length;
    if (remainingSlots <= 0) {
      toast.error('Maximum 5 photos allowed');
      return;
    }

    const newPhotos = Array.from(files).slice(0, remainingSlots);
    setUploadedPhotos(prev => [...prev, ...newPhotos]);

    // Create temporary URLs for preview
    const newUrls = newPhotos.map(file => URL.createObjectURL(file));
    setPhotoUrls(prev => [...prev, ...newUrls]);
  };

  // Remove photo from the preview
  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(photoUrls[index]);
    setPhotoUrls(prev => prev.filter((_, i) => i !== index));
  };

  return {
    photoUrls,
    uploadedPhotos,
    photoUploading,
    submitting,
    setUploadedPhotos,
    setPhotoUrls,
    setSubmitting,
    uploadPhotosToStorage,
    handlePhotoUpload,
    removePhoto
  };
};
