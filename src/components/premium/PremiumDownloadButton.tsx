
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lock, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { useAuth } from '@/contexts/AuthContext';
import { createCheckoutSession } from '@/utils/premiumService';

interface PremiumDownloadButtonProps {
  valuationId: string;
  onDownload: () => Promise<void>;
  className?: string;
}

export function PremiumDownloadButton({ 
  valuationId, 
  onDownload, 
  className 
}: PremiumDownloadButtonProps) {
  const { user } = useAuth();
  const { hasPremiumAccess, isLoading } = usePremiumAccess(valuationId);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePremiumUnlock = async () => {
    if (!user) {
      toast.error('You must be logged in to unlock premium features');
      return;
    }

    if (!valuationId) {
      toast.error('Valuation ID is required');
      return;
    }

    setIsProcessing(true);
    
    try {
      const result = await createCheckoutSession(valuationId);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create checkout session');
      }
      
      // If already unlocked, reload the page to update UI state
      if (result.alreadyUnlocked) {
        toast.success('Premium features are already unlocked!');
        window.location.reload();
        return;
      }
      
      // Redirect to Stripe checkout
      if (result.url) {
        window.location.href = result.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error: any) {
      console.error('Error in premium unlock:', error);
      toast.error('Failed to start checkout process', {
        description: error.message || 'Please try again'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <Button disabled className={className}>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Checking access...
      </Button>
    );
  }

  if (hasPremiumAccess) {
    return (
      <Button onClick={onDownload} className={className} variant="default">
        <Download className="mr-2 h-4 w-4" />
        Download Premium Report
      </Button>
    );
  }

  return (
    <Button 
      onClick={handlePremiumUnlock} 
      className={className} 
      variant="premium"
      disabled={isProcessing}
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Lock className="mr-2 h-4 w-4" />
          Unlock Premium Report
        </>
      )}
    </Button>
  );
}
