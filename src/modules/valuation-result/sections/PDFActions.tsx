// Update the import to use the correct Heading component
import { Heading } from "@/components/ui-kit/typography";
import { BodyS } from "@/components/ui-kit/typography";
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Share2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const PDFActions = () => {
  const handleDownloadPDF = () => {
    console.log('Downloading PDF...');
    // Implementation for PDF download
  };

  const handleShareReport = () => {
    console.log('Sharing report...');
    // Implementation for sharing functionality
  };

  const handlePrintReport = () => {
    console.log('Printing report...');
    window.print();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Heading className="text-2xl font-bold mb-4">Download Report</Heading>
      
      <div className="space-y-4">
        <BodyS className="text-muted-foreground">
          Save or share this valuation report for your records. The PDF includes all details and can be used for insurance or selling purposes.
        </BodyS>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          <Card className="p-4 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer" onClick={handleDownloadPDF}>
            <Download className="h-8 w-8 mb-2 text-primary" />
            <span className="font-medium">Download PDF</span>
            <BodyS className="text-muted-foreground mt-1">Save to your device</BodyS>
          </Card>
          
          <Card className="p-4 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer" onClick={handleShareReport}>
            <Share2 className="h-8 w-8 mb-2 text-primary" />
            <span className="font-medium">Share Report</span>
            <BodyS className="text-muted-foreground mt-1">Email or message</BodyS>
          </Card>
          
          <Card className="p-4 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer" onClick={handlePrintReport}>
            <FileText className="h-8 w-8 mb-2 text-primary" />
            <span className="font-medium">Print Report</span>
            <BodyS className="text-muted-foreground mt-1">Physical copy</BodyS>
          </Card>
        </div>
        
        <div className="flex justify-center mt-6">
          <Button variant="outline" onClick={handleDownloadPDF} className="gap-2">
            <Download className="h-4 w-4" />
            Download Complete Report
          </Button>
        </div>
      </div>
    </div>
  );
};
