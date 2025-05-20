
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Valuation } from '@/types/dealer';
import { toast } from 'sonner';
import { useValuationResult } from '@/hooks/useValuationResult';
import { useDealerOffers } from '@/hooks/useDealerOffers';

interface ReplyToLeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string;
  onSuccess?: () => void;
}

export const ReplyToLeadModal: React.FC<ReplyToLeadModalProps> = ({ 
  open, 
  onOpenChange, 
  reportId,
  onSuccess
}) => {
  const [offerAmount, setOfferAmount] = useState<number | ''>('');
  const [message, setMessage] = useState('');
  
  const valuation = useValuationResult(reportId);
  const { offers, refetch } = useDealerOffers(reportId);
  const submitOffer = async (amount: number, message: string) => {
    // Implementation would go here
    toast.success('Offer submitted successfully');
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof offerAmount !== 'number' || offerAmount <= 0) {
      toast.error('Please enter a valid offer amount');
      return;
    }
    
    try {
      const success = await submitOffer(offerAmount, message);
      if (success) {
        refetch();
        onOpenChange(false);
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      toast.error('Failed to submit offer');
      console.error(error);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Make an Offer</DialogTitle>
          <DialogDescription>
            Send your offer to the customer for their vehicle.
          </DialogDescription>
        </DialogHeader>
        
        {valuation.isLoading ? (
          <div className="p-4 text-center">Loading valuation details...</div>
        ) : valuation.isError ? (
          <div className="p-4 text-center text-red-500">
            Error loading valuation details.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="offer-amount">Your Offer Amount</Label>
                  {valuation.data && (
                    <span className="text-sm text-muted-foreground">
                      Estimated Value: ${valuation.data.estimatedValue?.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                  <Input
                    id="offer-amount"
                    type="number"
                    className="pl-7"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value ? Number(e.target.value) : '')}
                    min={1}
                    step={100}
                    required
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="message">Message to Customer (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Explain your offer or add any details about the vehicle purchase process..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Submit Offer
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
