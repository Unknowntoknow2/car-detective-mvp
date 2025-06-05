// ✅ FILE: src/components/valuation/ValuationResult.tsx

import React, { useEffect, useState } from 'react';
import { ValuationResults } from './ValuationResults';
import { supabase } from '@/lib/supabaseClient';

interface ValuationResultProps {
  valuationId: string;
  isManualValuation?: boolean;
}

export const ValuationResult: React.FC<ValuationResultProps> = ({
  valuationId,
  isManualValuation = false,
}) => {
  const [loading, setLoading] = useState(true);
  const [valuation, setValuation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchValuation = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('valuations')
        .select('*')
        .eq('id', valuationId)
        .single();

      if (error || !data) {
        console.error('❌ Valuation fetch failed:', error?.message || 'Not found');
        setError('Valuation not found or has been deleted.');
      } else {
        setValuation(data);
      }

      setLoading(false);
    };

    fetchValuation();
  }, [valuationId]);

  if (loading) return <div className="p-4">Loading valuation...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <ValuationResults
      estimatedValue={valuation.estimated_value || 0}
      confidenceScore={valuation.confidence_score || 0}
      basePrice={valuation.base_price || 0}
      priceRange={
        valuation.min_price && valuation.max_price
          ? [valuation.min_price, valuation.max_price]
          : undefined
      }
      adjustments={valuation.adjustments || []}
      demandFactor={valuation.market_demand}
      valuationId={valuation.id}
      vehicleInfo={{
        year: parseInt(valuation.year),
        make: valuation.make,
        model: valuation.model,
        trim: valuation.trim,
        mileage: valuation.mileage,
        condition: valuation.condition,
      }}
      onDownloadPdf={() => {
        console.log('TODO: Hook up PDF download');
      }}
      onEmailReport={() => {
        console.log('TODO: Hook up email sending');
      }}
    />
  );
};
