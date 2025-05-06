
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Lock, Loader2 } from 'lucide-react';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { cn } from '@/lib/utils';
import { PremiumBadge } from '@/components/ui/premium-badge';

interface PremiumDownloadButtonProps {
  valuationId?: string;
  onDownload: () => void;
  className?: string;
  isDownloading?: boolean;
}

export function PremiumDownloadButton({
  valuationId,
  onDownload,
  className,
  isDownloading = false
}: PremiumDownloadButtonProps) {
  const { isPremium, isLoading, createCheckoutSession } = usePremiumStatus(valuationId);
  
  const handleUnlockPremium = async () => {
    if (!valuationId) return;
    
    const { success, url } = await createCheckoutSession(valuationId);
    if (success && url) {
      window.location.href = url;
    }
  };
  
  if (isLoading) {
    return (
      <Button disabled className={cn("w-full", className)}>
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Checking status...
      </Button>
    );
  }
  
  if (isPremium) {
    return (
      <Button 
        onClick={onDownload} 
        disabled={isDownloading}
        className={cn("w-full gap-2", className)}
      >
        {isDownloading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        <span className="flex items-center gap-2">
          Download Premium Report
          <PremiumBadge size="sm" variant="gold" icon={false} className="ml-1">Premium</PremiumBadge>
        </span>
      </Button>
    );
  }
  
  return (
    <Button 
      variant="outline" 
      onClick={handleUnlockPremium}
      className={cn("w-full", className)}
    >
      <Lock className="h-4 w-4 mr-2" />
      Unlock Premium Features
    </Button>
  );
}
