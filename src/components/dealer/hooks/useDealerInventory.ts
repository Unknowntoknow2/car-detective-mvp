
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { DealerVehicle, DealerVehicleStatus } from "@/types/vehicle";

export const useDealerInventory = () => {
  const [vehicles, setVehicles] = useState<DealerVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      return { success: true };
    } catch (err: any) {
      console.error("Error deleting vehicle:", err);
      return {
        success: false,
        error: err.message || "Failed to delete vehicle",
      };
    }
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
};
