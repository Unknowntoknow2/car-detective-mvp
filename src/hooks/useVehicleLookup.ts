<<<<<<< HEAD

import { useState } from 'react';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';
import { toast } from 'sonner';
=======
import { useState } from "react";
import { useVinDecoder } from "./useVinDecoder";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface VehicleLookupResult {
  isLoading: boolean;
  error: string | null;
  vehicle: DecodedVehicleInfo | null;
  vehicleData: DecodedVehicleInfo | null;
  lookupVehicle: (type: 'vin' | 'plate' | 'manual' | 'photo', value: string, state?: string, manualData?: ManualEntryFormData) => Promise<DecodedVehicleInfo | null>;
  lookupByVin: (vin: string) => Promise<DecodedVehicleInfo | null>;
  lookupByPlate: (plate: string, state: string) => Promise<DecodedVehicleInfo | null>;
  reset: () => void;
}

export function useVehicleLookup(): VehicleLookupResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vehicle, setVehicle] = useState<DecodedVehicleInfo | null>(null);

  const reset = () => {
    setVehicle(null);
    setError(null);
  };

  const lookupVehicle = async (
<<<<<<< HEAD
    type: 'vin' | 'plate' | 'manual' | 'photo', 
    value: string, 
    state?: string,
    manualData?: ManualEntryFormData
  ): Promise<DecodedVehicleInfo | null> => {
=======
    identifierType: "vin" | "plate" | "manual" | "photo",
    identifier: string,
    state?: string,
    manualData?: any,
  ) => {
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    setIsLoading(true);
    setError(null);

    try {
<<<<<<< HEAD
      let result: DecodedVehicleInfo | null = null;
      
      if (type === 'manual' && manualData) {
        result = {
          vin: manualData.vin || 'MANUAL_ENTRY',
          make: manualData.make,
          model: manualData.model,
          year: manualData.year,
          mileage: manualData.mileage,
          trim: manualData.trim,
          fuelType: manualData.fuelType,
          transmission: manualData.transmission,
          bodyType: manualData.bodyStyle,
          exteriorColor: manualData.color,
          estimatedValue: 25000,
          confidenceScore: 80,
          valuationId: `manual-${Date.now()}`
        };
      } else if (type === 'vin') {
        // Mock VIN decode
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        result = {
          vin: value,
          make: 'Toyota',
          model: 'Camry',
          year: 2019,
          mileage: 45000,
          trim: 'SE',
          engine: '2.5L I4',
          transmission: 'Automatic',
          drivetrain: 'FWD',
          bodyType: 'Sedan',
          fuelType: 'Gasoline',
          exteriorColor: 'Silver',
          features: ['Bluetooth', 'Backup Camera', 'Alloy Wheels'],
          estimatedValue: 24000,
          confidenceScore: 85,
          valuationId: `vin-${Date.now()}`
        };
      } else if (type === 'plate') {
        // Mock plate decode
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        result = {
          vin: 'PLATE123456789ABCD',
          make: 'Honda',
          model: 'Accord',
          year: 2018,
          mileage: 52000,
          trim: 'EX-L',
          engine: '1.5L I4 Turbo',
          transmission: 'CVT',
          drivetrain: 'FWD',
          bodyType: 'Sedan',
          fuelType: 'Gasoline',
          exteriorColor: 'Blue',
          features: ['Bluetooth', 'Navigation', 'Leather Seats'],
          estimatedValue: 22000,
          confidenceScore: 80,
          valuationId: `plate-${Date.now()}`
        };
      }
      
      setVehicle(result);
=======
      let result;
      let valuationId;

      if (identifierType === "vin") {
        // VIN lookup
        result = await lookupVin(identifier);

        if (result) {
          console.log("VIN lookup successful:", result);

          try {
            // Create a valuation record to return to the user
            const { data: valuationData, error: valuationError } =
              await supabase
                .from("valuations")
                .insert({
                  user_id: (await supabase.auth.getUser()).data.user?.id ||
                    "00000000-0000-0000-0000-000000000000",
                  vin: result.vin,
                  make: result.make,
                  model: result.model,
                  year: result.year,
                  is_vin_lookup: true,
                  confidence_score: 85,
                  condition_score: 7,
                })
                .select("id")
                .single();

            if (valuationError) {
              console.error("Error creating valuation record:", valuationError);
              // Create a fallback ID if we can't save to the database
              valuationId = crypto.randomUUID();
              console.log(
                "Using fallback ID due to database error:",
                valuationId,
              );
            } else {
              valuationId = valuationData?.id;
              console.log("Created valuation record with ID:", valuationId);
            }
          } catch (dbError) {
            console.error("Database operation failed:", dbError);
            // Create a fallback ID if the database operation fails
            valuationId = crypto.randomUUID();
            console.log(
              "Using fallback ID due to database error:",
              valuationId,
            );
          }

          if (valuationId) {
            localStorage.setItem("latest_valuation_id", valuationId);
            console.log("Saved valuation ID to localStorage:", valuationId);
            toast.success(
              `Found: ${result.year} ${result.make} ${result.model}`,
            );
          }

          const vehicleWithId = {
            ...result,
            id: valuationId,
          };

          setVehicle(vehicleWithId);
          return vehicleWithId;
        }
      }
      // Add handling for other lookup types here

      return null;
    } catch (err) {
      const message = err instanceof Error
        ? err.message
        : "Failed to lookup vehicle";
      setError(message);
      toast.error(message);
      return null;
    } finally {
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      setIsLoading(false);
      return result;
      
    } catch (error: any) {
      console.error('Vehicle lookup error:', error);
      setError(error.message || 'Failed to lookup vehicle');
      setIsLoading(false);
      return null;
    }
  };

  const lookupByVin = async (vin: string): Promise<DecodedVehicleInfo | null> => {
    return lookupVehicle('vin', vin);
  };

  const lookupByPlate = async (plate: string, state: string): Promise<DecodedVehicleInfo | null> => {
    return lookupVehicle('plate', plate, state);
  };

  return {
    isLoading,
    error,
    vehicle,
<<<<<<< HEAD
    vehicleData: vehicle, // Alias for compatibility
    lookupVehicle,
    lookupByVin,
    lookupByPlate,
    reset
=======
    reset, // Export the reset function
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  };
}
