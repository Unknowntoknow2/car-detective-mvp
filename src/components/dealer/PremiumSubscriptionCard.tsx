
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { usePremiumDealer } from '@/hooks/usePremiumDealer';

interface PremiumSubscriptionCardProps {
  tier: 'monthly' | 'yearly';
  price: string;
  features: string[];
  ctaText?: string;
  recommended?: boolean;
}

export function PremiumSubscriptionCard({
  tier,
  price,
  features,
  ctaText = 'Subscribe',
  recommended = false
}: PremiumSubscriptionCardProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const { isPremium } = usePremiumDealer();

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan: tier }
      });

      if (error) {
        console.error('Error creating checkout session:', error);
        toast.error('Unable to start subscription process');
        return;
      }

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      }
    } catch (err) {
      console.error('Error in subscription process:', err);
      toast.error('Something went wrong with the subscription process');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`flex flex-col ${recommended ? 'border-primary shadow-md' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">
              {tier === 'monthly' ? 'Monthly' : 'Annual'}
            </CardTitle>
            <CardDescription className="mt-1">
              {tier === 'yearly' ? 'Save 15% with yearly billing' : 'Simple month-to-month billing'}
            </CardDescription>
          </div>
          {recommended && (
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-primary text-primary-foreground rounded-full">
              Recommended
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-4">
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-muted-foreground">{tier === 'monthly' ? '/month' : '/year'}</span>
        </div>
        <ul className="space-y-2 mb-6">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubscribe} 
          disabled={isLoading || isPremium} 
          className="w-full"
          variant={recommended ? "default" : "outline"}
        >
          {isLoading 
            ? 'Loading...' 
            : isPremium 
              ? 'Already Subscribed' 
              : ctaText}
        </Button>
      </CardFooter>
    </Card>
  );
}
