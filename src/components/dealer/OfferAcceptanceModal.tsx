
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/formatters';

export interface OfferAcceptanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: any;
  isProcessing: boolean;
}

export const OfferAcceptanceModal: React.FC<OfferAcceptanceModalProps> = ({
  isOpen,
  onClose,
  offer,
  isProcessing,
}) => {
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
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-lg font-semibold">
              Offer Amount: {formatCurrency(offer?.offer_amount || 0)}
            </p>
            {offer?.message && (
              <p className="text-sm text-muted-foreground mt-2">
                Message: {offer.message}
              </p>
            )}
          </div>
          
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Accept Offer'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OfferAcceptanceModal;
