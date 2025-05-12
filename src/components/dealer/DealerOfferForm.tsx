
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, DollarSign, MessageSquare } from 'lucide-react';

interface DealerOfferFormProps {
  onSubmit: (data: { amount: number; message: string }) => void;
  isLoading: boolean;
  valuationDetails?: {
    make?: string;
    model?: string;
    year?: number;
    trim?: string;
  };
  initialAmount?: number;
}

export function DealerOfferForm({ 
  onSubmit, 
  isLoading, 
  valuationDetails,
  initialAmount = 0 
}: DealerOfferFormProps) {
  const [amount, setAmount] = useState(initialAmount);
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || amount <= 0) {
      return;
    }
    
    onSubmit({
      amount,
      message
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {valuationDetails ? (
            <>Make an Offer for {valuationDetails.year} {valuationDetails.make} {valuationDetails.model}</>
          ) : (
            <>Create Your Offer</>
          )}
        </CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              Offer Amount
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Enter your offer amount"
              required
              min={1}
            />
            <p className="text-xs text-muted-foreground">
              Your best offer for this vehicle
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message" className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              Message to Owner (Optional)
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add any details or notes about your offer..."
              rows={4}
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading || !amount || amount <= 0}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Offer'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
