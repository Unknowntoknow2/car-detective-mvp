
import { useState, useEffect } from 'react';
import { calculateAccidentImpact } from '@/utils/valuation/valuationEngine';
import { supabase } from '@/lib/supabaseClient';

interface AccidentImpactResult {
  percentImpact: number;
  dollarImpact: number;
  description: string;
  recommendations: string[];
  isPremium: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AccidentDetails {
  count?: number;
  severity?: 'minor' | 'moderate' | 'severe';
  description?: string;
  hasCarfaxData?: boolean;
}

export function useAccidentImpact(
  baseValue: number = 0,
  accidentDetails: AccidentDetails = {},
  vin?: string,
  valuationId?: string
): AccidentImpactResult {
  const [result, setResult] = useState<Omit<AccidentImpactResult, 'isLoading' | 'error'>>({
    percentImpact: 0,
    dollarImpact: 0,
    description: '',
    recommendations: [],
    isPremium: false
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function analyzeAccidentImpact() {
      if (baseValue <= 0) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Check if user has premium access (for enhanced insights)
        const { data: { user } } = await supabase.auth.getUser();
        
        let isPremiumUser = false;
        if (user) {
          const { data: premiumAccess } = await supabase
            .from('premium_valuations')
            .select('*')
            .eq('user_id', user.id)
            .eq('valuation_id', valuationId)
            .maybeSingle();
            
          isPremiumUser = !!premiumAccess;
        }

        // Get CARFAX data if available (for premium users with VIN)
        let carfaxData = null;
        if (isPremiumUser && vin && valuationId) {
          const { data: vehicleHistory } = await supabase
            .from('vehicle_histories')
            .select('report_data')
            .eq('valuation_id', valuationId)
            .maybeSingle();
            
          carfaxData = vehicleHistory?.report_data;
        }

        // Determine accident count and severity
        const accidentCount = carfaxData?.accidentsReported || accidentDetails.count || 0;
        const severity = carfaxData?.damageSeverity?.toLowerCase() || accidentDetails.severity || 'minor';
        
        // Calculate impact
        const impact = calculateAccidentImpact(baseValue, accidentCount, severity);
        
        // Generate description and recommendations
        let description = '';
        const recommendations = [];
        
        if (accidentCount === 0) {
          description = 'No accidents reported. This positively affects your vehicle value.';
          recommendations.push('Maintain clean driving record');
          recommendations.push('Keep documentation of vehicle service history');
        } else {
          const severityText = severity === 'severe' ? 'severe' : severity === 'moderate' ? 'moderate' : 'minor';
          const impactPercent = Math.abs(impact.percentImpact * 100).toFixed(1);
          
          description = `${accidentCount} ${severityText} accident${accidentCount > 1 ? 's' : ''} reported, reducing value by approximately ${impactPercent}%.`;
          
          recommendations.push('Provide repair documentation to potential buyers');
          recommendations.push('Consider getting a detailed inspection report');
          
          if (!isPremiumUser) {
            recommendations.push('Unlock Premium for comprehensive accident analysis');
          }
        }

        setResult({
          percentImpact: impact.percentImpact,
          dollarImpact: impact.dollarImpact,
          description,
          recommendations,
          isPremium: isPremiumUser
        });
      } catch (err) {
        console.error('Error analyzing accident impact:', err);
        setError('Failed to analyze accident impact. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    analyzeAccidentImpact();
  }, [baseValue, accidentDetails, vin, valuationId]);

  return {
    ...result,
    isLoading,
    error
  };
}
