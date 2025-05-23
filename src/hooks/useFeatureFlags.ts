
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';

// Default feature flags
const defaultFlags = {
  showPremiumUpsell: true,
  enableChatbot: true,
  showMarketAnalysis: true,
  enableDealerOffers: false,
  showImageRecognition: false,
  enableAdvancedFilters: false,
  betaFeatures: false
};

export function useFeatureFlags() {
  const [flags, setFlags] = useState(defaultFlags);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFeatureFlags = async () => {
      setIsLoading(true);
      
      try {
        // First check for user-specific overrides
        if (user) {
          const { data: userFlags, error: userError } = await supabase
            .from('user_feature_flags')
            .select('flags')
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (userFlags && !userError) {
            setFlags({
              ...defaultFlags,
              ...userFlags.flags
            });
            setIsLoading(false);
            return;
          }
        }
        
        // Then check for global feature flags
        const { data: globalFlags, error: globalError } = await supabase
          .from('feature_flags')
          .select('*')
          .eq('is_active', true);
          
        if (globalFlags && !globalError) {
          // Convert array of flag records to object
          const flagsObject = globalFlags.reduce((acc, flag) => {
            acc[flag.name] = flag.value;
            return acc;
          }, {} as Record<string, boolean>);
          
          setFlags({
            ...defaultFlags,
            ...flagsObject
          });
        }
      } catch (error) {
        console.error('Error fetching feature flags:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeatureFlags();
  }, [user]);

  return {
    ...flags,
    isLoading
  };
}
