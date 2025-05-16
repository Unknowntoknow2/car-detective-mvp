import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, DollarSign, MessageSquare, Car, MapPin, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { OfferScoreBadge } from '@/components/dealer/OfferScoreBadge';

interface LeadData {
  id: string;
  valuation_id: string;
  secure_token: string;
  created_at: string;
  valuations: {
    make: string;
    model: string;
    year: number;
    mileage?: number;
    state?: string;
    condition_score?: number;
  };
}

interface OfferData {
  id: string;
  offer_amount: number;
  message: string;
  created_at: string;
  status: string;
  label?: string;
  insight?: string;
  score?: number;
}

export default function ViewOfferPage() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lead, setLead] = useState<LeadData | null>(null);
  const [offers, setOffers] = useState<OfferData[]>([]);

  useEffect(() => {
    async function fetchOfferByToken() {
      if (!token) {
        setError('Invalid token');
        setLoading(false);
        return;
      }

      try {
        // Fetch the lead using the secure token
        const { data: leadData, error: leadError } = await supabase
          .from('dealer_leads')
          .select(`
            id,
            valuation_id,
            secure_token,
            created_at,
            valuations:valuation_id (
              make,
              model,
              year,
              mileage,
              state,
              condition_score
            )
          `)
          .eq('secure_token', token)
          .single();

        if (leadError) {
          console.error('Error fetching lead:', leadError);
          setError('Could not find this offer. The link may be invalid or expired.');
          setLoading(false);
          return;
        }

        if (!leadData) {
          setError('No offer found with this token');
          setLoading(false);
          return;
        }

        // Transform the data to match the LeadData type
        if (leadData && leadData.valuations && leadData.valuations.length > 0) {
          const transformedData: LeadData = {
            id: leadData.id,
            valuation_id: leadData.valuation_id,
            secure_token: leadData.secure_token,
            created_at: leadData.created_at,
            valuations: {
              make: leadData.valuations[0].make,
              model: leadData.valuations[0].model,
              year: Number(leadData.valuations[0].year),
              mileage: leadData.valuations[0].mileage,
              state: leadData.valuations[0].state,
              condition_score: leadData.valuations[0].condition_score
            }
          };
          setLead(transformedData);
        }

        // Fetch offers for this lead
        const { data: offersData, error: offersError } = await supabase
          .from('dealer_offers')
          .select('*')
          .eq('report_id', leadData.valuation_id)
          .order('created_at', { ascending: false });

        if (offersError) {
          console.error('Error fetching offers:', offersError);
          setError('Could not load the offers for this vehicle');
        } else {
          setOffers(offersData || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchOfferByToken();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <p>Loading your offer...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-md p-6">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <p className="mt-4 text-sm text-muted-foreground">
              If you believe this is a mistake, please contact our support team.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!lead || !lead.valuations) {
    return (
      <div className="container mx-auto max-w-md p-6">
        <Card>
          <CardHeader>
            <CardTitle>No vehicle data found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>We couldn't find any vehicle information associated with this link.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const vehicle = lead.valuations;
  const getConditionLabel = (score?: number) => {
    if (!score) return 'Not specified';
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge variant="outline">Pending</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return null;
    }
  };

  // Find the best offer (highest score)
  const bestOffer = offers.length > 0 
    ? offers.reduce((prev, current) => 
        (current.score || 0) > (prev.score || 0) ? current : prev, offers[0])
    : null;

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Vehicle Offer</h1>
      
      {/* Vehicle details card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Car className="h-5 w-5 mr-2 text-primary" />
            {vehicle.year} {vehicle.make} {vehicle.model}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {vehicle.mileage && (
              <div>
                <p className="text-sm text-muted-foreground">Mileage</p>
                <p className="font-medium">{vehicle.mileage.toLocaleString()} miles</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Condition</p>
              <p className="font-medium">{getConditionLabel(vehicle.condition_score)}</p>
            </div>
            {vehicle.state && (
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{vehicle.state}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Offers section */}
      <h2 className="text-xl font-semibold mb-4">Dealer Offers</h2>
      
      {offers.length === 0 ? (
        <Card className="bg-slate-50">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No offers have been made yet for this vehicle.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {offers.map((offer) => (
            <Card 
              key={offer.id} 
              className={
                offer.id === bestOffer?.id && offer.score && offer.score > 80
                  ? "overflow-hidden border-green-300 bg-green-50"
                  : "overflow-hidden"
              }
            >
              <CardContent className="p-0">
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="font-medium">Verified Dealer</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(offer.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <DollarSign className="h-6 w-6 text-green-600 mr-2" />
                    <span className="text-2xl font-bold">${offer.offer_amount.toLocaleString()}</span>
                    <div className="ml-4 flex">
                      {getStatusBadge(offer.status)}
                      <OfferScoreBadge 
                        label={offer.label} 
                        insight={offer.insight} 
                        score={offer.score} 
                        isBestOffer={offer.id === bestOffer?.id}
                      />
                    </div>
                  </div>
                  
                  {offer.message && (
                    <div className="bg-slate-50 p-4 rounded-md">
                      <div className="flex items-start">
                        <MessageSquare className="h-4 w-4 text-slate-500 mr-2 mt-1" />
                        <p className="text-sm text-slate-700">{offer.message}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          This is a secure view of dealer offers for your vehicle.
          <br />
          No account is required to view these offers.
        </p>
      </div>
    </div>
  );
}
