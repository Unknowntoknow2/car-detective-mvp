import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CDButton } from '@/components/ui-kit/CDButton';
import { BodyS } from '@/components/ui-kit/typography';
import { Lock, Download } from 'lucide-react';
import styles from './styles';

interface MobileLayoutProps {
  children: React.ReactNode;
  isPremium: boolean;
  isLoading: boolean;
  onUpgrade: () => void;
  onDownloadPdf: () => Promise<void>;
  estimatedValue: number;
  isDownloading?: boolean;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  isPremium,
  isLoading,
  onUpgrade,
  onDownloadPdf,
  estimatedValue,
  isDownloading = false
}) => {
  return (
    <React.Fragment>
      {children}
      
      {/* Mobile Action Bar */}
      <AnimatePresence mode="wait">
        {!isLoading && (
          <motion.div
            className={styles.mobile.actionBar}
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col">
              <BodyS className="text-neutral-dark">Estimated Value</BodyS>
              <span className="text-xl font-bold text-primary">
                ${estimatedValue.toLocaleString()}
              </span>
            </div>
            
            {isPremium ? (
              <CDButton 
                variant="primary"
                icon={<Download className="h-4 w-4" />}
                onClick={onDownloadPdf}
                isLoading={isDownloading}
                className="w-1/2"
              >
                Get PDF
              </CDButton>
            ) : (
              <CDButton 
                variant="primary"
                icon={<Lock className="h-4 w-4" />}
                onClick={onUpgrade}
                className="w-1/2"
              >
                Unlock Premium
              </CDButton>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </React.Fragment>
  );
};

export default MobileLayout;
