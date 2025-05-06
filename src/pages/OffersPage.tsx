
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Phone, ThumbsUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useValuationResult } from '@/hooks/useValuationResult';

const OffersPage = () => {
  const [searchParams] = useSearchParams();
  const [valuationId, setValuationId] = useState<string | undefined>(
    searchParams.get('valuationId') || undefined
  );
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoadingOffers, setIsLoadingOffers] = useState(false);
  const [errorOffers, setErrorOffers] = useState<Error | null>(null);

  // Fetch valuation data based on ID
  const { 
    data: valuationData, 
    isLoading: isLoadingValuation,
    error: valuationError
  } = useValuationResult(valuationId || '');

  // Try to get valuationId from various sources
  useEffect(() => {
    const getValuationId = () => {
      // First check URL query param (highest priority)
      if (searchParams.get('valuationId')) {
        return searchParams.get('valuationId') || undefined;
      }
      
      // Then check latest_valuation_id in localStorage
      const storedId = localStorage.getItem('latest_valuation_id');
      if (storedId) {
        console.log('Retrieved valuationId from localStorage:', storedId);
        return storedId;
      }
      
      return undefined;
    };

    const id = getValuationId();
    if (id && id !== valuationId) {
      setValuationId(id);
    }
  }, [searchParams, valuationId]);

  // Fetch dealer offers
  useEffect(() => {
    const fetchOffers = async () => {
      if (!valuationId) return;

      setIsLoadingOffers(true);
      setErrorOffers(null);
      
      try {
        const { data, error } = await supabase
          .from('dealer_offers')
          .select('*')
          .eq('report_id', valuationId);
          
        if (error) throw error;
        
        setOffers(data || []);
      } catch (err) {
        console.error('Error fetching offers:', err);
        setErrorOffers(err instanceof Error ? err : new Error('Failed to fetch offers'));
      } finally {
        setIsLoadingOffers(false);
      }
    };

    fetchOffers();
  }, [valuationId]);

  // DEMO: If no real offers, create mock offers
  useEffect(() => {
    if (!valuationData || offers.length > 0 || isLoadingOffers) return;
    
    // Create mock offers for demo purposes
    const estimatedValue = valuationData.estimatedValue || 15000;
    const mockOffers = [
      {
        id: '1',
        dealer_id: 'dealer1',
        message: 'Great vehicle! We are interested in making a competitive offer.',
        offer_amount: Math.round(estimatedValue * 0.95),
        status: 'pending',
        dealer_name: 'City Auto Group',
        dealer_phone: '(555) 123-4567'
      },
      {
        id: '2',
        dealer_id: 'dealer2',
        message: 'We have a customer looking for exactly this model. Can offer above market.',
        offer_amount: Math.round(estimatedValue * 1.02),
        status: 'pending',
        dealer_name: 'Premium Motors',
        dealer_phone: '(555) 987-6543'
      },
      {
        id: '3',
        dealer_id: 'dealer3',
        message: 'Interested in your vehicle. Please contact us to discuss.',
        offer_amount: Math.round(estimatedValue * 0.98),
        status: 'pending',
        dealer_name: 'Valley Car Center',
        dealer_phone: '(555) 456-7890'
      }
    ];
    
    setOffers(mockOffers);
  }, [valuationData, offers, isLoadingOffers]);

  if (isLoadingValuation || isLoadingOffers) {
    return (
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-6">Current Offers</h1>
        <div className="space-y-4">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (valuationError || !valuationId) {
    return (
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-6">Current Offers</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No vehicle selected</AlertTitle>
          <AlertDescription className="space-y-4">
            <p>Please complete a vehicle valuation first to view dealer offers.</p>
            <div className="mt-4">
              <Link to="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Go to Valuation
                </Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Current Offers</h1>
          {valuationData && (
            <p className="text-muted-foreground mt-2">
              {valuationData.year} {valuationData.make} {valuationData.model}
            </p>
          )}
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Link to={`/result?valuationId=${valuationId}`}>
            <Button variant="outline">Back to Valuation</Button>
          </Link>
        </div>
      </div>

      {offers.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Offers Yet</CardTitle>
            <CardDescription>
              Your vehicle information has been shared with our dealer network. Offers will appear here as dealers respond.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Typically, you can expect to receive offers within 24-48 hours. Make sure to check back later!
            </p>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <p className="text-sm">
              Want to speed up the process? Upgrade to Premium for priority dealer matching.
            </p>
            <Link to="/upgrade">
              <Button>Upgrade to Premium</Button>
            </Link>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-6">
          {offers.map((offer) => (
            <Card key={offer.id} className={offer.offer_amount > (valuationData?.estimatedValue || 0) ? 'border-green-200 bg-green-50' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{offer.dealer_name || 'Dealer Offer'}</CardTitle>
                    <CardDescription>
                      Offer ID: {offer.id.slice(0, 8)}
                    </CardDescription>
                  </div>
                  <Badge variant={offer.offer_amount > (valuationData?.estimatedValue || 0) ? 'secondary' : 'default'} 
                         className={offer.offer_amount > (valuationData?.estimatedValue || 0) ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}>
                    {offer.offer_amount > (valuationData?.estimatedValue || 0) ? 'Above Market' : 'Market Offer'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-3xl font-bold">${offer.offer_amount.toLocaleString()}</p>
                  {valuationData?.estimatedValue && (
                    <p className="text-sm text-muted-foreground">
                      {((offer.offer_amount / valuationData.estimatedValue) * 100 - 100).toFixed(1)}% 
                      {offer.offer_amount > valuationData.estimatedValue ? ' above' : ' below'} estimated value
                    </p>
                  )}
                </div>
                <div className="bg-slate-100 p-4 rounded-md">
                  <p className="italic text-slate-600">"{offer.message}"</p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                <div>
                  <p className="text-sm font-medium">Interested? Contact the dealer:</p>
                  <p className="flex items-center gap-1 text-sm">
                    <Phone className="h-3 w-3" />
                    {offer.dealer_phone}
                  </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button variant="outline" className="flex-1 sm:flex-auto">
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </Button>
                  <Button className="flex-1 sm:flex-auto">
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Accept
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}

          <div className="mt-8 p-6 bg-slate-50 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">About Dealer Offers</h2>
            <p className="mb-4">
              These offers are provided by Car Detective partner dealers based on your vehicle information. Offers are valid for 7 days from when they are made.
            </p>
            <p className="text-sm text-muted-foreground">
              Accepting an offer is non-binding. The dealer will contact you to arrange inspection and complete the purchase.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OffersPage;
