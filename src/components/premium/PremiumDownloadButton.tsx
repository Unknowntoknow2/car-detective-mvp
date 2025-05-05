
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lock, Download, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
  const { isPremium, isLoading } = usePremiumStatus(valuationId);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePremiumUnlock = async () => {
    if (!user) {
      toast.error('You must be logged in to unlock premium features');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Call the Edge Function to create a checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { valuationId }
      });
      
      if (error) throw new Error(error.message);
      
      // If already unlocked, just notify the user
      if (data.already_unlocked) {
        toast.success('Premium features are already unlocked!');
        window.location.reload(); // Refresh to update UI state
        return;
      }
      
      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to start checkout process. Please try again.');
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
