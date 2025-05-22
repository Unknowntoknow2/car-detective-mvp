
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Crown, Loader2 } from 'lucide-react';

interface PDFPreviewProps {
  onViewSample: () => Promise<boolean>;
  onUpgradeToPremium: () => void;
  isLoading?: boolean;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({
  onViewSample,
  onUpgradeToPremium,
  isLoading = false
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          PDF Valuation Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-semibold mb-2">Free Sample Report</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Download a free sample report to see what information is included. No login required.
            </p>
            <Button 
              variant="outline" 
              className="w-full sm:w-auto" 
              onClick={onViewSample}
              disabled={isLoading}
              data-testid="download-sample-pdf"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download Sample Report
                </>
              )}
            </Button>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2 flex items-center text-primary">
              <Crown className="h-4 w-4 mr-2" />
              Premium Full Report
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Unlock the full valuation report with detailed condition assessment, market analysis, and price adjustments.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-muted rounded-md p-3">
                <p className="text-xs font-medium">Includes:</p>
                <ul className="text-xs mt-1 space-y-1">
                  <li>• Complete market analysis</li>
                  <li>• Detailed condition assessment</li>
                  <li>• VIN history verification</li>
                  <li>• Comparable vehicles pricing</li>
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <Button 
                  className="w-full" 
                  onClick={onUpgradeToPremium}
                  data-testid="upgrade-to-premium"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Premium
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
