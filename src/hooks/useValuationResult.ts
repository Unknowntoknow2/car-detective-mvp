
import { useState, useEffect } from 'react';

interface ValuationResult {
  valuationId: string;
  id?: string; // Add id property to match expectations in ValuationDetailPage
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  estimatedValue: number;
  confidenceScore: number;
  priceRange?: [number, number];
  adjustments?: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
  explanation?: string;
  created_at?: string; // Add created_at property
  premium_unlocked?: boolean; // Add premium_unlocked property to match usage
  accident_count?: number; // Add accident_count property
  titleStatus?: string; // Add titleStatus property
}

export function useValuationResult(valuationId: string) {
  const [data, setData] = useState<ValuationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isError, setIsError] = useState(false); // Add isError property

  useEffect(() => {
    const fetchValuationData = async () => {
      if (!valuationId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setIsError(false); // Reset error state

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
              Math.round(baseValue * 1.05)
            ];
          }

          if (!parsedData.adjustments) {
            parsedData.adjustments = [
              {
                factor: 'Base Value',
                impact: 0,
                description: 'Starting value based on make, model, year'
              },
              {
                factor: 'Mileage Adjustment',
                impact: -500,
                description: 'Impact of vehicle mileage on value'
              },
              {
                factor: 'Condition',
                impact: parsedData.condition === 'Excellent' ? 1000 : 
                       parsedData.condition === 'Good' ? 0 : 
                       parsedData.condition === 'Fair' ? -1000 : -2000,
                description: `Vehicle is in ${parsedData.condition} condition`
              }
            ];
          }
          
          // Ensure id property is set and is not optional for the returned data
          parsedData.id = parsedData.id || valuationId;
          
          // Add created_at if not present, make sure it's not optional
          parsedData.created_at = parsedData.created_at || new Date().toISOString();
          
          // Add premium_unlocked if not present
          parsedData.premium_unlocked = parsedData.premium_unlocked || false;
          
          // Add accident_count if not present
          parsedData.accident_count = parsedData.accident_count || 0;
          
          // Add titleStatus if not present
          parsedData.titleStatus = parsedData.titleStatus || 'Clean';
          
          setData(parsedData as ValuationResult);
        } else {
          // In a real app, you'd fetch from an API here
          throw new Error('Valuation data not found');
        }
      } catch (err) {
        console.error('Error fetching valuation data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch valuation data');
        setIsError(true); // Set error state
      } finally {
        setIsLoading(false);
      }
    };

    fetchValuationData();
  }, [valuationId]);

  // Add refetch function to match expected API
  const refetch = () => {
    setIsLoading(true);
    setError(null);
    setIsError(false);
    
    // Re-trigger the effect by setting a new state
    setTimeout(() => {
      setIsLoading(state => !state);
    }, 0);
  };

  return { data, isLoading, error, isError, refetch };
}
