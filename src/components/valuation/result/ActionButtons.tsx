
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Mail, Share } from 'lucide-react';

interface ActionButtonsProps {
  onDownload: () => void;
  isDownloading: boolean;
  disabled?: boolean;
  valuationId?: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onDownload,
  isDownloading,
  disabled = false,
  valuationId
}) => {
  return (
    <div className="mt-6 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
      <Button 
        onClick={onDownload} 
        disabled={isDownloading || disabled} 
        className="flex items-center justify-center"
      >
        <Download className="mr-2 h-4 w-4" />
        {isDownloading ? 'Preparing PDF...' : 'Download Report'}
      </Button>
      
      <Button 
        variant="outline" 
        className="flex items-center justify-center"
        disabled={disabled}
      >
        <Mail className="mr-2 h-4 w-4" />
        Email Report
      </Button>

      {valuationId && (
        <Button 
          variant="outline" 
          className="flex items-center justify-center"
          disabled={disabled}
        >
          <Share className="mr-2 h-4 w-4" />
          Share
        </Button>
      )}
    </div>
  );
};
