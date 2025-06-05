
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';

interface PdfPreviewProps {
  onDownload?: () => void;
}

export const PdfPreview: React.FC<PdfPreviewProps> = ({ onDownload }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          PDF Report Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Preview your vehicle valuation report before downloading.
            </p>
          </div>
          <Button onClick={onDownload} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Download PDF Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
