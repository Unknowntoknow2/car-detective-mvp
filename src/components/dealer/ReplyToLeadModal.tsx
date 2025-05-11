
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useDealerOffers } from '@/hooks/useDealerOffers';

interface ReplyToLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: {
    id: string;
    make?: string;
    model?: string;
    year?: number;
    estimatedValue?: number;
  };
}

export function ReplyToLeadModal({ isOpen, onClose, lead }: ReplyToLeadModalProps) {
  const [offerPrice, setOfferPrice] = useState(lead.estimatedValue ? Math.floor(lead.estimatedValue * 0.9) : 0);
  const [notes, setNotes] = useState('');
  
  const { submitOffer, isSubmitting } = useDealerOffers();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!offerPrice) {
      return;
    }
    
    submitOffer(
      { 
        leadId: lead.id, 
        offerPrice, 
        notes 
      },
      {
        onSuccess: () => {
          onClose();
        }
      }
    );
  };

  const vehicleInfo = `${lead.year || ''} ${lead.make || ''} ${lead.model || ''}`.trim();
  const suggestedPrice = lead.estimatedValue ? Math.floor(lead.estimatedValue * 0.9) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Make an Offer</DialogTitle>
        </DialogHeader>
        
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
                Suggested: ${suggestedPrice.toLocaleString()} (90% of estimated value)
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
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Offer'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
