
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, CheckCircle, DollarSign, Car, User } from 'lucide-react';

interface DealerOffer {
  id: string;
  dealer_id: string;
  offer_amount: number;
  message?: string;
  status: string;
  created_at: string;
  dealer?: {
    business_name: string;
    contact_name: string;
    email: string;
  };
  valuation?: {
    id: string;
    year: number;
    make: string;
    model: string;
    vin: string;
    estimated_value: number;
    user_id: string;
  };
}

export default function ViewOfferPage() {
  const { token } = useParams<{ token: string }>();
  const [offer, setOffer] = useState<DealerOffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    if (token) {
      fetchOfferByToken(token);
    }
  }, [token]);

  const fetchOfferByToken = async (token: string) => {
    try {
      setLoading(true);
      setError(null);

      // First, get the dealer lead by secure token
      const { data: leadData, error: leadError } = await supabase
        .from('dealer_leads')
        .select(`
          *,
          valuations (
            id,
            year,
            make,
            model,
            vin,
            estimated_value,
            user_id
          )
        `)
        .eq('secure_token', token)
        .single();

      if (leadError || !leadData) {
        throw new Error('Offer not found or invalid token');
      }

      // Then get the dealer offer for this valuation
      const { data: offerData, error: offerError } = await supabase
        .from('dealer_offers')
        .select(`
          *,
          dealers (
            business_name,
            contact_name,
            email
          )
        `)
        .eq('report_id', leadData.valuation_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (offerError || !offerData) {
        throw new Error('No offer found for this vehicle');
      }

      // Combine the data
      const combinedOffer: DealerOffer = {
        ...offerData,
        valuation: leadData.valuations
      };

      setOffer(combinedOffer);
    } catch (err: any) {
      setError(err.message || 'Failed to load offer details');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOffer = async () => {
    if (!offer || !token) return;

    try {
      setAccepting(true);
      
      // Create accepted offer record
      const { error: acceptError } = await supabase
        .from('accepted_offers')
        .insert({
          valuation_id: offer.valuation?.id,
          dealer_offer_id: offer.id,
          dealer_id: offer.dealer_id,
          user_id: offer.valuation?.user_id,
          status: 'accepted'
        });

      if (acceptError) {
        throw acceptError;
      }

      // Update the offer status
      const { error: updateError } = await supabase
        .from('dealer_offers')
        .update({ status: 'accepted' })
        .eq('id', offer.id);

      if (updateError) {
        throw updateError;
      }

      // Show success and refresh
      setOffer({ ...offer, status: 'accepted' });
    } catch (err: any) {
      setError('Failed to accept offer. Please try again.');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading offer details...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !offer) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || 'Offer not found'}
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    );
  }

  const isAccepted = offer.status === 'accepted';

  return (
    <MainLayout>
      <div className="container mx-auto py-8 max-w-2xl">
        <div className="space-y-6">
          {isAccepted && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                This offer has been accepted! The dealer will contact you soon.
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Dealer Offer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Vehicle Information */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Car className="h-4 w-4" />
                  <h3 className="font-semibold">Vehicle Details</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Vehicle:</span>
                    <p className="font-medium">
                      {offer.valuation?.year} {offer.valuation?.make} {offer.valuation?.model}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">VIN:</span>
                    <p className="font-mono text-xs">{offer.valuation?.vin}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Estimated Value:</span>
                    <p className="font-medium">${offer.valuation?.estimated_value?.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Dealer Information */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4" />
                  <h3 className="font-semibold">Dealer Information</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Business:</span>
                    <p className="font-medium">{offer.dealer?.business_name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Contact:</span>
                    <p>{offer.dealer?.contact_name}</p>
                  </div>
                </div>
              </div>

              {/* Offer Details */}
              <div className="text-center p-6 bg-primary/5 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Offer Amount</h3>
                <p className="text-3xl font-bold text-primary">
                  ${offer.offer_amount.toLocaleString()}
                </p>
                {offer.message && (
                  <div className="mt-4 p-3 bg-muted rounded text-sm text-left">
                    <span className="font-medium">Dealer Message:</span>
                    <p className="mt-1">{offer.message}</p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="flex justify-center">
                {!isAccepted ? (
                  <Button
                    size="lg"
                    onClick={handleAcceptOffer}
                    disabled={accepting}
                    className="min-w-[200px]"
                  >
                    {accepting ? 'Accepting...' : 'Accept Offer'}
                  </Button>
                ) : (
                  <Button variant="outline" disabled size="lg" className="min-w-[200px]">
                    Offer Accepted
                  </Button>
                )}
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>Offer expires 7 days from: {new Date(offer.created_at).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
