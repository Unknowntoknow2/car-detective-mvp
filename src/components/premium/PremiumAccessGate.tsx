
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { usePremiumCredits } from '@/hooks/usePremiumCredits';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface PremiumAccessGateProps {
  valuationId: string;
  children: React.ReactNode;
}

export function PremiumAccessGate({ valuationId, children }: PremiumAccessGateProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { credits, isLoading, useCredit } = usePremiumCredits();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleUnlock = async () => {
    if (!user) {
      navigate('/auth?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    setIsProcessing(true);
    
    try {
      // Try to use a credit
      const success = await useCredit(valuationId);
      
      if (success) {
        // Refresh the page to show premium content
        window.location.reload();
        return;
      }
      
      // If no credits or failed, navigate to pricing page
      navigate(`/pricing?valuation=${valuationId}`);
    } catch (error) {
      console.error('Error unlocking premium content:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (credits > 0) {
    return (
      <Card className="shadow-lg border-primary/20">
        <CardHeader className="bg-primary-50 dark:bg-primary-950/20">
          <CardTitle className="text-xl">Premium Content Available</CardTitle>
          <CardDescription>
            You have {credits} premium credit{credits !== 1 ? 's' : ''} remaining
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-muted-foreground mb-4">
            Unlock this premium valuation to get detailed analytics, market comparison, and more.
          </p>
        </CardContent>
        <CardFooter className="flex justify-end gap-4 pt-2">
          <Button 
            onClick={handleUnlock} 
            disabled={isProcessing}
            className="w-full md:w-auto"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Use 1 Credit to Unlock'
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-primary/20">
      <CardHeader className="bg-primary-50 dark:bg-primary-950/20">
        <CardTitle className="text-xl">Premium Content Locked</CardTitle>
        <CardDescription>
          Unlock detailed insights and market analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-muted-foreground mb-4">
          Get access to premium features including detailed market analysis, 
          condition assessment, and more.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-end gap-4 pt-2">
        <Button 
          variant="outline" 
          onClick={() => navigate('/pricing')}
          className="w-full sm:w-auto"
        >
          View Pricing Options
        </Button>
        <Button 
          onClick={handleUnlock} 
          disabled={isProcessing}
          className="w-full sm:w-auto"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Unlock Premium Access'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
