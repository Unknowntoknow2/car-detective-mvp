
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface UseFollowUpDataLoaderProps {
  vin: string;
  initialData?: Partial<FollowUpAnswers>;
}

export function useFollowUpDataLoader({ vin, initialData }: UseFollowUpDataLoaderProps) {
  const [formData, setFormData] = useState<FollowUpAnswers>({
    vin,
    mileage: 0,
    condition: 'good',
    zip_code: '',
    title_status: 'clean',
    transmission: 'automatic',
    previous_use: 'personal',
    previous_owners: 1,
    tire_condition: 'good',
    exterior_condition: 'good',
    interior_condition: 'good',
    brake_condition: 'good',
    dashboard_lights: [],
    loan_balance: 0,
    payoffAmount: 0,
    accidents: {
      hadAccident: false,
      count: 0,
      severity: 'minor',
      repaired: false,
      frameDamage: false
    },
    modifications: {
      hasModifications: false,
      modified: false,
      types: [],
      reversible: true
    },
    serviceHistory: {
      hasRecords: false,
      frequency: 'unknown',
      dealerMaintained: false,
      description: '',
      services: []
    },
    features: [],
    additional_notes: '',
    completion_percentage: 0,
    is_complete: false,
    vehicleConfirmed: false,
    ...initialData
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFollowUpData = async () => {
      if (!vin) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('📋 Loading follow-up data for VIN:', vin);

        // Try to load existing follow-up answers
        const { data: existingAnswers } = await supabase
          .from('follow_up_answers')
          .select('*')
          .eq('vin', vin)
          .maybeSingle();

        if (existingAnswers) {
          console.log('📋 Found existing follow-up answers for VIN:', vin);
          
          // Fix valuation_id linking: resolve by VIN if missing
          let resolvedValuationId = existingAnswers.valuation_id;
          
          if (!resolvedValuationId) {
            console.log('🔗 Resolving missing valuation_id for VIN:', vin);
            
            const { data: valuationData } = await supabase
              .from('valuation_results')
              .select('id')
              .eq('vin', vin)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();
            
            if (valuationData) {
              resolvedValuationId = valuationData.id;
              console.log('✅ Resolved valuation_id:', resolvedValuationId, 'for VIN:', vin);
              
              // Update the follow-up record with the resolved valuation_id
              await supabase
                .from('follow_up_answers')
                .update({ valuation_id: resolvedValuationId })
                .eq('vin', vin);
            } else {
              console.warn('⚠️ No valuation found for VIN during follow-up linking:', vin);
            }
          }
          
          setFormData(prev => ({
            ...prev,
            ...existingAnswers,
            valuation_id: resolvedValuationId,
            // Handle legacy service_history field migration
            serviceHistory: existingAnswers.serviceHistory || {
              hasRecords: Boolean(existingAnswers.service_history),
              description: existingAnswers.service_history || '',
              frequency: 'unknown',
              dealerMaintained: false,
              services: []
            }
          }));
        } else {
          console.log('📋 No existing follow-up data found for VIN:', vin);
          
          // Try to link with an existing valuation even if no follow-up answers exist
          const { data: valuationData } = await supabase
            .from('valuation_results')
            .select('id, year, mileage, condition, zip_code')
            .eq('vin', vin)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
          
          if (valuationData) {
            console.log('🔗 Linking new follow-up to existing valuation:', valuationData.id);
            
            setFormData(prev => ({
              ...prev,
              valuation_id: valuationData.id,
              year: valuationData.year || prev.year,
              mileage: valuationData.mileage || prev.mileage,
              condition: valuationData.condition || prev.condition,
              zip_code: valuationData.zip_code || prev.zip_code
            }));
          }
        }
      } catch (error) {
        console.error('❌ Error loading follow-up data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFollowUpData();
  }, [vin, initialData]);

  return {
    formData,
    setFormData,
    isLoading
  };
}
