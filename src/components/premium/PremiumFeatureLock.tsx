
import React from 'react';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { usePremiumPayment } from '@/hooks/usePremiumPayment';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PremiumFeatureLockProps {
  valuationId: string;
  feature?: string;
  ctaText?: string;
  returnUrl?: string;
  variant?: 'default' | 'inline' | 'minimal';
  className?: string;
}

export const PremiumFeatureLock: React.FC<PremiumFeatureLockProps> = ({
  valuationId,
  feature = 'premium feature',
  ctaText = 'Unlock Premium Report',
  returnUrl,
  variant = 'default',
  className
}) => {
  const { createPaymentSession, isLoading } = usePremiumPayment();
  
  const handleUnlock = async () => {
    await createPaymentSession(valuationId, returnUrl);
  };
  
  // Minimal variant just shows a button
  if (variant === 'minimal') {
    return (
      <Button 
        onClick={handleUnlock} 
        disabled={isLoading}
        className={className}
        size="sm"
      >
        <Lock className="h-3.5 w-3.5 mr-1.5" />
        {isLoading ? 'Processing...' : ctaText}
      </Button>
    );
  }
  
  // Inline variant is more compact
  if (variant === 'inline') {
    return (
      <div className={cn("flex items-center gap-3 p-3 border rounded-lg bg-amber-50", className)}>
        <div className="bg-amber-100 p-2 rounded-full">
          <Lock className="h-5 w-5 text-amber-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-800">
            Premium Feature
          </p>
          <p className="text-xs text-amber-700">
            Unlock this {feature} with premium access
          </p>
        </div>
        <Button 
          onClick={handleUnlock} 
          disabled={isLoading}
          size="sm"
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          {isLoading ? 'Processing...' : 'Unlock'}
        </Button>
      </div>
    );
  }
  
  // Default full-sized variant
  return (
    <Card className={cn("border-amber-200 bg-amber-50", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <Lock className="h-5 w-5" />
          Premium Feature
        </CardTitle>
        <CardDescription className="text-amber-700">
          This feature requires premium access
        </CardDescription>
      </CardHeader>
      <CardContent className="text-amber-700">
        <p>
          Upgrade to our premium valuation package to unlock this {feature} along with comprehensive vehicle
          valuation reports, CARFAX history, dealer offers, and more.
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleUnlock} 
          disabled={isLoading} 
          className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white"
        >
          {isLoading ? 'Processing...' : ctaText}
        </Button>
      </CardFooter>
    </Card>
  );
};
