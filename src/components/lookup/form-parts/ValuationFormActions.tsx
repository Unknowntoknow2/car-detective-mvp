
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ValuationFormActionsProps {
  isLoading: boolean;
  submitButtonText: string;
  onSubmit: () => void;
  onBack?: () => void;
  onDownloadPdf?: () => void;
  showDownload?: boolean;
  downloadButtonText?: string;
  isDownloading?: boolean;
}

export const ValuationFormActions: React.FC<ValuationFormActionsProps> = ({
  isLoading,
  submitButtonText,
  onSubmit,
  onBack,
  onDownloadPdf,
  showDownload = false,
  downloadButtonText = "Download Report",
  isDownloading = false
}) => {
  const handleDownloadClick = () => {
    if (onDownloadPdf) {
      onDownloadPdf();
    } else {
      toast.error("Download functionality not implemented");
    }
  };

  return (
    <div className="flex justify-between items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        {onBack && (
          <Button 
            onClick={onBack} 
            variant="outline"
            className="h-12 font-medium text-base rounded-lg"
          >
            Back
          </Button>
        )}
        
        {showDownload && (
          <Button
            onClick={handleDownloadClick}
            variant="outline"
            disabled={isDownloading}
            className="h-12 font-medium text-base rounded-lg"
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="mr-2 h-5 w-5" />
                {downloadButtonText}
              </>
            )}
          </Button>
        )}
      </div>
      
      <motion.div
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        className="relative"
      >
        <Button 
          onClick={onSubmit} 
          disabled={isLoading}
          className="w-full bg-primary text-white h-12 font-medium text-base rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            submitButtonText
          )}
        </Button>
      </motion.div>
    </div>
  );
};
