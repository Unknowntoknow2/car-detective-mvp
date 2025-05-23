
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, CreditCard } from 'lucide-react';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { toast } from '@/hooks/use-toast';

interface PremiumUpgradeCTAProps {
  valuationId: string;
  onUpgraded?: () => void;
}

export const PremiumUpgradeCTA: React.FC<PremiumUpgradeCTAProps> = ({ 
  valuationId,
  onUpgraded 
}) => {
  const { hasPremiumAccess, isLoading, creditsRemaining, usePremiumCredit } = usePremiumAccess(valuationId);
  
  const handleUseCredit = async () => {
    if (creditsRemaining <= 0) {
      toast({
        title: "No credits available",
        description: "Please purchase premium access to unlock this feature.",
        variant: "destructive",
      });
      return;
    }
    
    const success = await usePremiumCredit(valuationId);
    
    if (success) {
      toast({
        title: "Premium access granted!",
        description: "You now have premium access to this valuation.",
        variant: "success",
      });
      if (onUpgraded) onUpgraded();
    } else {
      toast({
        title: "Failed to use credit",
        description: "There was an error using your premium credit. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  if (hasPremiumAccess) return null;
  
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Unlock Premium Features
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Get access to detailed market analysis, CARFAX integration, and more premium features.
        </p>
        
        {creditsRemaining > 0 ? (
          <div className="bg-primary/10 p-3 rounded-md mb-4">
            <p className="text-sm font-medium">
              You have {creditsRemaining} premium credit{creditsRemaining !== 1 ? 's' : ''} available!
            </p>
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="flex flex-col gap-2 sm:flex-row">
        {creditsRemaining > 0 ? (
          <Button 
            onClick={handleUseCredit} 
            className="w-full" 
            disabled={isLoading}
          >
            Use 1 Credit
          </Button>
        ) : (
          <Button 
            onClick={() => window.location.href = `/premium-checkout?id=${valuationId}`}
            className="w-full"
            disabled={isLoading}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Upgrade to Premium
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PremiumUpgradeCTA;
