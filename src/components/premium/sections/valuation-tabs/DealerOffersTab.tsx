
import { Building, AlertCircle, Loader2, User, DollarSign, MessageSquare, Phone } from "lucide-react";
import { TabContentWrapper } from "./TabContentWrapper";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";

interface DealerOffersTabProps {
  vehicleData?: {
    make: string;
    model: string;
    year: number;
    trim?: string;
    vin?: string;
  };
  valuationId?: string;
  estimatedValue?: number;
}

interface DealerOffer {
  id: string;
  dealerName: string;
  contactName: string;
  offerAmount: number;
  message: string;
  phone?: string;
  email?: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export function DealerOffersTab({ 
  vehicleData, 
  valuationId = "mock-id", 
  estimatedValue = 25000 
}: DealerOffersTabProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [offers, setOffers] = useState<DealerOffer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchOffers = async () => {
      if (!vehicleData) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, we would fetch offers from the database
        // For now, we'll simulate a delay and return mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock dealer offers
        const mockOffers: DealerOffer[] = [
          {
            id: "1",
            dealerName: "Highway Motors",
            contactName: "Steve Johnson",
            offerAmount: Math.round(estimatedValue * 0.93),
            message: "We're interested in your vehicle and would like to make an offer. This offer is valid for 7 days. Contact us to arrange an inspection.",
            phone: "555-123-4567",
            email: "steve@highwaymotors.com",
            status: 'pending',
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: "2",
            dealerName: "City Auto Group",
            contactName: "Maria Rodriguez",
            offerAmount: Math.round(estimatedValue * 0.95),
            message: "Based on your vehicle details, we'd like to make the following offer. We can complete the transaction quickly if you're interested.",
            phone: "555-987-6543",
            email: "maria@cityautogroup.com",
            status: 'pending',
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        
        setOffers(mockOffers);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load dealer offers';
        console.error('Dealer offers error:', errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOffers();
  }, [vehicleData, valuationId, estimatedValue]);
  
  const handleInviteDealers = async () => {
    if (!vehicleData || !message) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real app, we would send this to the server
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage("");
      
      // Show success
      alert("Your request has been sent to local dealers. You'll be notified when they respond with offers.");
    } catch (err) {
      console.error('Error inviting dealers:', err);
      alert("Failed to send invitation to dealers. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user) {
    return (
      <TabContentWrapper
        title="Dealer Offers"
        description="Get offers from local dealers interested in your vehicle"
      >
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
          <Building className="h-12 w-12 text-amber-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-amber-800 mb-2">Authentication Required</h3>
          <p className="text-amber-700 mb-4">
            You need to be logged in to receive dealer offers.
          </p>
          <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white">
            <a href="/auth">Sign In / Register</a>
          </Button>
        </div>
      </TabContentWrapper>
    );
  }
  
  if (!vehicleData) {
    return (
      <TabContentWrapper
        title="Dealer Offers"
        description="Get offers from local dealers interested in your vehicle"
      >
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-amber-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-amber-800 mb-2">Vehicle Information Required</h3>
          <p className="text-amber-700 mb-4">
            Please first look up a vehicle using VIN, license plate, or manual entry
            to receive dealer offers.
          </p>
        </div>
      </TabContentWrapper>
    );
  }
  
  if (isLoading) {
    return (
      <TabContentWrapper
        title="Dealer Offers"
        description={`Offers for your ${vehicleData.year} ${vehicleData.make} ${vehicleData.model} ${vehicleData.trim || ""}`}
      >
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-slate-600">Loading dealer offers...</p>
        </div>
      </TabContentWrapper>
    );
  }
  
  return (
    <TabContentWrapper
      title="Dealer Offers"
      description={`Offers for your ${vehicleData.year} ${vehicleData.make} ${vehicleData.model} ${vehicleData.trim || ""}`}
    >
      <div className="space-y-6">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Could Not Load Dealer Offers</h3>
            <p className="text-red-700 mb-4">
              {error}
            </p>
            <Button variant="destructive" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : offers.length > 0 ? (
          <>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Current Offers ({offers.length})</h3>
              <p className="text-slate-600">These dealers have made offers on your vehicle</p>
            </div>
            
            <div className="space-y-4">
              {offers.map((offer) => (
                <Card key={offer.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle>{offer.dealerName}</CardTitle>
                      <div className="text-2xl font-bold text-primary">${offer.offerAmount.toLocaleString()}</div>
                    </div>
                    <CardDescription className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {offer.contactName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600">{offer.message}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-slate-500" />
                        <span>{offer.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2 text-slate-500" />
                        <span>{offer.email}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="text-sm text-slate-500">
                      Offer received {new Date(offer.created_at).toLocaleDateString()}
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline">Reject</Button>
                      <Button>Accept Offer</Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Current Offers</CardTitle>
              <CardDescription>
                Invite local dealers to make offers on your {vehicleData.year} {vehicleData.make} {vehicleData.model}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-slate-600">
                  Add a message to dealers about your vehicle's condition or any other details:
                </p>
                <Textarea
                  placeholder="My vehicle is in excellent condition with no known issues..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-32"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleInviteDealers}
                disabled={isSubmitting || !message}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Invitation...
                  </>
                ) : (
                  "Invite Local Dealers for Offers"
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
        
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
          <p>
            Dealer offers are typically valid for 7 days and subject to inspection of your vehicle.
            Accepting an offer does not obligate you to sell your vehicle.
          </p>
        </div>
      </div>
    </TabContentWrapper>
  );
}
