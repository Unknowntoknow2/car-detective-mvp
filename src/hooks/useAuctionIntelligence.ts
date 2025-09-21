
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuctionIntelligenceData } from '@/types/auctionIntelligence';

export function useAuctionIntelligence(vin: string) {
  const [data, setData] = useState<AuctionIntelligenceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!vin) {
      setIsLoading(false);
      return;
    }

    const fetchIntelligence = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // First, try to get existing intelligence
        const { data: existingData, error: fetchError } = await supabase
          .from('auction_intelligence_by_vin')
          .select('*')
          .eq('vin', vin)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error fetching auction intelligence:', fetchError);
          setError('Failed to fetch auction intelligence');
          setIsLoading(false);
          return;
        }

        // If no data exists or data is older than 24 hours, generate new intelligence
        const shouldGenerate = !existingData || 
          (new Date().getTime() - new Date(existingData.updated_at).getTime()) > 24 * 60 * 60 * 1000;

        if (shouldGenerate) {
          
          // Trigger intelligence generation
          const { error: functionError } = await supabase.functions.invoke('generate-auction-intelligence', {
            body: { vin }
          });

          if (functionError) {
            console.error('Error generating auction intelligence:', functionError);
            // Don't fail completely, use existing data if available
            if (existingData) {
              setData(existingData);
            } else {
              setError('Failed to generate auction intelligence');
            }
            setIsLoading(false);
            return;
          }

          // Fetch the newly generated data
          const { data: newData, error: refetchError } = await supabase
            .from('auction_intelligence_by_vin')
            .select('*')
            .eq('vin', vin)
            .single();

          if (refetchError) {
            console.error('Error fetching updated auction intelligence:', refetchError);
            if (existingData) {
              setData(existingData);
            } else {
              setError('Failed to fetch updated intelligence');
            }
          } else {
            setData(newData);
          }
        } else {
          setData(existingData);
        }
      } catch (err) {
        console.error('Error in useAuctionIntelligence:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIntelligence();
  }, [vin]);

  return { data, isLoading, error };
}
