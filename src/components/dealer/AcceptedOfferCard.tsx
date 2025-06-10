
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AcceptedOfferCardProps {
  offer: any;
}

export function AcceptedOfferCard({ offer }: AcceptedOfferCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Accepted Offer</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Amount: ${offer?.offer_amount?.toLocaleString()}</p>
        <p>Status: {offer?.status}</p>
      </CardContent>
    </Card>
  );
}
