
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Mail, Lock } from 'lucide-react';
import { Heading, BodyS } from '@/components/ui-kit/typography';
import { PremiumBadge } from '@/components/ui/premium-badge';

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
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Heading className="text-xl font-semibold mb-4">
        Download or Email Report
      </Heading>
      
      <div className="space-y-4">
        {isPremium ? (
          <>
            <BodyS className="text-muted-foreground">
              Download a comprehensive PDF report or have it sent to your email.
            </BodyS>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={onDownloadPdf} 
                disabled={isDownloading}
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4" />
                {isDownloading ? 'Downloading...' : 'Download PDF Report'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={onEmailPdf}
                disabled={isEmailSending}
                className="flex-1"
              >
                <Mail className="mr-2 h-4 w-4" />
                {isEmailSending ? 'Sending...' : 'Email Report'}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <BodyS>
                Unlock full PDF reports and email delivery with Premium
              </BodyS>
            </div>
            
            <Button onClick={onUpgrade} className="w-full">
              Upgrade to Premium <PremiumBadge className="ml-2" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default PDFActions;
