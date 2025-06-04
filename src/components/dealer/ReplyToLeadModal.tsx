<<<<<<< HEAD

import React, { useState } from 'react';
=======
import React, { useState } from "react";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
<<<<<<< HEAD
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
=======
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useDealerOffers } from "@/hooks/useDealerOffers";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

export interface LeadData {
  id: string;
  make?: string;
  model?: string;
  year?: number;
  estimatedValue?: number;
  created_at: string;
  condition_score?: number;
}

<<<<<<< HEAD
export interface ReplyToLeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: LeadData;
}

export const ReplyToLeadModal: React.FC<ReplyToLeadModalProps> = ({
  open,
  onOpenChange,
  lead
}) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const handleSend = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    setIsSending(true);
    try {
      // Simulating an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Message sent successfully');
      setMessage('');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };
  
=======
export function ReplyToLeadModal(
  { isOpen, onClose, lead }: ReplyToLeadModalProps,
) {
  const [offerPrice, setOfferPrice] = useState(
    lead.estimatedValue ? Math.floor(lead.estimatedValue * 0.9) : 0,
  );
  const [notes, setNotes] = useState("");

  const { submitOffer, isSubmitting } = useDealerOffers();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!offerPrice) {
      return;
    }

    submitOffer(
      {
        reportId: lead.id,
        amount: offerPrice,
        message: notes,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  const vehicleInfo = `${lead.year || ""} ${lead.make || ""} ${
    lead.model || ""
  }`.trim();
  const suggestedPrice = lead.estimatedValue
    ? Math.floor(lead.estimatedValue * 0.9)
    : 0;

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reply to Lead</DialogTitle>
        </DialogHeader>
<<<<<<< HEAD
        
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-1">
            {lead.year} {lead.make} {lead.model}
          </h3>
          <p className="text-sm text-muted-foreground">
            Estimated value: ${lead.estimatedValue?.toLocaleString()}
          </p>
        </div>
        
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message here..."
          className="h-36"
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={isSending}>
            {isSending ? 'Sending...' : 'Send Reply'}
          </Button>
        </DialogFooter>
=======

        <form onSubmit={handleSubmit} className="space-y-4">
          {vehicleInfo && (
            <div className="mb-4">
              <h3 className="font-medium">{vehicleInfo}</h3>
              {lead.estimatedValue && (
                <p className="text-sm text-muted-foreground">
                  Estimated Value: ${lead.estimatedValue.toLocaleString()}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="offerPrice">Your Offer Price</Label>
            <Input
              id="offerPrice"
              type="number"
              value={offerPrice}
              onChange={(e) => setOfferPrice(Number(e.target.value))}
              required
              min={1}
            />
            {suggestedPrice > 0 && (
              <p className="text-xs text-muted-foreground">
                Suggested: ${suggestedPrice.toLocaleString()}{" "}
                (90% of estimated value)
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add details about your offer..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !offerPrice}
            >
              {isSubmitting
                ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                )
                : (
                  "Submit Offer"
                )}
            </Button>
          </DialogFooter>
        </form>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      </DialogContent>
    </Dialog>
  );
};

export default ReplyToLeadModal;
