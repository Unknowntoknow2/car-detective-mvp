
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDealerOffers } from '@/hooks/useDealerOffers';
import { useAuth } from '@/contexts/AuthContext';
import { useValuationResult } from '@/hooks/useValuationResult';
import { showDealerOfferNotification } from '@/components/notifications/DealerOfferNotification';

/**
 * Component that monitors dealer offers and shows notifications
 * This should be mounted in a top-level component that's always present
 */
export function DealerOffersTracker() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { offers } = useDealerOffers();
  
  // Track seen offers to avoid showing duplicates
  useEffect(() => {
    if (!user || !offers.length) return;
    
    // Get previously seen offers from localStorage
    const seenOfferIds = JSON.parse(localStorage.getItem('seen_offer_ids') || '[]');
    const newOffers = offers.filter(offer => 
      !seenOfferIds.includes(offer.id) && offer.status === 'sent'
    );
    
    if (newOffers.length === 0) return;
    
    // Show notifications for new offers
    newOffers.forEach(async (offer) => {
      try {
        // Fetch valuation details for this offer
        const { data: valuation } = await useValuationResult(offer.report_id);
        
        if (valuation) {
          showDealerOfferNotification({
            offerId: offer.id,
            amount: offer.offer_amount,
            vehicle: {
              year: valuation.year,
              make: valuation.make,
              model: valuation.model
            },
            onViewOffer: () => navigate(`/valuation/${offer.report_id}`)
          });
        }
      } catch (error) {
        console.error('Error fetching valuation details for notification:', error);
      }
    });
    
    // Update seen offers in localStorage
    localStorage.setItem(
      'seen_offer_ids', 
      JSON.stringify([...seenOfferIds, ...newOffers.map(o => o.id)])
    );
  }, [offers, user, navigate]);

  // This component doesn't render anything
  return null;
}

export default DealerOffersTracker;
