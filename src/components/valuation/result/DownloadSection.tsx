
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Mail } from 'lucide-react';

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
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
      <Button 
        onClick={onDownload} 
        disabled={isDownloading} 
        className="flex items-center justify-center"
      >
        <Download className="mr-2 h-4 w-4" />
        {isDownloading ? 'Preparing PDF...' : 'Download Report'}
      </Button>
      
      <Button 
        variant="outline" 
        className="flex items-center justify-center"
      >
        <Mail className="mr-2 h-4 w-4" />
        Email Report
      </Button>
    </div>
  );
};
