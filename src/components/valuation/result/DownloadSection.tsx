
import React from 'react';
import { PremiumDownloadButton } from '@/components/premium/PremiumDownloadButton';

interface DownloadSectionProps {
  valuationId: string;
  onDownload: () => void;
  isDownloading: boolean;
}

export const DownloadSection: React.FC<DownloadSectionProps> = ({
  valuationId,
  onDownload,
  isDownloading
}) => {
  return (
    <div className="mt-6">
      <PremiumDownloadButton 
        valuationId={valuationId}
        onDownload={onDownload}
        className="w-full"
        isDownloading={isDownloading}
      />
    </div>
  );
};
