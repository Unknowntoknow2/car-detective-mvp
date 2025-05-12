
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDealerOffers } from '@/hooks/useDealerOffers';
import { useAuth } from '@/contexts/AuthContext';
import { showDealerOfferNotification } from '@/components/notifications/DealerOfferNotification';

/**
 * Component that monitors dealer offers and shows notifications
 * This should be mounted in a top-level component that's always present
 */
export function DealerOffersTracker() {
  const { user } = useAuth();
  let navigate;
  
  try {
    navigate = useNavigate();
  } catch (error) {
    console.log("Router context not available for DealerOffersTracker");
  }
  
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
        // Since we don't have immediate access to valuation details, we'll use what we know
        showDealerOfferNotification({
          offerId: offer.id,
          amount: offer.offer_amount,
          vehicle: {
            year: 2021, // Default values as placeholders
            make: "Vehicle", 
            model: "Details"
          },
          onViewOffer: () => {
            if (navigate) {
              navigate(`/valuation/${offer.report_id}`);
            } else {
              window.location.href = `/valuation/${offer.report_id}`;
            }
          }
        });
      } catch (error) {
        console.error('Error displaying notification:', error);
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
