<<<<<<< HEAD

import React from 'react';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { usePremiumPayment } from '@/hooks/usePremiumPayment';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
=======
import React from "react";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { usePremiumPayment } from "@/hooks/usePremiumPayment";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

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
<<<<<<< HEAD
  feature = 'premium feature',
  ctaText = 'Unlock Premium Report',
  returnUrl,
  variant = 'default',
  className
=======
  feature = "premium feature",
  ctaText = "Unlock Premium Report",
  returnUrl,
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
}) => {
  const { createPaymentSession, isLoading } = usePremiumPayment();

  const handleUnlock = async () => {
    await createPaymentSession(valuationId, returnUrl);
  };
<<<<<<< HEAD
  
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
=======

  return (
    <div className="p-6 border rounded-lg bg-muted/20 text-center">
      <div className="flex justify-center mb-4">
        <div className="bg-amber-100 p-3 rounded-full">
          <Lock className="h-8 w-8 text-amber-500" />
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">Premium Feature</h3>

      <p className="text-muted-foreground mb-6">
        This {feature}{" "}
        requires a premium subscription. Unlock now for full access.
      </p>

      <Button
        onClick={handleUnlock}
        disabled={isLoading}
        className="w-full sm:w-auto"
      >
        {isLoading ? "Processing..." : ctaText}
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
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
