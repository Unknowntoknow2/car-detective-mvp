
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Download, Car, FileQuestion } from 'lucide-react';

interface ActionButtonsProps {
  onDownload: () => void;
  isDownloading: boolean;
  disabled: boolean;
  valuationId?: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onDownload,
  isDownloading,
  disabled,
  valuationId
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 mt-6">
      <Button 
        variant="outline" 
        onClick={onDownload} 
        disabled={disabled || isDownloading}
        className="flex-1"
      >
        <Download className="h-4 w-4 mr-2" />
        {isDownloading ? 'Downloading...' : 'Download PDF'}
      </Button>
      
      {valuationId && (
        <Link to={`/offers?valuationId=${valuationId}`} className="flex-1">
          <Button className="w-full" variant="default">
            <Car className="h-4 w-4 mr-2" />
            View Dealer Offers
          </Button>
        </Link>
      )}
      
      <Link to="/premium" className="flex-1">
        <Button variant="secondary" className="w-full">
          <FileQuestion className="h-4 w-4 mr-2" />
          Premium Report
        </Button>
      </Link>
    </div>
  );
};
