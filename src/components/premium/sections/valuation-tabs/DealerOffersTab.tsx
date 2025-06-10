import React, { useState } from "react";
import { TabContentWrapper } from "./TabContentWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, Users } from "lucide-react";
import { DealerOfferForm } from "@/components/dealer/DealerOfferForm";
import { DealerOffersList } from "@/components/dealer/DealerOffersList";

interface DealerOffersTabProps {
  vehicleData?: {
    make?: string;
    model?: string;
    year?: number;
    mileage?: number;
    trim?: string;
    vin?: string;
  };
  estimatedValue?: number;
}

export function DealerOffersTab({
  vehicleData,
  estimatedValue,
}: DealerOffersTabProps) {
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);
  const [offers, setOffers] = useState<any[]>([]);

  const handleSubmitOffer = (data: any) => {
    setIsSubmittingOffer(true);
    // Simulate API call
    setTimeout(() => {
      setOffers((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          dealerName: data.dealerName || "Sample Dealer",
          amount: data.offerAmount || estimatedValue || 25000,
          status: "pending",
          createdAt: new Date().toISOString(),
        },
      ]);
      setIsSubmittingOffer(false);
      setShowOfferForm(false);
    }, 1000);
  };

  const handleAcceptOffer = (offerId: string) => {
    setOffers((prev) =>
      prev.map((offer) =>
        offer.id === offerId ? { ...offer, status: "accepted" } : offer
      )
    );
  };

  const handleDeclineOffer = (offerId: string) => {
    setOffers((prev) =>
      prev.map((offer) =>
        offer.id === offerId ? { ...offer, status: "declined" } : offer
      )
    );
  };

  return (
    <TabContentWrapper
      title="Dealer Network Offers"
      description="Get competitive offers from verified dealers in your area"
    >
      <div className="space-y-6">
        {/* Current Valuation Summary */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold">Current Valuation</h3>
                <p className="text-2xl font-bold text-primary">
                  ${estimatedValue?.toLocaleString() || "N/A"}
                </p>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <p>Market Analysis</p>
                <p>Updated {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Make</p>
                <p className="font-medium">{vehicleData?.make || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Model</p>
                <p className="font-medium">{vehicleData?.model || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Year</p>
                <p className="font-medium">{vehicleData?.year || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Mileage</p>
                <p className="font-medium">
                  {vehicleData?.mileage?.toLocaleString() || "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dealer Network Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Dealer Network Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">247</p>
                <p className="text-sm text-blue-600">Verified Dealers</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">12</p>
                <p className="text-sm text-green-600">Active Bidders</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">3</p>
                <p className="text-sm text-purple-600">Pending Offers</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Network Coverage</span>
                <span className="text-sm font-medium">98% National</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full w-[98%]"></div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button 
                onClick={() => setShowOfferForm(true)}
                className="flex-1 gap-2"
              >
                <Plus className="h-4 w-4" />
                Request Dealer Offers
              </Button>
              <Button variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh Offers
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Existing Offers */}
        <DealerOffersList
          offers={offers}
          onAccept={handleAcceptOffer}
          onDecline={handleDeclineOffer}
        />

        {/* Offer Form Modal/Section */}
        {showOfferForm && (
          <DealerOfferForm
            onSubmit={handleSubmitOffer}
            isLoading={isSubmittingOffer}
          />
        )}
      </div>
    </TabContentWrapper>
  );
}
