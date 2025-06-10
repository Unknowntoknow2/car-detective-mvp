
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DealerOffer {
  id: string;
  dealerName: string;
  amount: number;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
}

interface DealerOffersListProps {
  offers?: DealerOffer[];
  onAccept: (offerId: string) => void;
  onDecline: (offerId: string) => void;
}

export function DealerOffersList({ 
  offers = [], 
  onAccept, 
  onDecline 
}: DealerOffersListProps) {
  if (offers.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No dealer offers yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {offers.map((offer) => (
        <Card key={offer.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">{offer.dealerName}</CardTitle>
              <Badge variant={offer.status === "pending" ? "default" : "secondary"}>
                {offer.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <p className="text-2xl font-bold">${offer.amount.toLocaleString()}</p>
              {offer.status === "pending" && (
                <div className="space-x-2">
                  <Button 
                    size="sm" 
                    onClick={() => onAccept(offer.id)}
                  >
                    Accept
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onDecline(offer.id)}
                  >
                    Decline
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
