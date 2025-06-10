
import { useState, useEffect } from 'react';

export interface DealerOffer {
  id: string;
  offer_amount: number;
  message?: string;
  dealer_id: string;
  created_at: string;
  status: 'sent' | 'viewed' | 'accepted' | 'rejected';
  score?: number;
  recommendation?: 'excellent' | 'good' | 'fair' | 'below_market';
}

export function useDealerOfferComparison(reportId?: string) {
  const [offers, setOffers] = useState<DealerOffer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!reportId) return;

    const fetchOffers = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Mock data for now
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockOffers: DealerOffer[] = [
          {
            id: '1',
            offer_amount: 25000,
            message: 'Great condition vehicle, we can offer competitive pricing',
            dealer_id: 'dealer1',
            created_at: new Date().toISOString(),
            status: 'sent',
            score: 95,
            recommendation: 'excellent'
          }
        ];
        
        setOffers(mockOffers);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch offers'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, [reportId]);

  // Add getBestOffer function
  const getBestOffer = () => {
    if (!offers || offers.length === 0) return null;
    return [...offers].sort((a, b) => (b.score || 0) - (a.score || 0))[0];
  };

  return {
    offers,
    isLoading,
    error,
    getBestOffer
  };
}
