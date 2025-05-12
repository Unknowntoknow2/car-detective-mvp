
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { usePremiumDealer } from '@/hooks/usePremiumDealer';

export interface DealerInsightsData {
  offerMetrics: {
    totalOffers: number;
    acceptedOffers: number;
    rejectedOffers: number;
    pendingOffers: number;
    avgOfferScore: number;
    offersByLabel: {
      label: string;
      count: number;
    }[];
  };
  leadMetrics: {
    totalLeads: number;
    leadsBySource: {
      source: string;
      count: number;
    }[];
    leadsByZip: {
      zip: string;
      count: number;
      avgScore?: number;
    }[];
  };
  timeMetrics?: {
    avgResponseTime: number;
    responseOverTime: {
      date: string;
      count: number;
    }[];
  };
}

export function useDealerInsights() {
  const { user } = useAuth();
  const { isPremium } = usePremiumDealer();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dealer-insights', user?.id, isPremium],
    queryFn: async (): Promise<DealerInsightsData> => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      try {
        // Fetch offer metrics
        const { data: offerData, error: offerError } = await supabase
          .from('dealer_offers')
          .select('id, status, score, label, created_at')
          .eq('dealer_id', user.id);

        if (offerError) throw offerError;
        
        // Process offer data
        const totalOffers = offerData?.length || 0;
        const acceptedOffers = offerData?.filter(offer => offer.status === 'accepted').length || 0;
        const rejectedOffers = offerData?.filter(offer => offer.status === 'rejected').length || 0;
        const pendingOffers = offerData?.filter(offer => ['sent', 'viewed', 'pending'].includes(offer.status)).length || 0;
        
        // Calculate average score
        const scores = offerData?.map(offer => offer.score).filter(Boolean) || [];
        const avgOfferScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
        
        // Group offers by label
        const labelCounts: Record<string, number> = {};
        offerData?.forEach(offer => {
          const label = offer.label || 'Unlabeled';
          labelCounts[label] = (labelCounts[label] || 0) + 1;
        });
        
        const offersByLabel = Object.entries(labelCounts).map(([label, count]) => ({ label, count }));
        
        // Fetch valuations data to get lead sources and zip codes
        const { data: valuationsData, error: valuationsError } = await supabase
          .from('valuations')
          .select('id, state, created_at, is_vin_lookup')
          .order('created_at', { ascending: false });
          
        if (valuationsError) throw valuationsError;
        
        // Process lead sources
        const sourceCounts: Record<string, number> = {
          'VIN Lookup': 0,
          'Manual Entry': 0
        };
        
        valuationsData?.forEach(valuation => {
          const source = valuation.is_vin_lookup ? 'VIN Lookup' : 'Manual Entry';
          sourceCounts[source] = (sourceCounts[source] || 0) + 1;
        });
        
        const leadsBySource = Object.entries(sourceCounts).map(([source, count]) => ({ source, count }));
        
        // Group by ZIP code
        const zipCounts: Record<string, { count: number, scores: number[] }> = {};
        
        // For premium dealers, fetch offers with associated valuations to get ZIP data
        let zipData: any[] = [];
        
        if (isPremium) {
          const { data: offerZipData, error: offerZipError } = await supabase
            .from('dealer_offers')
            .select(`
              id, 
              score, 
              valuations:report_id (
                state
              )
            `)
            .eq('dealer_id', user.id);
            
          if (offerZipError) throw offerZipError;
          zipData = offerZipData || [];
        }
        
        zipData.forEach(item => {
          if (item.valuations?.state) {
            const zip = item.valuations.state;
            if (!zipCounts[zip]) {
              zipCounts[zip] = { count: 0, scores: [] };
            }
            zipCounts[zip].count += 1;
            if (item.score) {
              zipCounts[zip].scores.push(item.score);
            }
          }
        });
        
        // Calculate average score per ZIP for premium users
        const leadsByZip = Object.entries(zipCounts).map(([zip, data]) => ({
          zip,
          count: data.count,
          avgScore: data.scores.length 
            ? data.scores.reduce((a, b) => a + b, 0) / data.scores.length 
            : undefined
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
        
        // For premium dealers, calculate response times
        let timeMetrics = undefined;
        
        if (isPremium) {
          const { data: timeData, error: timeError } = await supabase
            .from('dealer_offers')
            .select('created_at, updated_at')
            .eq('dealer_id', user.id)
            .order('created_at', { ascending: false });
            
          if (!timeError && timeData) {
            // Calculate average response time (time between created_at and updated_at)
            const responseTimes = timeData
              .filter(item => item.updated_at && item.created_at)
              .map(item => {
                const created = new Date(item.created_at);
                const updated = new Date(item.updated_at);
                return (updated.getTime() - created.getTime()) / (1000 * 60 * 60); // hours
              });
              
            const avgResponseTime = responseTimes.length 
              ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
              : 0;
              
            // Group by date for timeline
            const responseByDate: Record<string, number> = {};
            timeData.forEach(item => {
              const date = new Date(item.created_at).toISOString().split('T')[0];
              responseByDate[date] = (responseByDate[date] || 0) + 1;
            });
            
            const responseOverTime = Object.entries(responseByDate)
              .map(([date, count]) => ({ date, count }))
              .sort((a, b) => a.date.localeCompare(b.date))
              .slice(-14); // Last 14 days
              
            timeMetrics = {
              avgResponseTime,
              responseOverTime
            };
          }
        }
        
        return {
          offerMetrics: {
            totalOffers,
            acceptedOffers,
            rejectedOffers,
            pendingOffers,
            avgOfferScore,
            offersByLabel
          },
          leadMetrics: {
            totalLeads: valuationsData?.length || 0,
            leadsBySource,
            leadsByZip
          },
          timeMetrics
        };
      } catch (error) {
        console.error('Error fetching dealer insights:', error);
        throw error;
      }
    },
    enabled: !!user,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  return {
    data,
    isLoading,
    error,
    refetch
  };
}
