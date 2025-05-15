
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, Download } from 'lucide-react';

export interface MobileLayoutProps {
  children: React.ReactNode;
  isPremium: boolean;
  isLoading: boolean;
  onUpgrade: () => Promise<void>;
  onDownloadPdf: () => Promise<void>;
  estimatedValue: number;
  isDownloading: boolean;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  isPremium,
  isLoading,
  onUpgrade,
  onDownloadPdf,
  estimatedValue,
  isDownloading
}) => {
  return (
    <div className="relative">
      {children}
      
      {/* Mobile action bar - fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg p-3 flex items-center justify-between sm:hidden">
        {isPremium ? (
          <Button 
            onClick={onDownloadPdf} 
            className="flex-1 mr-2"
            variant="default"
            disabled={isDownloading}
          >
            <Download className="mr-2 h-4 w-4" />
            {isDownloading ? "Generating..." : "Download PDF"}
          </Button>
        ) : (
          <Button 
            onClick={onUpgrade} 
            className="flex-1 mr-2" 
            variant="default"
            disabled={isLoading}
          >
            <ArrowUp className="mr-2 h-4 w-4" />
            Upgrade to Premium
          </Button>
        )}
        
        <Button variant="outline" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <ArrowUp className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MobileLayout;
