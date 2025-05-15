
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { VehicleFormValues } from '../schemas/vehicleSchema';
import { DealerVehicle } from '@/types/dealerVehicle';

export const useVehicleUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Upload photos to Supabase storage
  const uploadPhotos = async (files: File[]): Promise<string[]> => {
    if (!user) throw new Error('User not authenticated');
    
    const urls: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}-${i}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from('vehicle_photos')
        .upload(filePath, file);
      
      if (error) {
        console.error('Error uploading photo:', error);
        toast.error(`Failed to upload photo: ${error.message}`);
        continue;
      }
      
      // Get public URL for the file
      const { data: { publicUrl } } = supabase.storage
        .from('vehicle_photos')
        .getPublicUrl(filePath);
      
      urls.push(publicUrl);
      
      // Update progress
      setUploadProgress(Math.round(((i + 1) / files.length) * 100));
    }
    
    return urls;
  };
  
  // Handle photo upload and preview
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const filesToUpload = Array.from(e.target.files);
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      const urls = await uploadPhotos(filesToUpload);
      setPhotoUrls(prev => [...prev, ...urls]);
      
      toast.success('Photos uploaded successfully');
    } catch (error: any) {
      toast.error(`Failed to upload photos: ${error.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  // Remove photo from preview and storage
  const removePhoto = async (index: number) => {
    const photoToRemove = photoUrls[index];
    
    // Extract the path from the URL
    const storagePath = photoToRemove.split('/').slice(-2).join('/');
    
    try {
      // Delete from Supabase storage
      const { error } = await supabase.storage
        .from('vehicle_photos')
        .remove([storagePath]);
      
      if (error) {
        console.error('Error removing photo:', error);
        toast.error(`Failed to remove photo: ${error.message}`);
        return;
      }
      
      // Update state to remove the photo URL
      setPhotoUrls(prev => prev.filter((_, i) => i !== index));
      
      toast.success('Photo removed successfully');
    } catch (error: any) {
      toast.error(`Failed to remove photo: ${error.message}`);
    }
  };
  
  // Add a new vehicle to the dealer's inventory
  const addVehicle = async (vehicleData: VehicleFormValues) => {
    if (!user) {
      toast.error('You must be logged in to add a vehicle');
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Ensure required fields are filled
      const dataWithDealer = {
        ...vehicleData,
        dealer_id: user.id,
        photos: photoUrls,
        make: vehicleData.make || '',
        model: vehicleData.model || '',
        year: vehicleData.year || new Date().getFullYear(),
        price: vehicleData.price || 0,
        condition: vehicleData.condition || 'Good',
        status: vehicleData.status || 'available'
      };
      
      // Insert the vehicle into the database
      const { data, error } = await supabase
        .from('dealer_vehicles')
        .insert(dataWithDealer)
        .select('id')
        .single();
      
      if (error) throw error;
      
      toast.success('Vehicle added successfully!');
      setPhotoUrls([]);
      navigate('/dealer/inventory');
      
      return data;
    } catch (error: any) {
      console.error('Error adding vehicle:', error);
      toast.error(`Failed to add vehicle: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };
  
  // Update an existing vehicle
  const updateVehicle = async (id: string, vehicleData: VehicleFormValues) => {
    if (!user) {
      toast.error('You must be logged in to update a vehicle');
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Ensure required fields are filled
      const dataToUpdate = {
        ...vehicleData,
        photos: photoUrls,
        make: vehicleData.make || '',
        model: vehicleData.model || '',
        year: vehicleData.year || new Date().getFullYear(),
        price: vehicleData.price || 0,
        condition: vehicleData.condition || 'Good',
        status: vehicleData.status || 'available'
      };
      
      // Update the vehicle in the database
      const { error } = await supabase
        .from('dealer_vehicles')
        .update(dataToUpdate)
        .eq('id', id)
        .eq('dealer_id', user.id); // Ensure the vehicle belongs to the dealer
      
      if (error) throw error;
      
      toast.success('Vehicle updated successfully!');
      navigate('/dealer/inventory');
    } catch (error: any) {
      console.error('Error updating vehicle:', error);
      toast.error(`Failed to update vehicle: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };
  
  // Fetch a vehicle by ID
  const fetchVehicle = async (id: string): Promise<DealerVehicle | null> => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('dealer_vehicles')
        .select('*')
        .eq('id', id)
        .eq('dealer_id', user.id) // Ensure the vehicle belongs to the dealer
        .single();
      
      if (error) throw error;
      
      return data as DealerVehicle;
    } catch (error: any) {
      console.error('Error fetching vehicle:', error);
      toast.error(`Failed to fetch vehicle: ${error.message}`);
      return null;
    }
  };
  
  return {
    isUploading,
    uploadProgress,
    photoUrls,
    setPhotoUrls,
    handlePhotoUpload,
    removePhoto,
    addVehicle,
    updateVehicle,
    fetchVehicle
  };
};
