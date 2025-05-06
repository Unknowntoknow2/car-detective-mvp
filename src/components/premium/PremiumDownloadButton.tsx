
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lock, Download, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const { isPremium, isLoading, createCheckoutSession } = usePremiumStatus(valuationId);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setError(null);
    
    try {
      const result = await createCheckoutSession(valuationId);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create checkout session');
      }
      
      // If already unlocked, reload the page to update UI state
      if (!result.url) {
        window.location.reload();
        return;
      }
      
      // Redirect to Stripe checkout
      window.location.href = result.url;
    } catch (error: any) {
      console.error('Error in premium unlock:', error);
      setError(error.message || 'Failed to start checkout process');
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

  if (isPremium) {
    return (
      <Button onClick={onDownload} className={className} variant="default">
        <Download className="mr-2 h-4 w-4" />
        Download Premium Report
      </Button>
    );
  }

  return (
    <div className="space-y-2 w-full">
      {error && (
        <Alert variant="destructive" className="mb-2">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
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
    </div>
  );
}
