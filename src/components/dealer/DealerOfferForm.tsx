
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DealerOfferFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function DealerOfferForm({ onSubmit, isLoading }: DealerOfferFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Dealer Offer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="dealerName">Dealer Name</Label>
          <Input id="dealerName" placeholder="Enter dealer name" />
        </div>
        <div>
          <Label htmlFor="offerAmount">Offer Amount</Label>
          <Input id="offerAmount" type="number" placeholder="Enter offer amount" />
        </div>
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" placeholder="Additional notes" />
        </div>
        <Button onClick={() => onSubmit({})} disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Offer"}
        </Button>
      </CardContent>
    </Card>
  );
}
