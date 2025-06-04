<<<<<<< HEAD

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ValuationResult } from '@/types/valuation';
=======
import { useEffect, useState } from "react";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

// Helper function to validate UUID format
const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// Helper function to validate VIN format
const isValidVIN = (vin: string): boolean => {
  return /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);
};

export function useValuationResult(valuationId: string) {
  return useQuery({
    queryKey: ['valuation-result', valuationId],
    queryFn: async (): Promise<ValuationResult | null> => {
      // Check for invalid or placeholder IDs
      if (!valuationId || valuationId === ':id' || valuationId === '%3Aid') {
        throw new Error('No valuation ID or VIN provided');
      }

      console.log('Fetching valuation data for ID/VIN:', valuationId);
      
      let result = null;
      let apiError = null;

<<<<<<< HEAD
      // First try to fetch by ID if it's a valid UUID
      if (isValidUUID(valuationId)) {
        console.log('Attempting fetch by UUID:', valuationId);
        const response = await supabase
          .from('valuations')
          .select('*')
          .eq('id', valuationId)
          .maybeSingle();
        
        result = response.data;
        apiError = response.error;
      }
      
      // If no result and it looks like a VIN, try fetching by VIN
      if (!result && isValidVIN(valuationId)) {
        console.log('Attempting fetch by VIN:', valuationId);
        const response = await supabase
          .from('valuations')
          .select('*')
          .eq('vin', valuationId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        result = response.data;
        apiError = response.error;
=======
      try {
        // Try to get data from localStorage first (for demo purposes)
        const storedData = localStorage.getItem(`valuation_${valuationId}`);

        if (storedData) {
          const parsedData = JSON.parse(storedData);

          // Add missing properties for display if needed
          if (!parsedData.priceRange) {
            const baseValue = parsedData.estimatedValue || 20000;
            parsedData.priceRange = [
              Math.round(baseValue * 0.95),
              Math.round(baseValue * 1.05),
            ];
          }

          if (!parsedData.adjustments) {
            parsedData.adjustments = [
              {
                factor: "Base Value",
                impact: 0,
                description: "Starting value based on make, model, year",
              },
              {
                factor: "Mileage Adjustment",
                impact: -500,
                description: "Impact of vehicle mileage on value",
              },
              {
                factor: "Condition",
                impact: parsedData.condition === "Excellent"
                  ? 1000
                  : parsedData.condition === "Good"
                  ? 0
                  : parsedData.condition === "Fair"
                  ? -1000
                  : -2000,
                description: `Vehicle is in ${parsedData.condition} condition`,
              },
            ];
          }

          // Ensure id property is set and is not optional for the returned data
          parsedData.id = parsedData.id || valuationId;

          // Add created_at if not present, make sure it's not optional
          parsedData.created_at = parsedData.created_at ||
            new Date().toISOString();

          // Add premium_unlocked if not present
          parsedData.premium_unlocked = parsedData.premium_unlocked || false;

          // Add accident_count if not present
          parsedData.accident_count = parsedData.accident_count || 0;

          // Add titleStatus if not present
          parsedData.titleStatus = parsedData.titleStatus || "Clean";

          setData(parsedData as ValuationResult);
        } else {
          // In a real app, you'd fetch from an API here
          throw new Error("Valuation data not found");
        }
      } catch (err) {
        console.error("Error fetching valuation data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch valuation data",
        );
        setIsError(true); // Set error state
      } finally {
        setIsLoading(false);
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      }

      if (apiError) {
        console.error('Supabase API error:', apiError);
        throw new Error(apiError.message || 'Failed to fetch valuation data');
      }

<<<<<<< HEAD
      if (!result) {
        throw new Error('Valuation not found');
      }
=======
  // Add refetch function to match expected API
  const refetch = () => {
    setIsLoading(true);
    setError(null);
    setIsError(false);

    // Re-trigger the effect by setting a new state
    setTimeout(() => {
      setIsLoading((state) => !state);
    }, 0);
  };
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

      console.log('Valuation data fetched successfully:', result);
      
      // Transform database result to match ValuationResult interface
      const transformedResult: ValuationResult = {
        id: result.id,
        vin: result.vin,
        year: result.year,
        make: result.make,
        model: result.model,
        bodyType: result.body_type,
        fuelType: result.fuel_type,
        transmission: result.transmission,
        color: result.color,
        mileage: result.mileage,
        zipCode: result.state,
        estimatedValue: result.estimated_value,
        confidenceScore: result.confidence_score,
        basePrice: result.base_price,
        isPremium: result.premium_unlocked,
        userId: result.user_id,
        created_at: result.created_at
      };

      return transformedResult;
    },
    enabled: Boolean(valuationId) && valuationId !== ':id' && valuationId !== '%3Aid',
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry if it's a "not found" error
      if (error?.message?.includes('not found') || error?.message?.includes('No valuation ID')) {
        return false;
      }
      return failureCount < 2;
    }
  });
}
