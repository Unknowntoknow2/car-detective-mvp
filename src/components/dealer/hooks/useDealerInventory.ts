<<<<<<< HEAD

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DealerVehicle, DeleteVehicleResult } from '@/types/dealerVehicle';
=======
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { DealerVehicle, DealerVehicleStatus } from "@/types/dealerVehicle";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

export const useDealerInventory = () => {
  const [vehicles, setVehicles] = useState<DealerVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

<<<<<<< HEAD
  const fetchInventory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: userResponse, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      const { data, error: fetchError } = await supabase
        .from('dealer_inventory')
        .select('*')
        .eq('dealer_id', userResponse.user?.id);
        
      if (fetchError) throw fetchError;
      
      setVehicles(data as DealerVehicle[]);
    } catch (err: any) {
      console.error('Error fetching inventory:', err);
      setError(err.message || 'Failed to fetch inventory');
      toast.error('Failed to load inventory');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const deleteVehicle = useCallback(async (id: string): Promise<DeleteVehicleResult> => {
    try {
      const { error: deleteError } = await supabase
        .from('dealer_inventory')
=======
  const { user } = useAuth();

  const fetchInventory = async () => {
    if (!user) {
      setError("Not authenticated");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("dealer_vehicles")
        .select("*")
        .eq("dealer_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform the data to ensure status is of type DealerVehicleStatus
      const typedVehicles: DealerVehicle[] = (data || []).map((vehicle) => ({
        ...vehicle,
        status: vehicle.status as DealerVehicleStatus,
        // Ensure photos is an array of strings
        photos: Array.isArray(vehicle.photos)
          ? vehicle.photos.map((photo) => String(photo))
          : [],
        // Convert any null values to undefined for optional fields
        fuel_type: vehicle.fuel_type || undefined,
        transmission: vehicle.transmission || undefined,
        zip_code: vehicle.zip_code || undefined,
      }));

      setVehicles(typedVehicles);
    } catch (err: any) {
      console.error("Error fetching inventory:", err);
      setError(err.message || "Failed to load inventory");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVehicle = async (id: string) => {
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    try {
      // Check if the vehicle belongs to this dealer
      const { data: vehicle, error: checkError } = await supabase
        .from("dealer_vehicles")
        .select("dealer_id")
        .eq("id", id)
        .single();

      if (checkError) throw checkError;

      if (vehicle.dealer_id !== user.id) {
        return {
          success: false,
          error: "Not authorized to delete this vehicle",
        };
      }

      // Perform the deletion
      const { error: deleteError } = await supabase
        .from("dealer_vehicles")
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;
<<<<<<< HEAD
      
      setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
=======

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      return { success: true };
    } catch (err: any) {
      console.error("Error deleting vehicle:", err);
      return {
        success: false,
        error: err.message || "Failed to delete vehicle",
      };
    }
<<<<<<< HEAD
  }, []);

  const uploadPhoto = useCallback(async (photo: File) => {
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

  // Adding refetch method
  const refetch = fetchInventory;
  
  return { vehicles, isLoading, error, fetchInventory, deleteVehicle, uploadPhoto, refetch };
};
=======
  };

  useEffect(() => {
    fetchInventory();
  }, [user]);

  return {
    vehicles,
    isLoading,
    error,
    refetch: fetchInventory,
    deleteVehicle,
  };
}
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
