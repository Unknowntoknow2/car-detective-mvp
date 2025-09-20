
import { useQuery } from "@tanstack/react-query";

export interface ZipLocation {
  "place name": string;
  state: string;
  "state abbreviation": string;
  latitude: string;
  longitude: string;
}

export function useZipValidation() {
  const validateZipCode = async (zipCode: string): Promise<{ isValid: boolean; location?: ZipLocation; error?: string }> => {
    // Basic format validation
    if (!zipCode || zipCode.length !== 5 || !/^\d{5}$/.test(zipCode)) {
      return { isValid: false, error: 'ZIP code must be 5 digits' };
    }

    try {
      const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
      if (response.ok) {
        const data = await response.json();
        return {
          isValid: true,
          location: data.places?.[0]
        };
      } else if (response.status === 404) {
        return { isValid: false, error: 'Invalid ZIP code' };
      } else {
        return { isValid: false, error: 'Unable to validate ZIP code' };
      }
    } catch (error) {
      console.error('ZIP validation error:', error);
      return { isValid: false, error: 'Network error - please try again' };
    }
  };

  const useZipQuery = (zipCode: string) => {
    return useQuery({
      queryKey: ['zipValidation', zipCode],
      queryFn: () => validateZipCode(zipCode),
      enabled: zipCode.length === 5 && /^\d{5}$/.test(zipCode),
      staleTime: 1000 * 60 * 60, // 1 hour
      retry: 2,
      retryDelay: 1000,
    });
  };

  return { validateZipCode, useZipQuery };
}
