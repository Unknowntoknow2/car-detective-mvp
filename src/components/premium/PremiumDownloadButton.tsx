
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';

export interface PremiumDownloadButtonProps {
  valuationId: string;
  onDownload: () => void;
  className?: string;
  isDownloading?: boolean;
}

export function PremiumDownloadButton({ 
  valuationId, 
  onDownload, 
  className = "", 
  isDownloading = false 
}: PremiumDownloadButtonProps) {
  return (
    <Button
      variant="default"
      className={`${className}`}
      onClick={onDownload}
      disabled={isDownloading}
    >
      {isDownloading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Generating Report...
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          Download Premium Valuation Report
        </>
      )}
    </Button>
  );
}
