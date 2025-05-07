
import React, { useState } from 'react';
import { CDButton } from '@/components/ui-kit/CDButton';
import { CDCard, CDCardHeader, CDCardBody } from '@/components/ui-kit/CDCard';
import { HeadingL, BodyS } from '@/components/ui-kit/typography';
import { Download, Share2, Lock, Mail } from 'lucide-react';
import styles from '../styles';

interface PDFActionsProps {
  isPremium: boolean;
  onDownloadPdf: () => Promise<void>;
  onEmailPdf?: () => Promise<void>;
  onUpgrade: () => void;
  isDownloading?: boolean;
  isEmailSending?: boolean;
}

export const PDFActions: React.FC<PDFActionsProps> = ({
  isPremium,
  onDownloadPdf,
  onEmailPdf,
  onUpgrade,
  isDownloading = false,
  isEmailSending = false
}) => {
  const [showShare, setShowShare] = useState(false);
  
  return (
    <CDCard>
      <CDCardHeader>
        <div className="flex justify-between items-center">
          <HeadingL as="h3" className="text-xl font-medium">
            Valuation Report
          </HeadingL>
          {isPremium && (
            <span className={styles.premiumBadge}>
              Premium
            </span>
          )}
        </div>
      </CDCardHeader>
      
      <CDCardBody>
        {isPremium ? (
          <>
            <div className="flex flex-col sm:flex-row gap-3">
              <CDButton
                variant="primary"
                icon={<Download className="h-4 w-4" />}
                onClick={onDownloadPdf}
                isLoading={isDownloading}
                className="flex-1"
              >
                Download PDF Report
              </CDButton>
              
              {onEmailPdf && (
                <CDButton
                  variant="outline"
                  icon={<Mail className="h-4 w-4" />}
                  onClick={onEmailPdf}
                  isLoading={isEmailSending}
                  className="flex-1"
                >
                  Email Report
                </CDButton>
              )}
              
              <CDButton
                variant="secondary"
                icon={<Share2 className="h-4 w-4" />}
                onClick={() => setShowShare(!showShare)}
                className="flex-none"
              >
                Share
              </CDButton>
            </div>
            
            {showShare && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <BodyS className="text-gray-600 mb-2">
                  Share this valuation report with others:
                </BodyS>
                <div className="flex gap-2">
                  {/* Social share buttons would go here */}
                  <BodyS className="text-primary">
                    Copy link functionality would go here
                  </BodyS>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-3">
              <BodyS className="text-gray-600">
                Unlock premium features to download a detailed PDF report with market analysis, 
                condition assessment, and pricing recommendations.
              </BodyS>
            </div>
            
            <CDButton
              variant="primary"
              icon={<Lock className="h-4 w-4" />}
              onClick={onUpgrade}
              className="w-full"
            >
              Unlock Premium Features
            </CDButton>
          </>
        )}
      </CDCardBody>
    </CDCard>
  );
};

export default PDFActions;
