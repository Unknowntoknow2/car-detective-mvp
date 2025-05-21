
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { saveAs } from 'file-saver';

interface DownloadPDFButtonProps {
  valuationId: string;
  fileName?: string;
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
}

export function DownloadPDFButton({
  valuationId,
  fileName = 'valuation-report.pdf',
  children,
  className,
  variant = 'outline'
}: DownloadPDFButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    if (!valuationId) return;
    
    setIsLoading(true);
    try {
      // Fix PDF download implementation
      const response = await fetch(`/api/pdf-report/${valuationId}`);
      if (!response.ok) {
        throw new Error(`Failed to download PDF: ${response.statusText}`);
      }
      
      const blob = await response.blob(); // Get blob instead of arrayBuffer
      
      // Use file-saver to download the blob as a file
      saveAs(blob, fileName);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleDownload}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      {children || 'Download PDF Report'}
    </Button>
  );
}
