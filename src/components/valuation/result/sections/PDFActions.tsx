
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Mail, Lock, Loader2 } from 'lucide-react';
import { SHOW_ALL_COMPONENTS } from '@/lib/constants';

interface PDFActionsProps {
  isPremium: boolean;
  onDownloadPdf: () => void;
  onEmailPdf: () => void;
  onUpgrade: () => void;
  isDownloading: boolean;
  isEmailSending: boolean;
}

export const PDFActions: React.FC<PDFActionsProps> = ({
  isPremium,
  onDownloadPdf,
  onEmailPdf,
  onUpgrade,
  isDownloading,
  isEmailSending
}) => {
  // In debug mode, always show the premium content
  const showPremiumContent = SHOW_ALL_COMPONENTS || isPremium;
  
  return (
    <Card>
      {SHOW_ALL_COMPONENTS && (
        <div className="bg-green-100 text-green-800 text-xs p-1 rounded-t-sm">
          PDF Actions Component (Premium: {isPremium ? 'Yes' : 'No'})
        </div>
      )}
      <CardHeader className="bg-muted/20">
        <CardTitle className="text-lg">Valuation Report</CardTitle>
      </CardHeader>
      <CardContent className="py-4">
        {showPremiumContent ? (
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="default"
              className="flex-1"
              onClick={onDownloadPdf}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF Report
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={onEmailPdf}
              disabled={isEmailSending}
            >
              {isEmailSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Email Report
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="h-4 w-4 text-primary" />
              <p className="text-sm text-muted-foreground">
                Premium members can download or email a comprehensive PDF report
              </p>
            </div>
            <Button onClick={onUpgrade}>
              Upgrade to Premium
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PDFActions;
