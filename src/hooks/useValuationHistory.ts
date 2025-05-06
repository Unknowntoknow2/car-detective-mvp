
import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Valuation } from "@/types/valuation-history";
import { getUserValuations, getSavedValuations, getPremiumValuations } from "@/utils/valuationService";

export function useValuationHistory() {
  const [valuations, setValuations] = useState<Valuation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setValuations([]);
      setIsLoading(false);
      return;
    }

    const fetchValuations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch all types of valuations in parallel
        const [savedValuationsResult, premiumValuationsResult, regularValuationsResult] = await Promise.all([
          getSavedValuations(user.id).catch(err => {
            console.error('Error fetching saved valuations:', err);
            return [] as Valuation[];
          }),
          getPremiumValuations(user.id).catch(err => {
            console.error('Error fetching premium valuations:', err);
            return [] as Valuation[];
          }),
          getUserValuations(user.id).catch(err => {
            console.error('Error fetching user valuations:', err);
            return [] as Valuation[];
          })
        ]);

        // Ensure all results are arrays (fallback protection)
        const savedValuations = Array.isArray(savedValuationsResult) ? savedValuationsResult : [];
        const premiumValuations = Array.isArray(premiumValuationsResult) ? premiumValuationsResult : [];
        const regularValuations = Array.isArray(regularValuationsResult) ? regularValuationsResult : [];
        
        // Format saved valuations with consistent property names
        const formattedSavedValuations = savedValuations.map(val => ({
          ...val,
          is_premium: false,
          premium_unlocked: false // Explicitly set for saved valuations
        }));
        
        // Format regular valuations to add the is_premium flag
        const formattedRegularValuations = regularValuations.map(val => ({
          ...val,
          is_premium: !!val.premium_unlocked
        }));
        
        // Ensure premium valuations have consistent formatting
        const formattedPremiumValuations = premiumValuations.map(val => ({
          ...val,
          is_premium: true,
          premium_unlocked: true // Premium valuations should always have premium_unlocked true
        }));
        
        // Combine and sort by date (most recent first)
        const allValuations = [
          ...formattedSavedValuations,
          ...formattedPremiumValuations,
          ...formattedRegularValuations
        ];
        
        // Sort by date
        const sortedValuations = allValuations.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        // Improved deduplication logic - use an object to track IDs
        // If a valuation appears multiple times, prioritize the premium version
        const valuationMap = new Map<string, Valuation>();
        
        sortedValuations.forEach(valuation => {
          if (!valuation.id) return; // Skip if no ID
          
          // If this ID already exists in our map
          if (valuationMap.has(valuation.id)) {
            const existingValuation = valuationMap.get(valuation.id)!;
            
            // Only replace if current valuation has premium access and existing one doesn't
            if ((valuation.premium_unlocked || valuation.is_premium) && 
                !(existingValuation.premium_unlocked || existingValuation.is_premium)) {
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
        console.error('Error fetching valuations:', error);
        setError(error.message || 'An unknown error occurred');
        toast.error('Failed to load valuation history', {
          description: error.message || 'An unknown error occurred'
        });
        // Set empty array as fallback
        setValuations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchValuations();
  }, [user]);

  return { 
    valuations, 
    isLoading,
    error,
    isEmpty: valuations.length === 0 && !isLoading 
  };
}

// Add a test function that can be imported in tests
export function testDeduplication(valuations: Valuation[]): Valuation[] {
  // Implementation of the deduplication logic for testing
  const valuationMap = new Map<string, Valuation>();
  
  [...valuations]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .forEach(valuation => {
      if (!valuation.id) return;
      
      if (valuationMap.has(valuation.id)) {
        const existingValuation = valuationMap.get(valuation.id)!;
        
        if ((valuation.premium_unlocked || valuation.is_premium) && 
            !(existingValuation.premium_unlocked || existingValuation.is_premium)) {
          valuationMap.set(valuation.id, valuation);
        }
      } else {
        valuationMap.set(valuation.id, valuation);
      }
    });
  
  return Array.from(valuationMap.values());
}
