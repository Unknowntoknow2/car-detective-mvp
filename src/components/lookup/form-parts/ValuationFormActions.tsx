
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Download, ArrowRight, Check } from 'lucide-react';
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
  isSuccess?: boolean;
  onManualEntryClick?: () => void; // Add this new prop to the interface
}

export const ValuationFormActions: React.FC<ValuationFormActionsProps> = ({
  isLoading,
  submitButtonText,
  onSubmit,
  onBack,
  onDownloadPdf,
  showDownload = false,
  downloadButtonText = "Download Report",
  isDownloading = false,
  isSuccess = false,
  onManualEntryClick // Add this prop to the component parameters
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
            isLoading={isDownloading}
            loadingText="Generating..."
            className="h-12 font-medium text-base rounded-lg"
          >
            {isSuccess ? (
              <>
                <Check className="mr-2 h-5 w-5 text-green-500" />
                Downloaded
              </>
            ) : (
              <>
                <Download className="mr-2 h-5 w-5" />
                {downloadButtonText}
              </>
            )}
          </Button>
        )}
        
        {/* Add Manual Entry button */}
        {onManualEntryClick && (
          <Button
            onClick={onManualEntryClick}
            variant="outline"
            className="h-12 font-medium text-base rounded-lg"
          >
            Manual Entry
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
          isLoading={isLoading}
          loadingText="Processing..."
          className="w-full bg-primary text-white h-12 font-medium text-base rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          {!isLoading && (
            <>
              {submitButtonText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
        
        {/* Visual feedback for focus */}
        <motion.span 
          className="absolute inset-0 -z-10 bg-primary/20 rounded-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          whileHover={{ opacity: 1, scale: 1.05 }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    </div>
  );
};
