
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface DownloadPDFButtonProps {
  valuationId: string;
  onDownload?: () => void;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
}

export function DownloadPDFButton({
  valuationId,
  onDownload,
  className,
  variant = 'outline'
}: DownloadPDFButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      // Here you would fetch the PDF URL or generate it on the fly
      // This is a placeholder implementation
      
      // Example: simulate PDF generation delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // You could use the downloadPdf utility
      // await downloadPdf(valuationId);
      
      // Example URL for testing
      const pdfUrl = `/api/pdf/valuation-${valuationId}.pdf`;
      
      // Create an anchor element and trigger download
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = `Valuation-${valuationId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      if (onDownload) onDownload();
      
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download PDF');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={handleDownload}
      disabled={isLoading}
      className={cn("gap-1", className)}
    >
      {isLoading ? (
        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      Download PDF
    </Button>
  );
}
