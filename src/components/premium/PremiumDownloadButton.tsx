
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lock, Download, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
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
  const [success, setSuccess] = useState<boolean>(false);

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
    setSuccess(false);
    
    try {
      const result = await createCheckoutSession(valuationId);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create checkout session');
      }
      
      // If already unlocked, reload the page to update UI state
      if (!result.url) {
        setSuccess(true);
        toast.success('Premium features unlocked!', {
          description: 'Refresh the page to access all premium features.'
        });
        
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        return;
      }
      
      toast.success('Redirecting to secure checkout...', {
        description: 'You will be taken to our payment processor.'
      });
      
      // Redirect to Stripe checkout
      setTimeout(() => {
        window.location.href = result.url;
      }, 800);
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

  const handleDownloadClick = async () => {
    setIsProcessing(true);
    setSuccess(false);
    
    try {
      await onDownload();
      setSuccess(true);
      toast.success('Report downloaded successfully!');
    } catch (error: any) {
      console.error('Download error:', error);
      setError(error.message || 'Failed to download report');
      toast.error('Download failed', {
        description: error.message || 'Please try again'
      });
    } finally {
      setIsProcessing(false);
      // Reset success state after 3 seconds
      if (success) {
        setTimeout(() => setSuccess(false), 3000);
      }
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
      <Button 
        onClick={handleDownloadClick} 
        className={`relative ${className}`} 
        variant="default"
        disabled={isProcessing}
      >
        {isProcessing ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : success ? (
          <CheckCircle className="mr-2 h-4 w-4" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
        {isProcessing ? 'Preparing Download...' : 
         success ? 'Downloaded Successfully' : 
         'Download Premium Report'}
        
        {/* Success animation */}
        {success && (
          <span className="absolute inset-0 rounded-md bg-green-500/10 animate-pulse" />
        )}
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
        className={`${className} transition-all duration-300 relative`} 
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
        
        {/* Subtle pulsing effect to draw attention */}
        <span className="absolute inset-0 rounded-md bg-white/10 animate-pulse" 
              style={{animationDuration: '3s'}} />
      </Button>
      
      <p className="text-xs text-center text-muted-foreground">
        Secure payment • Instant access • 100% Satisfaction guarantee
      </p>
    </div>
  );
}
