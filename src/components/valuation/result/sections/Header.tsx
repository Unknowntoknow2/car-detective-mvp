
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share, Download, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  vehicleInfo: {
    year?: number;
    make?: string;
    model?: string;
    trim?: string;
  };
  onShare?: () => void;
  onDownload?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  vehicleInfo, 
  onShare, 
  onDownload 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="pb-4 border-b">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2" 
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model} 
            {vehicleInfo.trim && ` ${vehicleInfo.trim}`}
          </h1>
          <p className="text-muted-foreground mt-1">Valuation Report</p>
        </div>
        
        <div className="flex space-x-2 mt-4 sm:mt-0">
          {onShare && (
            <Button variant="outline" size="sm" onClick={onShare}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          )}
          
          {onDownload && (
            <Button variant="outline" size="sm" onClick={onDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
