import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ReportData } from '@/utils/pdf/types';

interface Valuation {
  id: string;
  created_at: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  estimated_value: number;
  data: any; // JSONB data
}

interface UseDealerValuationsResult {
  valuations: ReportData[];
  loading: boolean;
  error: Error | null;
}

export function useDealerValuations(dealerId: string): UseDealerValuationsResult {
  const [valuations, setValuations] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchValuations = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from<Valuation>('valuations')
          .select('*')
          .eq('dealer_id', dealerId);

        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          const reportData: ReportData[] = data.map(valuation => ({
            vin: valuation.data?.vin || 'Unknown',
            make: valuation.make,
            model: valuation.model,
            year: valuation.year,
            mileage: valuation.mileage.toString(),
            condition: (valuation.condition as 'Excellent' | 'Good' | 'Fair' | 'Poor'),
            zipCode: valuation.data?.zipCode || '',
            estimatedValue: valuation.estimated_value,
            confidenceScore: valuation.data?.confidence_score || 75,
            color: valuation.data?.color || 'Not Specified',
            bodyStyle: valuation.data?.bodyStyle || 'Not Specified',
            bodyType: valuation.data?.bodyType || 'Not Specified',
            fuelType: valuation.data?.fuelType || 'Not Specified',
            explanation: valuation.data?.explanation || 'No explanation available.',
            isPremium: valuation.data?.isPremium || false,
            valuationId: valuation.id,
            aiCondition: valuation.data?.aiCondition || null,
            bestPhotoUrl: valuation.data?.bestPhotoUrl || null,
            photoExplanation: valuation.data?.photoExplanation || null,
            transmission: valuation.data?.transmission || 'Not Specified',
            priceRange: valuation.data?.priceRange || [
              Math.round(valuation.estimated_value * 0.95),
              Math.round(valuation.estimated_value * 1.05)
            ],
            plate: valuation.data?.plate || 'Not Specified',
            state: valuation.data?.state || 'Not Specified',
            adjustments: valuation.data?.adjustments || []
          }));
          setValuations(reportData);
        }
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchValuations();
  }, [dealerId]);

  return { valuations, loading, error };
}
