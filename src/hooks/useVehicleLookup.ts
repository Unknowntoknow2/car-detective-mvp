
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { invokeFunction, ApiErrorType, handleApiError } from '@/utils/api-utils';

export const useVehicleLookup = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [vehicle, setVehicle] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const lookupVehicle = async (
    type: 'vin' | 'plate' | 'manual' | 'photo', 
    identifier: string, 
    state?: string, 
    manualData?: any,
    imageData?: any
  ) => {
    setIsLoading(true);
    setError(null);
    setErrorDetails(null);
    
    try {
      let payload: any = {};
      
      if (type === 'vin') {
        payload = { type, vin: identifier };
        toast.info("Looking up VIN...");
      } else if (type === 'plate') {
        payload = { type, licensePlate: identifier, state };
        toast.info(`Looking up plate ${identifier} (${state})...`);
      } else if (type === 'manual' || type === 'photo') {
        payload = { type, manual: manualData || imageData };
        const source = type === 'manual' ? 'manual entry' : 'photo analysis';
        toast.info(`Processing ${source} data...`);
      }
      
      // For photo analysis, we skip the API call and use the mock data directly
      // In a production app, you would call a real computer vision API
      if (type === 'photo' && identifier === 'photo-analysis') {
        // Simulate API response delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Use the data passed in imageData
        setVehicle(imageData);
        
        toast.success(`Identified vehicle: ${imageData.year} ${imageData.make} ${imageData.model}`);
        
        // Save to sessionStorage for persistence between tabs
        sessionStorage.setItem('identified_vehicle', JSON.stringify(imageData));
        
        return imageData;
      }
      
      console.log("Sending payload to unified-decode:", payload);
      
      // Use our enhanced API function
      const response = await invokeFunction('unified-decode', payload, {
        showToast: false // We'll handle custom toasts
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      const data = response.data;
      console.log("Received response:", data);
      
      if (!data || data.decoded?.error) {
        throw new Error(data?.decoded?.error || "Invalid response from server");
      }
      
      setVehicle(data.decoded);
      
      // Save to sessionStorage for persistence between tabs
      sessionStorage.setItem('identified_vehicle', JSON.stringify(data.decoded));
      
      if (type === 'vin') {
        toast.success(`Found vehicle: ${data.decoded.year} ${data.decoded.make} ${data.decoded.model}`);
      } else if (type === 'plate') {
        toast.success(`Found vehicle with plate ${identifier}: ${data.decoded.year} ${data.decoded.make} ${data.decoded.model}`);
      } else if (type === 'manual') {
        toast.success(`Vehicle details validated: ${data.decoded.year} ${data.decoded.make} ${data.decoded.model}`);
      }
      
      return data.decoded;
    } catch (err: any) {
      const enhancedError = handleApiError(err);
      
      console.error(`Vehicle lookup error (${type}):`, enhancedError);
      setError(enhancedError.message);
      setErrorDetails(enhancedError.details || null);
      
      // Show specific toasts based on error type
      if (enhancedError.type === ApiErrorType.NOT_FOUND) {
        if (type === 'vin') {
          toast.error(`VIN ${identifier} not found. Please check and try again.`);
        } else if (type === 'plate') {
          toast.error(`Plate ${identifier} (${state}) not found. Please check and try again.`);
        } else {
          toast.error("Vehicle not found. Please check your information and try again.");
        }
      } else if (enhancedError.type === ApiErrorType.RATE_LIMIT) {
        toast.error("We're experiencing high demand. Please try again in a few minutes.");
      } else if (enhancedError.type === ApiErrorType.NETWORK) {
        toast.error("Network error. Please check your connection and try again.");
      } else if (enhancedError.type === ApiErrorType.SERVER) {
        toast.error("Server error. Our team has been notified and we're working on it.");
      } else {
        toast.error(enhancedError.message);
      }
      
      setVehicle(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const reset = () => {
    setVehicle(null);
    setError(null);
    setErrorDetails(null);
    sessionStorage.removeItem('identified_vehicle');
  };

  // Try to load vehicle from sessionStorage on initialization
  const loadSavedVehicle = () => {
    try {
      const savedVehicle = sessionStorage.getItem('identified_vehicle');
      if (savedVehicle) {
        return JSON.parse(savedVehicle);
      }
    } catch (error) {
      console.error("Error loading saved vehicle:", error);
    }
    return null;
  };

  return {
    lookupVehicle,
    isLoading,
    vehicle: vehicle || loadSavedVehicle(),
    error,
    errorDetails,
    reset
  };
};
