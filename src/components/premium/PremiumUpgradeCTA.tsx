
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { createCheckoutSession } from '@/utils/stripeClient';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Package, PackageCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PremiumUpgradeCTAProps {
  valuationId?: string;
  onClose?: () => void;
}

export function PremiumUpgradeCTA({ valuationId, onClose }: PremiumUpgradeCTAProps) {
  const { user, isLoading: authLoading } = useAuth();
  const { hasPremiumAccess, creditsRemaining, isLoading: premiumLoading } = usePremiumAccess(valuationId);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  
  const isLoading = authLoading || premiumLoading;

  const handleSignIn = () => {
    navigate(`/auth?redirect=${encodeURIComponent(window.location.pathname)}`);
  };

  const handleUpgrade = async (bundle: number) => {
    if (!user) {
      handleSignIn();
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const successUrl = valuationId 
        ? `/valuation/${valuationId}?premium=1` 
        : `/account?premium=1`;
        
      const data = await createCheckoutSession({
        bundle,
        valuationId,
        successUrl,
        cancelUrl: window.location.href
      });
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to process payment');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 flex justify-center items-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (hasPremiumAccess) {
    return (
      <Card className="w-full border-green-200 bg-green-50 dark:bg-green-900/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-green-500" />
            Premium Access Unlocked
          </CardTitle>
          <CardDescription>
            You have {creditsRemaining} premium credit{creditsRemaining !== 1 ? 's' : ''} remaining
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </CardFooter>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sign In to Access Premium Features</CardTitle>
          <CardDescription>
            Create an account or sign in to purchase premium valuations
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={handleSignIn}>Sign In / Register</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Single Report</CardTitle>
          <CardDescription>
            One premium valuation report
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-3xl font-bold">$19.99</p>
          <ul className="mt-4 space-y-2">
            <li className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Full CARFAX integration
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Detailed PDF report
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Market comparison data
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => handleUpgrade(1)}
            disabled={isProcessing}
          >
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Buy Now
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="flex flex-col border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            3-Pack Bundle
            <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">Best Value</span>
          </CardTitle>
          <CardDescription>
            Three premium valuation reports
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-3xl font-bold">$49.99</p>
          <p className="text-sm text-muted-foreground">$16.66 per report (Save 17%)</p>
          <ul className="mt-4 space-y-2">
            <li className="flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              3 premium credits
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              All premium features
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Valid for 12 months
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => handleUpgrade(3)}
            disabled={isProcessing}
          >
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Buy 3-Pack
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>5-Pack Bundle</CardTitle>
          <CardDescription>
            Five premium valuation reports
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-3xl font-bold">$79.99</p>
          <p className="text-sm text-muted-foreground">$16.00 per report (Save 20%)</p>
          <ul className="mt-4 space-y-2">
            <li className="flex items-center gap-2">
              <PackageCheck className="h-4 w-4 text-primary" />
              5 premium credits
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              All premium features
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Valid for 12 months
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => handleUpgrade(5)}
            disabled={isProcessing}
          >
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Buy 5-Pack
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
