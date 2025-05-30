
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Car, DollarSign, Clock } from 'lucide-react';

interface OfferAcceptanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  offer: {
    id: string;
    offer_amount: number;
    message?: string;
  };
  vehicleInfo?: {
    year?: number;
    make?: string;
    model?: string;
    vin?: string;
  };
  isProcessing: boolean;
}

export function OfferAcceptanceModal({
  isOpen,
  onClose,
  onConfirm,
  offer,
  vehicleInfo,
  isProcessing
}: OfferAcceptanceModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Accept Dealer Offer
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to accept this offer? The dealer will be notified and will contact you to finalize the transaction.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {vehicleInfo && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Car className="h-5 w-5 text-slate-600" />
              <div>
                <p className="font-medium">
                  {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
                </p>
                {vehicleInfo.vin && (
                  <p className="text-sm text-slate-500">VIN: {vehicleInfo.vin}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <DollarSign className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-semibold text-green-800">
                ${offer.offer_amount.toLocaleString()}
              </p>
              <p className="text-sm text-green-600">Offer Amount</p>
            </div>
          </div>

          {offer.message && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-800 mb-1">Dealer Message:</p>
              <p className="text-sm text-blue-700">{offer.message}</p>
            </div>
          )}

          <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
            <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">What happens next:</p>
              <ul className="text-sm text-amber-700 mt-1 space-y-1">
                <li>• The dealer will be notified immediately</li>
                <li>• They'll contact you within 24 hours</li>
                <li>• You can cancel this acceptance if needed</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isProcessing}
            className="bg-green-600 hover:bg-green-700"
          >
            {isProcessing ? 'Processing...' : 'Accept Offer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
