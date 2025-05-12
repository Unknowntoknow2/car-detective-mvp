
import React from 'react';
import { toast } from 'sonner';
import { Bell, BellOff, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';

interface DealerOfferNotificationProps {
  offerId: string;
  amount: number;
  dealerName?: string;
  vehicle?: {
    year: number;
    make: string;
    model: string;
  };
  onViewOffer: () => void;
  onDismiss?: () => void;
}

export function DealerOfferNotification({
  offerId,
  amount,
  dealerName = 'A dealer',
  vehicle,
  onViewOffer,
  onDismiss
}: DealerOfferNotificationProps) {
  const vehicleText = vehicle 
    ? `your ${vehicle.year} ${vehicle.make} ${vehicle.model}` 
    : 'your vehicle';

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss();
    } else {
      toast.dismiss();
    }
  };

  return (
    <Card className="w-full max-w-md border-primary/20">
      <CardHeader className="pb-2 bg-primary/5">
        <CardTitle className="text-base flex items-center">
          <DollarSign className="h-5 w-5 text-primary mr-2" />
          New Dealer Offer
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm">
          <span className="font-semibold">{dealerName}</span> has submitted an offer of{' '}
          <span className="font-semibold text-primary">{formatCurrency(amount)}</span> for {vehicleText}.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 pb-3">
        <Button variant="outline" size="sm" onClick={handleDismiss} className="gap-1">
          <BellOff className="h-4 w-4" />
          Dismiss
        </Button>
        <Button size="sm" onClick={onViewOffer} className="gap-1">
          <Bell className="h-4 w-4" />
          View Offer
        </Button>
      </CardFooter>
    </Card>
  );
}

export function showDealerOfferNotification(props: Omit<DealerOfferNotificationProps, 'onDismiss'>) {
  return toast.custom((id) => (
    <DealerOfferNotification
      {...props}
      onDismiss={() => toast.dismiss(id)}
    />
  ), {
    duration: 10000, // 10 seconds
  });
}
