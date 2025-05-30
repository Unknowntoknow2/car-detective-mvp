
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, X, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useDealerOfferActions } from '@/hooks/useDealerOfferActions';

interface AcceptedOfferCardProps {
  acceptedOffer: {
    id: string;
    accepted_at: string;
    status: 'pending' | 'completed' | 'cancelled';
  };
  offer: {
    id: string;
    offer_amount: number;
    message?: string;
  };
  onCancelled?: () => void;
}

export function AcceptedOfferCard({ acceptedOffer, offer, onCancelled }: AcceptedOfferCardProps) {
  const { cancelAcceptedOffer, isProcessing } = useDealerOfferActions();

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this accepted offer?')) {
      const result = await cancelAcceptedOffer(acceptedOffer.id);
      if (result.success && onCancelled) {
        onCancelled();
      }
    }
  };

  const getStatusBadge = () => {
    switch (acceptedOffer.status) {
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Awaiting Contact
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="destructive">
            <X className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="border-green-200 bg-green-50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-800">Offer Accepted</span>
          </div>
          {getStatusBadge()}
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-2xl font-bold text-green-700">
              ${offer.offer_amount.toLocaleString()}
            </p>
            <p className="text-sm text-green-600">
              Accepted {formatDistanceToNow(new Date(acceptedOffer.accepted_at), { addSuffix: true })}
            </p>
          </div>

          {offer.message && (
            <div className="bg-white p-3 rounded border">
              <div className="flex items-start gap-2">
                <MessageSquare className="h-4 w-4 text-slate-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Dealer Message:</p>
                  <p className="text-sm text-slate-600">{offer.message}</p>
                </div>
              </div>
            </div>
          )}

          {acceptedOffer.status === 'pending' && (
            <div className="bg-amber-50 p-3 rounded border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>Next Steps:</strong> The dealer has been notified and should contact you within 24 hours to finalize the transaction.
              </p>
            </div>
          )}

          {acceptedOffer.status === 'pending' && (
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isProcessing}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                {isProcessing ? 'Cancelling...' : 'Cancel Acceptance'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
