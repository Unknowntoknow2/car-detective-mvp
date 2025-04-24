
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface DealerOfferFormProps {
  onSubmit: (data: { amount: number; message: string }) => void;
  isLoading?: boolean;
}

export function DealerOfferForm({ onSubmit, isLoading = false }: DealerOfferFormProps) {
  const [amount, setAmount] = useState<number>(0);
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      amount: Number(amount),
      message
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="amount">Offer Amount ($)</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          min={0}
          required
        />
      </div>
      <div>
        <Label htmlFor="message">Message (Optional)</Label>
        <Input
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a note about your offer..."
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit Offer'}
      </Button>
    </form>
  );
}
