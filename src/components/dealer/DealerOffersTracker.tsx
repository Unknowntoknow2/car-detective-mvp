<<<<<<< HEAD

import React, { useEffect, useState } from 'react';
import { useNavigate, NavigateFunction } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, AlertCircle } from 'lucide-react';

// Type for dealer offer
interface DealerOffer {
  id: string;
  created_at: string;
  offer_amount: number;
  status: string;
  make?: string;
  model?: string;
  year?: number;
=======
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDealerOffers } from "@/hooks/useDealerOffers";
import { useAuth } from "@/components/auth/AuthContext";
import { showDealerOfferNotification } from "@/components/notifications/DealerOfferNotification";

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
    const seenOfferIds = JSON.parse(
      localStorage.getItem("seen_offer_ids") || "[]",
    );
    const newOffers = offers.filter((offer) =>
      !seenOfferIds.includes(offer.id) && offer.status === "sent"
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
            model: "Details",
          },
          onViewOffer: () => {
            if (navigate) {
              navigate(`/valuation/${offer.report_id}`);
            } else {
              globalThis.location.href = `/valuation/${offer.report_id}`;
            }
          },
        });
      } catch (error) {
        console.error("Error displaying notification:", error);
      }
    });

    // Update seen offers in localStorage
    localStorage.setItem(
      "seen_offer_ids",
      JSON.stringify([...seenOfferIds, ...newOffers.map((o) => o.id)]),
    );
  }, [offers, user, navigate]);

  // This component doesn't render anything
  return null;
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
}

export const DealerOffersTracker: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const [offers, setOffers] = useState<DealerOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setIsLoading(true);
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        
        // Fetch offers made by this dealer
        const { data, error: offersError } = await supabase
          .from('dealer_offers')
          .select(`
            id,
            created_at,
            offer_amount,
            status,
            reports:report_id(
              make,
              model,
              year
            )
          `)
          .eq('dealer_id', userData.user.id)
          .order('created_at', { ascending: false });
          
        if (offersError) throw offersError;
        
        // Process the offers to flatten the structure
        const processedOffers = data.map((offer: any) => ({
          id: offer.id,
          created_at: offer.created_at,
          offer_amount: offer.offer_amount,
          status: offer.status,
          make: offer.reports?.make,
          model: offer.reports?.model,
          year: offer.reports?.year
        }));
        
        setOffers(processedOffers);
      } catch (err: any) {
        console.error("Error fetching offers:", err);
        setError(err.message || "Failed to load offers");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOffers();
  }, []);

  const handleViewOffer = (offerId: string) => {
    navigate(`/dealer/offers/${offerId}`);
  };

  // ... rest of your component
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Offers</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading offers...</p>
        ) : error ? (
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        ) : offers.length === 0 ? (
          <p className="text-muted-foreground">You haven't made any offers yet.</p>
        ) : (
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Offers</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {offers.map(offer => (
                <div key={offer.id} className="mb-3 p-3 border rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {offer.year} {offer.make} {offer.model}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${offer.offer_amount.toLocaleString()} - {offer.status}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewOffer(offer.id)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              ))}
            </TabsContent>
            
            {/* Similar content for other tabs */}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default DealerOffersTracker;
