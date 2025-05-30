
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useDealerOffers } from '@/hooks/useDealerOffers';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { DollarSign, MessageSquare, Send } from 'lucide-react';

interface DealerOfferCardProps {
  reportId: string;
  userId?: string;
  estimatedValue?: number;
}

export function DealerOfferCard({ reportId, userId, estimatedValue }: DealerOfferCardProps) {
  const { user } = useAuth();
  const { submitOffer, isSubmitting } = useDealerOffers();
  const [offerAmount, setOfferAmount] = useState<number>(estimatedValue ? Math.floor(estimatedValue * 0.9) : 0);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!offerAmount || offerAmount <= 0) {
      toast.error('Please enter a valid offer amount');
      return;
    }

    try {
      await submitOffer({
        reportId,
        amount: offerAmount,
        message,
        userId
      }, {
        onSuccess: () => {
          setShowForm(false);
          setMessage('');
          toast.success('Offer submitted successfully!');
        }
      });
    } catch (error) {
      console.error('Error submitting offer:', error);
      toast.error('Failed to submit offer');
    }
  };

  if (!user) return null;

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <DollarSign className="h-5 w-5" />
          Submit Dealer Offer
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!showForm ? (
          <Button 
            onClick={() => setShowForm(true)}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4 mr-2" />
            Make an Offer
          </Button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Offer Amount ($)
              </label>
              <Input
                type="number"
                value={offerAmount}
                onChange={(e) => setOfferAmount(Number(e.target.value))}
                placeholder="Enter your offer amount"
                min="1"
                required
              />
              {estimatedValue && (
                <p className="text-xs text-gray-500 mt-1">
                  Estimated value: ${estimatedValue.toLocaleString()}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Message (Optional)
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a message to the vehicle owner..."
                rows={3}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Offer'}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
