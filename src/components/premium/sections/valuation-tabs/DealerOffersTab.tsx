
import { TabContentWrapper } from "./TabContentWrapper";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Building, ShieldCheck, Loader2, Car, DollarSign, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { DealerOfferForm } from "@/components/dealer/DealerOfferForm";
import { DealerOffersList } from "@/components/dealer/DealerOffersList";
import { useDealerOffers, SubmitOfferParams } from "@/hooks/useDealerOffers";
import { supabase } from "@/integrations/supabase/client";

interface DealerOffersTabProps {
  vehicleData?: {
    make: string;
    model: string;
    year: number;
    trim?: string;
    vin?: string;
  };
  valuationId?: string;
}

export function DealerOffersTab({ vehicleData, valuationId = "mock-id" }: DealerOffersTabProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [offersRequested, setOffersRequested] = useState(false);
  const { submitOffer, isSubmitting } = useDealerOffers(valuationId);
  const [isDealer, setIsDealer] = useState<boolean | null>(null);
  
  // Fixed: Changed useState to useEffect for checking dealer status
  useEffect(() => {
    const checkIfDealer = async () => {
      if (!user) {
        setIsDealer(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('dealers')
          .select('id, verified')
          .eq('id', user.id)
          .maybeSingle();
          
        if (error) {
          console.error('Error checking dealer status:', error);
          setIsDealer(false);
          return;
        }
        
        setIsDealer(data?.verified || false);
      } catch (error) {
        console.error('Error:', error);
        setIsDealer(false);
      }
    };
    
    checkIfDealer();
  }, [user]);
  
  const handleRequestOffers = async () => {
    if (!vehicleData) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call to request dealer offers
      await new Promise(resolve => setTimeout(resolve, 2000));
      setOffersRequested(true);
      toast.success("Dealer offer requests sent successfully! You'll receive offers soon.");
    } catch (error) {
      toast.error("Failed to request dealer offers. Please try again.");
      console.error("Error requesting dealer offers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitOffer = async (data: { amount: number; message: string }) => {
    if (!user || !vehicleData || !valuationId) {
      toast.error("Missing required information");
      return;
    }
    
    try {
      // First get the user ID who owns this valuation
      const { data: valuationData, error: valuationError } = await supabase
        .from('valuations')
        .select('user_id')
        .eq('id', valuationId)
        .maybeSingle();
        
      if (valuationError) {
        console.error('Error getting valuation owner:', valuationError);
        toast.error("Couldn't verify valuation details");
        return;
      }
      
      // Use the correct parameter names based on our updated interface
      submitOffer({
        reportId: valuationId,
        userId: valuationData?.user_id,
        amount: data.amount,
        message: data.message
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to submit offer");
    }
  };
  
  // If not logged in at all
  if (!user) {
    return (
      <TabContentWrapper
        title="Dealer Offers"
        description="Get real purchase offers from verified dealers in your area"
      >
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
          <Building className="h-12 w-12 text-amber-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-amber-800 mb-2">Authentication Required</h3>
          <p className="text-amber-700 mb-4">
            You need to be logged in to request dealer offers.
          </p>
          <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white">
            <a href="/auth">Sign In / Register</a>
          </Button>
        </div>
      </TabContentWrapper>
    );
  }
  
  // If vehicle information is missing
  if (!vehicleData) {
    return (
      <TabContentWrapper
        title="Dealer Offers"
        description="Get real purchase offers from verified dealers in your area"
      >
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
          <Car className="h-12 w-12 text-amber-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-amber-800 mb-2">Vehicle Information Required</h3>
          <p className="text-amber-700 mb-4">
            Please first look up a vehicle using VIN, license plate, or manual entry
            to request dealer offers.
          </p>
        </div>
      </TabContentWrapper>
    );
  }

  // Dealer view - to submit offers
  if (isDealer) {
    return (
      <TabContentWrapper
        title="Submit Dealer Offer"
        description={`Make an offer for this ${vehicleData.year} ${vehicleData.make} ${vehicleData.model} ${vehicleData.trim || ""}`}
      >
        <div className="max-w-md mx-auto">
          <DealerOfferForm 
            onSubmit={handleSubmitOffer} 
            isLoading={isSubmitting}
            valuationDetails={vehicleData}
          />
        </div>
      </TabContentWrapper>
    );
  }

  // Regular user view - to request and view offers
  return (
    <TabContentWrapper
      title="Dealer Offers"
      description={`Get purchase offers for your ${vehicleData.year} ${vehicleData.make} ${vehicleData.model} ${vehicleData.trim || ""}`}
    >
      {!offersRequested ? (
        <div className="space-y-6">
          <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
            <h3 className="text-lg font-semibold mb-4">Request Offers from Local Dealers</h3>
            <p className="text-slate-600 mb-6">
              We'll send your vehicle details to our network of certified dealers in your area.
              You'll receive actual purchase offers with no obligation to sell.
            </p>
            
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <div className="bg-white p-4 rounded border border-slate-200 flex flex-col items-center text-center">
                <div className="bg-blue-50 p-3 rounded-full mb-3">
                  <Building className="h-5 w-5 text-blue-600" />
                </div>
                <h4 className="font-medium mb-1">Verified Dealers</h4>
                <p className="text-sm text-slate-500">Only trusted dealerships in our network</p>
              </div>
              
              <div className="bg-white p-4 rounded border border-slate-200 flex flex-col items-center text-center">
                <div className="bg-green-50 p-3 rounded-full mb-3">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <h4 className="font-medium mb-1">No Obligation</h4>
                <p className="text-sm text-slate-500">Review offers with no pressure to sell</p>
              </div>
              
              <div className="bg-white p-4 rounded border border-slate-200 flex flex-col items-center text-center">
                <div className="bg-purple-50 p-3 rounded-full mb-3">
                  <ShieldCheck className="h-5 w-5 text-purple-600" />
                </div>
                <h4 className="font-medium mb-1">Privacy Protected</h4>
                <p className="text-sm text-slate-500">Your contact details remain private</p>
              </div>
            </div>
            
            <Button 
              onClick={handleRequestOffers} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Request...
                </>
              ) : (
                "Request Dealer Offers"
              )}
            </Button>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <ShieldCheck className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">How it works:</p>
              <ol className="list-decimal list-inside mt-1 space-y-1">
                <li>We send your vehicle details to certified dealers in your area</li>
                <li>Dealers evaluate your vehicle and submit purchase offers</li>
                <li>You receive multiple offers within 24-48 hours</li>
                <li>You can accept any offer or decline all with no obligation</li>
              </ol>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-6 bg-green-50 border border-green-100 rounded-lg">
            <div className="flex items-center mb-4">
              <ShieldCheck className="h-6 w-6 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-green-800">Offer Requests Sent!</h3>
            </div>
            <p className="text-green-700 mb-4">
              We've sent your vehicle details to our dealer network. You should start receiving offers within 24-48 hours.
              We'll notify you by email when new offers arrive.
            </p>
          </div>
          
          <h3 className="text-xl font-bold mt-8 mb-4">Offers for Your Vehicle</h3>
          
          <DealerOffersList reportId={valuationId} showActions={true} />
        </div>
      )}
    </TabContentWrapper>
  );
}
