<<<<<<< HEAD

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DealerVehicleFormData } from '@/types/dealerVehicle';
=======
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DealerVehicle, DealerVehicleFormData } from "@/types/dealerVehicle";
import { useAuth } from "@/hooks/useAuth";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

export const useVehicleUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

<<<<<<< HEAD
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
=======
  const uploadVehicle = async (
    vehicleData: DealerVehicleFormData,
    photos?: File[],
  ) => {
    if (!user) {
      toast.error("You must be logged in to upload vehicles");
      return { success: false, error: "Not authenticated" };
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    }
  }, []);

  const handlePhotoUpload = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
<<<<<<< HEAD
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
=======
      // Ensure condition is set (since it's required in the database)
      const formattedData = {
        ...vehicleData,
        dealer_id: user.id,
        condition: vehicleData.condition || "Good", // Default value if not provided
      };

      // First, upload vehicle data to the database
      const { data: vehicleRecord, error } = await supabase
        .from("dealer_vehicles")
        .insert(formattedData)
        .select("id")
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
        .single();

      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error('Error adding vehicle:', err);
      throw err;
    }
  }, [photoUrls]);

<<<<<<< HEAD
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
=======
      // Handle photo uploads if provided
      if (photos && photos.length > 0 && vehicleRecord.id) {
        const photoUrls = [];

        // Upload each photo
        for (let i = 0; i < photos.length; i++) {
          const photo = photos[i];
          const fileName = `${vehicleRecord.id}/${Date.now()}-${photo.name}`;

          const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from("vehicle-photos")
            .upload(fileName, photo, {
              cacheControl: "3600",
              upsert: false,
            });

          if (uploadError) {
            console.error("Error uploading photo:", uploadError);
            continue;
          }

          // Get the public URL for the photo
          const { data: { publicUrl } } = supabase.storage
            .from("vehicle-photos")
            .getPublicUrl(fileName);

          photoUrls.push(publicUrl);

          // Update progress
          setUploadProgress(Math.round(((i + 1) / photos.length) * 100));
        }

        // Update the vehicle record with photo URLs
        if (photoUrls.length > 0) {
          await supabase
            .from("dealer_vehicles")
            .update({ photos: photoUrls })
            .eq("id", vehicleRecord.id);

          setPhotoUrls(photoUrls);
        }
      }

      toast.success("Vehicle added to inventory");
      return { success: true, data: vehicleRecord };
    } catch (error: any) {
      console.error("Error uploading vehicle:", error);
      setUploadError(error.message || "Failed to upload vehicle");
      toast.error(error.message || "Failed to upload vehicle");
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
    Array.from(files).forEach((file) => {
      const objectUrl = URL.createObjectURL(file);
      newPhotos.push(objectUrl);
    });

    setPhotoUrls((prev) => [...prev, ...newPhotos]);
  };

  const removePhoto = (index: number) => {
    setPhotoUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const addVehicle = async (data: DealerVehicleFormData) => {
    return await uploadVehicle(data);
  };

  const updateVehicle = async (id: string, data: DealerVehicleFormData) => {
    if (!user) {
      toast.error("You must be logged in to update vehicles");
      return { success: false, error: "Not authenticated" };
    }

    try {
      const { error } = await supabase
        .from("dealer_vehicles")
        .update({
          ...data,
          condition: data.condition || "Good", // Ensure condition is set
          photos: photoUrls,
        })
        .eq("id", id)
        .eq("dealer_id", user.id);

      if (error) throw error;

      toast.success("Vehicle updated successfully");
      return { success: true };
    } catch (error: any) {
      console.error("Error updating vehicle:", error);
      toast.error(error.message || "Failed to update vehicle");
      return { success: false, error: error.message };
    }
  };

  const fetchVehicle = async (id: string) => {
    if (!user) {
      toast.error("You must be logged in to fetch vehicle details");
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("dealer_vehicles")
        .select("*")
        .eq("id", id)
        .eq("dealer_id", user.id)
        .single();

      if (error) throw error;

      if (data.photos) {
        // Convert any non-string values in photos array to strings
        const photoStrings = Array.isArray(data.photos)
          ? data.photos.map((photo) => String(photo))
          : [];
        setPhotoUrls(photoStrings);
      }

      return data;
    } catch (error: any) {
      console.error("Error fetching vehicle:", error);
      toast.error(error.message || "Failed to fetch vehicle");
      return null;
    }
  };
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

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
<<<<<<< HEAD
    uploadVehicle,
    uploadError
=======
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  };
};
