
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface OfferAcceptanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: any;
  onAccept: () => void;
}

export function OfferAcceptanceModal({
  isOpen,
  onClose,
  offer,
  onAccept,
}: OfferAcceptanceModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Accept Dealer Offer</DialogTitle>
          <DialogDescription>
            Are you sure you want to accept this offer?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p>Offer Amount: ${offer?.offer_amount?.toLocaleString()}</p>
          <div className="flex gap-2">
            <Button onClick={onAccept}>Accept Offer</Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
