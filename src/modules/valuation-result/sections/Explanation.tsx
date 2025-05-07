
import React from 'react';
import { motion } from 'framer-motion';
import { CDCard, CDCardHeader, CDCardBody } from '@/components/ui-kit/CDCard';
import { CDButton } from '@/components/ui-kit/CDButton';
import { HeadingL, BodyM } from '@/components/ui-kit/typography';
import { Lock } from 'lucide-react';
import styles from '../styles';

interface ExplanationProps {
  explanation: string;
  isPremium: boolean;
  onUpgrade: () => void;
}

export const Explanation: React.FC<ExplanationProps> = ({
  explanation,
  isPremium,
  onUpgrade
}) => {
  return (
    <CDCard>
      <CDCardHeader>
        <div className="flex justify-between items-center">
          <HeadingL as="h3" className="text-xl font-medium">
            Expert Analysis
          </HeadingL>
          {isPremium && (
            <span className={styles.premiumBadge}>
              Premium
            </span>
          )}
        </div>
      </CDCardHeader>
      
      <CDCardBody>
        <div className={styles.explanation.container}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <BodyM className={styles.explanation.text}>
              {explanation || 'Expert analysis of your vehicle valuation including market positioning, key value drivers, and personalized insights.'}
            </BodyM>
          </motion.div>
          
          {/* Premium Overlay for non-premium users */}
          {!isPremium && (
            <motion.div 
              className={styles.explanation.premium.blur}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <CDButton
                variant="primary"
                icon={<Lock className="h-4 w-4" />}
                onClick={onUpgrade}
                className={styles.explanation.premium.button}
              >
                Unlock Premium Analysis
              </CDButton>
            </motion.div>
          )}
        </div>
      </CDCardBody>
    </CDCard>
  );
};

export default Explanation;
