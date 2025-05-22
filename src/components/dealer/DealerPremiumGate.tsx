
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth } from '@/hooks/useAuth';
import { usePremiumDealer } from '@/hooks/usePremiumDealer';
import { Crown, Loader2, Store } from 'lucide-react';

interface DealerPremiumGateProps {
  children: React.ReactNode;
}

export function DealerPremiumGate({ children }: DealerPremiumGateProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPremium, isLoading, expiryDate } = usePremiumDealer();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = () => {
    if (!user) {
      navigate('/auth?redirect=' + encodeURIComponent('/dealer/subscription'));
      return;
    }

    navigate('/dealer/subscription');
  };

  const handleManage = () => {
    navigate('/account/subscription');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <Card className="shadow-lg border-primary/20">
      <CardHeader className="bg-primary-50 dark:bg-primary-950/20">
        <CardTitle className="text-xl flex items-center">
          <Store className="h-5 w-5 mr-2" />
          Dealer Features Locked
        </CardTitle>
        <CardDescription>
          Subscribe to access premium dealer tools
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-muted-foreground mb-4">
          Upgrade to a dealer subscription to access inventory management,
          premium valuations, lead generation tools, and more.
        </p>
        
        <div className="bg-muted rounded-md p-4 mb-4">
          <h4 className="font-medium mb-2">Dealer Benefits:</h4>
          <ul className="space-y-1 text-sm">
            <li>• Premium valuation reports</li>
            <li>• Inventory management system</li>
            <li>• Lead generation tools</li>
            <li>• Market analytics</li>
            <li>• Team member accounts</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-end gap-4 pt-2">
        <Button 
          onClick={handleSubscribe} 
          disabled={isProcessing}
          className="w-full sm:w-auto"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Crown className="mr-2 h-4 w-4" />
              Subscribe Now
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
