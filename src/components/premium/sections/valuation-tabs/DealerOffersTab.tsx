
import { TabContentWrapper } from "./TabContentWrapper";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Building, ShieldCheck, Loader2, Car, DollarSign, Star } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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
  
  // Mock dealer data
  const dealers = [
    {
      id: "d1",
      name: "City Motors Group",
      rating: 4.8,
      reviewCount: 324,
      location: "7.2 miles away",
      offerAmount: 24100,
      certified: true,
      logo: "https://placehold.co/100x60?text=City+Motors"
    },
    {
      id: "d2",
      name: "AutoNation Downtown",
      rating: 4.5,
      reviewCount: 211,
      location: "12.6 miles away",
      offerAmount: 23800,
      certified: true,
      logo: "https://placehold.co/100x60?text=AutoNation"
    },
    {
      id: "d3",
      name: "Premier Auto Sales",
      rating: 4.2,
      reviewCount: 156,
      location: "3.7 miles away",
      offerAmount: 23500,
      certified: false,
      logo: "https://placehold.co/100x60?text=Premier+Auto"
    }
  ];
  
  const handleRequestOffers = async () => {
    if (!vehicleData) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
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
          
          <h3 className="text-xl font-bold mt-8 mb-4">Participating Dealers</h3>
          
          <div className="space-y-4">
            {dealers.map(dealer => (
              <div key={dealer.id} className="p-5 border border-slate-200 rounded-lg bg-white hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                  <div className="sm:w-24 flex-shrink-0">
                    <img src={dealer.logo} alt={dealer.name} className="rounded" />
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="font-semibold text-lg">{dealer.name}</h4>
                      {dealer.certified && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Certified Partner
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-slate-600 mb-2">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="font-medium">{dealer.rating}</span>
                      <span className="text-slate-400">({dealer.reviewCount} reviews)</span>
                      <span className="mx-2">•</span>
                      <span>{dealer.location}</span>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="text-sm text-slate-500">Initial Offer</p>
                        <p className="text-xl font-semibold text-green-600">${dealer.offerAmount.toLocaleString()}</p>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button size="sm">
                          Contact Dealer
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end mt-4">
            <Button className="bg-primary">View All Offers</Button>
          </div>
        </div>
      )}
    </TabContentWrapper>
  );
}
