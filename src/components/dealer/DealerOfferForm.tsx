
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface DealerOfferFormProps {
  onSubmit: (data: { amount: number; message: string }) => void;
  isLoading?: boolean;
  valuationDetails?: {
    make: string;
    model: string;
    year: number;
  };
}

export function DealerOfferForm({ 
  onSubmit, 
  isLoading = false,
  valuationDetails
}: DealerOfferFormProps) {
  const [amount, setAmount] = useState<number>(0);
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (amount <= 0) {
      toast.error("Please enter a valid offer amount");
      return;
    }
    
    onSubmit({
      amount: Number(amount),
      message
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {valuationDetails && (
        <div className="p-4 bg-muted rounded-md mb-4">
          <p className="font-medium">Vehicle Details:</p>
          <p className="text-sm text-muted-foreground">
            {valuationDetails.year} {valuationDetails.make} {valuationDetails.model}
          </p>
        </div>
      )}
      
      <div>
        <Label htmlFor="amount">Offer Amount ($)</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          min={1}
          required
          className="mt-1"
          placeholder="Enter your offer amount"
        />
      </div>
      
      <div>
        <Label htmlFor="message">Message (Optional)</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a personalized message about your offer..."
          className="mt-1 resize-y"
          rows={3}
        />
      </div>
      
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Submitting...' : 'Submit Offer'}
      </Button>
    </form>
  );
}
