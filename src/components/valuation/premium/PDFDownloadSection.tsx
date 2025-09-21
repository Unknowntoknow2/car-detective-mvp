
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface PDFDownloadSectionProps {
  valuationId: string;
}

const PDFDownloadSection: React.FC<PDFDownloadSectionProps> = ({ valuationId }) => {
  const handleDownload = () => {
  };

  return (
    <Button onClick={handleDownload} className="gap-2">
      <Download className="h-4 w-4" />
      Download PDF Report
    </Button>
  );
};

export default PDFDownloadSection;
