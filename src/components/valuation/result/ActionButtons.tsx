
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { ShareableLink } from '@/components/valuation/ShareableLink';

interface ActionButtonsProps {
  onDownload: () => Promise<void>;
  isDownloading: boolean;
  disabled: boolean;
  valuationId?: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onDownload,
  isDownloading,
  disabled,
  valuationId,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <Button 
        onClick={onDownload}
        disabled={isDownloading || disabled}
        className="flex-1"
      >
        {isDownloading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Generating PDF...
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </>
        )}
      </Button>
      
      {/* Add Share button only if valuationId exists */}
      {valuationId && (
        <ShareableLink valuationId={valuationId} />
      )}
    </div>
  );
};
