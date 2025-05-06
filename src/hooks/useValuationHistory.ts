
import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Valuation } from "@/types/valuation-history";
import { getUserValuations, getSavedValuations, getPremiumValuations } from "@/utils/valuationService";

export function useValuationHistory() {
  const [valuations, setValuations] = useState<Valuation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchValuations = async () => {
      setIsLoading(true);
      try {
        // Fetch all types of valuations in parallel
        const [savedValuations, premiumValuations, regularValuations] = await Promise.all([
          getSavedValuations(user.id),
          getPremiumValuations(user.id),
          getUserValuations(user.id)
        ]);
        
        // Format saved valuations
        const formattedSavedValuations = savedValuations.map(val => ({
          ...val,
          is_premium: false
        }));
        
        // Format regular valuations to add the is_premium flag
        const formattedRegularValuations = regularValuations.map(val => ({
          ...val,
          is_premium: val.premium_unlocked || false
        }));
        
        // Combine and sort by date (most recent first)
        const allValuations = [
          ...formattedSavedValuations,
          ...premiumValuations,
          ...formattedRegularValuations
        ].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        // Remove duplicates (if a valuation appears in multiple lists)
        const uniqueValuations = Array.from(
          new Map(allValuations.map(item => [item.id, item])).values()
        );
        
        setValuations(uniqueValuations);
      } catch (error: any) {
        console.error('Error fetching valuations:', error);
        toast.error('Failed to load valuation history', {
          description: error.message || 'An unknown error occurred'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchValuations();
  }, [user]);

  return { valuations, isLoading };
}
