
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ZipLocation {
  "place name": string;
  state: string;
  "state abbreviation": string;
  latitude: string;
  longitude: string;
}

export function useZipValidation() {
  const validateZipCode = async (zipCode: string): Promise<{ isValid: boolean; location?: ZipLocation }> => {
    if (!zipCode || zipCode.length !== 5 || !/^\d{5}$/.test(zipCode)) {
      return { isValid: false };
    }

    try {
      const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
      if (response.ok) {
        const data = await response.json();
        return {
          isValid: true,
          location: data.places?.[0]
        };
      }
      return { isValid: false };
    } catch (error) {
      console.error('ZIP validation error:', error);
      return { isValid: false };
    }
  };

  const useZipQuery = (zipCode: string) => {
    return useQuery({
      queryKey: ['zipValidation', zipCode],
      queryFn: () => validateZipCode(zipCode),
      enabled: zipCode.length === 5,
      staleTime: 1000 * 60 * 60, // 1 hour
    });
  };

  return { validateZipCode, useZipQuery };
}
