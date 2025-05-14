
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuid } from 'uuid';

export function useVehicleUpload(userId?: string) {
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Handle photo uploads
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPhotos = Array.from(files);
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

  // Upload photos to Supabase Storage
  const uploadPhotosToStorage = async (): Promise<string[]> => {
    if (!userId || uploadedPhotos.length === 0) return [];

    try {
      setPhotoUploading(true);
      const uploadPromises = uploadedPhotos.map(async (photo) => {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${uuid()}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

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

  return {
    uploadedPhotos,
    photoUrls,
    photoUploading,
    submitting,
    setUploadedPhotos,
    setPhotoUrls,
    setSubmitting,
    uploadPhotosToStorage,
    handlePhotoUpload,
    removePhoto,
  };
}
