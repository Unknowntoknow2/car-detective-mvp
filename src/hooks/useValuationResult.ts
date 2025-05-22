
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ValuationResult } from '@/types/valuation';
import { toast } from 'sonner';

interface UseValuationResultReturn {
  data: ValuationResult | null;
  isLoading: boolean;
  error: string | null;
  isError: boolean;
  refetch: () => void;
}

export function useValuationResult(valuationId: string): UseValuationResultReturn {
  const [data, setData] = useState<ValuationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchValuationData = async () => {
      if (!valuationId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setIsError(false);

      try {
        // First try to fetch from Supabase
        const { data: supabaseData, error: supabaseError } = await supabase
          .from('valuations')
          .select('*')
          .eq('id', valuationId)
          .single();
          
        if (supabaseError) {
          throw supabaseError;
        }
        
        if (supabaseData) {
          // Process the data to match ValuationResult interface
          const processedData: ValuationResult = {
            id: supabaseData.id,
            estimatedValue: supabaseData.estimated_value || 0,
            estimated_value: supabaseData.estimated_value || 0,
            confidenceScore: supabaseData.confidence_score || 85,
            confidence_score: supabaseData.confidence_score || 85,
            priceRange: supabaseData.price_range || [
              Math.round((supabaseData.estimated_value || 0) * 0.95),
              Math.round((supabaseData.estimated_value || 0) * 1.05)
            ],
            adjustments: supabaseData.adjustments || [],
            make: supabaseData.make || '',
            model: supabaseData.model || '',
            year: supabaseData.year || new Date().getFullYear(),
            mileage: supabaseData.mileage || 0,
            condition: supabaseData.condition || 'Good',
            vin: supabaseData.vin,
            isPremium: supabaseData.is_premium || false,
            is_premium: supabaseData.is_premium || false,
            premium_unlocked: supabaseData.premium_unlocked || false,
            features: supabaseData.features || [],
            color: supabaseData.color,
            bodyStyle: supabaseData.body_style,
            bodyType: supabaseData.body_type,
            fuelType: supabaseData.fuel_type,
            fuel_type: supabaseData.fuel_type,
            explanation: supabaseData.explanation || supabaseData.gpt_explanation,
            gptExplanation: supabaseData.gpt_explanation,
            transmission: supabaseData.transmission,
            bestPhotoUrl: supabaseData.best_photo_url,
            photoUrl: supabaseData.photo_url,
            photo_url: supabaseData.photo_url,
            photoScore: supabaseData.photo_score,
            photoExplanation: supabaseData.photo_explanation,
            pdfUrl: supabaseData.pdf_url,
            userId: supabaseData.user_id,
            zipCode: supabaseData.zip_code || supabaseData.zip,
            zip_code: supabaseData.zip_code,
            zip: supabaseData.zip,
            aiCondition: supabaseData.ai_condition,
            photoUrls: supabaseData.photo_urls || [],
            trim: supabaseData.trim,
            created_at: supabaseData.created_at,
            conditionScore: supabaseData.condition_score,
            regionName: supabaseData.region_name,
            conditionNotes: supabaseData.condition_notes || []
          };
          
          setData(processedData);
        } else {
          // Fallback to local storage for demo/development
          const storedData = localStorage.getItem(`valuation_${valuationId}`);
          
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            
            // Add missing properties if needed
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
            
            parsedData.id = parsedData.id || valuationId;
            parsedData.created_at = parsedData.created_at || new Date().toISOString();
            parsedData.premium_unlocked = parsedData.premium_unlocked || false;
            parsedData.accident_count = parsedData.accident_count || 0;
            parsedData.titleStatus = parsedData.titleStatus || 'Clean';
            
            setData(parsedData as ValuationResult);
          } else {
            throw new Error('Valuation data not found');
          }
        }
      } catch (err) {
        console.error('Error fetching valuation data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch valuation data';
        setError(errorMessage);
        setIsError(true);
        toast.error('Error loading valuation', {
          description: errorMessage
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchValuationData();
  }, [valuationId]);

  const refetch = () => {
    setIsLoading(true);
    setError(null);
    setIsError(false);
    setTimeout(() => {
      setIsLoading(state => !state);
    }, 0);
  };

  return { data, isLoading, error, isError, refetch };
}
