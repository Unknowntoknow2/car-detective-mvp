
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ValuationFactor {
  id: string;
  factor_name: string;
  step: number;
  multiplier: number;
  label: string;
  tip: string;
}

export interface ConditionOption {
  value: number;
  label: string;
  tip: string;
  multiplier: number;
}

export interface CategoryFactors {
  [key: string]: ConditionOption[];
}

export const useValuationFactors = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [factors, setFactors] = useState<ValuationFactor[]>([]);
  const [categoryFactors, setCategoryFactors] = useState<Record<string, CategoryFactors>>({});
  
  useEffect(() => {
    const fetchFactors = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('valuation_factors')
          .select('*')
          .order('step', { ascending: true });
          
        if (error) throw error;
        
        setFactors(data || []);
        
        // Transform the data into the format we need for the UI
        const factorsByCategory: Record<string, CategoryFactors> = {};
        
        // Process all factors
        data?.forEach(factor => {
          const [category, name] = factor.factor_name.split('_');
          
          if (!factorsByCategory[category]) {
            factorsByCategory[category] = {};
          }
          
          if (!factorsByCategory[category][name]) {
            factorsByCategory[category][name] = [];
          }
          
          // Map step (0-4) to slider value (0-100)
          const value = factor.step * 25;
          
          factorsByCategory[category][name].push({
            value,
            label: factor.label,
            tip: factor.tip,
            multiplier: factor.multiplier
          });
        });
        
        setCategoryFactors(factorsByCategory);
      } catch (err) {
        console.error('Error fetching valuation factors:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch valuation factors');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFactors();
  }, []);
  
  return { factors, categoryFactors, isLoading, error };
};
