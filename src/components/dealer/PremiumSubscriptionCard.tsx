
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckIcon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { usePremiumDealer } from '@/hooks/usePremiumDealer';

export interface PremiumSubscriptionCardProps {
  name: string;
  price: string;
  features: string[];
  recommended?: boolean;
  priceId: string;
}

export function PremiumSubscriptionCard({
  name,
  price,
  features,
  recommended = false,
  priceId
}: PremiumSubscriptionCardProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const { isPremium } = usePremiumDealer();

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan: priceId }
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to start checkout process');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`flex flex-col h-full ${recommended ? 'border-primary' : ''}`}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">
              {name}
            </CardTitle>
            <CardDescription className="mt-1">
              {recommended ? 'Recommended plan with all features' : 'Standard dealer subscription'}
            </CardDescription>
          </div>
          {recommended && (
            <Badge variant="default" className="bg-primary text-white">
              Recommended
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-4">
          <span className="text-3xl font-bold">{price}</span>
        </div>
        <ul className="space-y-2 mb-6">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleSubscribe}
          disabled={isLoading || isPremium}
        >
          {isLoading 
            ? 'Loading...' 
            : isPremium 
              ? 'Already Subscribed' 
              : 'Subscribe'}
        </Button>
      </CardFooter>
    </Card>
  );
}
