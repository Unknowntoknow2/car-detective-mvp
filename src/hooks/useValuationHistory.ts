<<<<<<< HEAD

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Valuation } from '@/types/valuation-history';
import { ValuationResult } from '@/types/valuation';

// Normalize valuation data from different sources
const normalizeValuation = (valuation: any): Valuation => {
  // Convert property names to match Valuation type
  return {
    id: valuation.id,
    user_id: valuation.user_id,
    year: valuation.year,
    make: valuation.make,
    model: valuation.model,
    mileage: valuation.mileage,
    condition: valuation.condition,
    zipCode: valuation.zipCode || valuation.zip_code,
    estimated_value: valuation.estimated_value || valuation.estimatedValue,
    created_at: valuation.created_at || valuation.createdAt,
    updated_at: valuation.updated_at,
    confidence_score: valuation.confidence_score || valuation.confidenceScore,
    status: valuation.status,
    error_message: valuation.error_message,
    is_premium: valuation.is_premium,
    premium_unlocked: valuation.premium_unlocked,
    accident_count: valuation.accident_count || valuation.accidentCount,
    vin: valuation.vin,
    plate: valuation.plate,
    state: valuation.state,
    valuation: valuation.valuation
  };
};
=======
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { toast } from "sonner";
import type { Valuation } from "@/types/valuation-history";
import {
  getPremiumValuations,
  getSavedValuations,
  getUserValuations,
} from "@/utils/valuationService";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

export function useValuationHistory() {
  const [valuations, setValuations] = useState<Valuation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = supabase.auth.getSession ? 
    (supabase.auth.getSession() as any)?.data?.session?.user?.id : 
    null;

  useEffect(() => {
    if (userId) {
      fetchValuations();
    } else {
      setIsLoading(false);
      setError('User not authenticated');
    }
  }, [userId]);

<<<<<<< HEAD
  const fetchValuations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('valuations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
=======
    const fetchValuations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch all types of valuations in parallel
        const [
          savedValuationsResult,
          premiumValuationsResult,
          regularValuationsResult,
        ] = await Promise.all([
          getSavedValuations(user.id).catch((err) => {
            console.error("Error fetching saved valuations:", err);
            return [] as Valuation[];
          }),
          getPremiumValuations(user.id).catch((err) => {
            console.error("Error fetching premium valuations:", err);
            return [] as Valuation[];
          }),
          getUserValuations(user.id).catch((err) => {
            console.error("Error fetching user valuations:", err);
            return [] as Valuation[];
          }),
        ]);

        // Ensure all results are arrays (fallback protection)
        const savedValuations = Array.isArray(savedValuationsResult)
          ? savedValuationsResult
          : [];
        const premiumValuations = Array.isArray(premiumValuationsResult)
          ? premiumValuationsResult
          : [];
        const regularValuations = Array.isArray(regularValuationsResult)
          ? regularValuationsResult
          : [];

        // Format saved valuations with consistent property names
        const formattedSavedValuations = savedValuations.map((val) => ({
          ...val,
          is_premium: false,
          premium_unlocked: false, // Explicitly set for saved valuations
        }));

        // Format regular valuations to add the is_premium flag
        const formattedRegularValuations = regularValuations.map((val) => ({
          ...val,
          is_premium: !!val.premium_unlocked,
        }));

        // Ensure premium valuations have consistent formatting
        const formattedPremiumValuations = premiumValuations.map((val) => ({
          ...val,
          is_premium: true,
          premium_unlocked: true, // Premium valuations should always have premium_unlocked true
        }));

        // Combine and sort by date (most recent first)
        const allValuations = [
          ...formattedSavedValuations,
          ...formattedPremiumValuations,
          ...formattedRegularValuations,
        ];

        // Sort by date
        const sortedValuations = allValuations.sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        // Improved deduplication logic - use a Map to track IDs
        // If a valuation appears multiple times, prioritize the premium version
        const valuationMap = new Map<string, Valuation>();

        sortedValuations.forEach((valuation) => {
          if (!valuation.id) return; // Skip if no ID

          // If this ID already exists in our map
          if (valuationMap.has(valuation.id)) {
            const existingValuation = valuationMap.get(valuation.id)!;

            // Only replace if current valuation has premium access and existing one doesn't
            if (
              (valuation.premium_unlocked || valuation.is_premium) &&
              !(existingValuation.premium_unlocked ||
                existingValuation.is_premium)
            ) {
              valuationMap.set(valuation.id, valuation);
            }
          } else {
            // Add the valuation if it doesn't exist
            valuationMap.set(valuation.id, valuation);
          }
        });

        // Convert map values back to array
        const uniqueValuations = Array.from(valuationMap.values());

        setValuations(uniqueValuations);
      } catch (error: any) {
        console.error("Error fetching valuations:", error);
        setError(error.message || "An unknown error occurred");
        toast.error("Failed to load valuation history", {
          description: error.message || "An unknown error occurred",
        });
        // Set empty array as fallback
        setValuations([]);
      } finally {
        setIsLoading(false);
      }
    };
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

      if (error) throw error;

<<<<<<< HEAD
      const normalizedValuations = (data || []).map(normalizeValuation);

      setValuations(normalizedValuations);
      return normalizedValuations;
    } catch (err: any) {
      console.error('Error fetching valuation history:', err);
      setError(err.message || 'Failed to fetch valuation history');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Add isEmpty helper method to fix errors in MyValuationsContent.tsx
  const isEmpty = () => valuations.length === 0;

=======
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  return {
    valuations,
    isLoading,
    error,
<<<<<<< HEAD
    fetchValuations,
    isEmpty
  };
}

// Export a test helper function for useValuationHistory.test.ts
export const testDeduplication = (items: any[]) => {
  // Implementation details here (mock for testing)
  return items.filter((value, index, self) => 
    index === self.findIndex((t) => t.id === value.id)
  );
};
=======
    isEmpty: valuations.length === 0 && !isLoading,
  };
}

// Add a test function that can be imported in tests
export function testDeduplication(
  valuations: Valuation[] | null | undefined,
): Valuation[] {
  // Fallback protection for null or undefined input
  if (!valuations) return [];

  // Implementation of the deduplication logic for testing
  const valuationMap = new Map<string, Valuation>();

  [...valuations]
    .sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .forEach((valuation) => {
      if (!valuation.id) return;

      if (valuationMap.has(valuation.id)) {
        const existingValuation = valuationMap.get(valuation.id)!;

        if (
          (valuation.premium_unlocked || valuation.is_premium) &&
          !(existingValuation.premium_unlocked || existingValuation.is_premium)
        ) {
          valuationMap.set(valuation.id, valuation);
        }
      } else {
        valuationMap.set(valuation.id, valuation);
      }
    });

  return Array.from(valuationMap.values());
}
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
