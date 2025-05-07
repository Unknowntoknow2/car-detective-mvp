
import React from 'react';
import { motion } from 'framer-motion';
import { CDCard, CDCardHeader, CDCardBody } from '@/components/ui-kit/CDCard';
import { HeadingL, BodyM, BodyS } from '@/components/ui-kit/typography';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import styles from '../styles';
import { formatCurrency } from '../logic';

interface Adjustment {
  factor: string;
  impact: number;
  description?: string;
}

interface BreakdownProps {
  basePrice: number;
  adjustments: Adjustment[];
  estimatedValue: number;
}

export const Breakdown: React.FC<BreakdownProps> = ({
  basePrice,
  adjustments,
  estimatedValue
}) => {
  // Sort adjustments by impact (largest first)
  const sortedAdjustments = [...adjustments].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
  
  return (
    <CDCard>
      <CDCardHeader>
        <HeadingL as="h3" className="text-xl font-medium">
          Valuation Breakdown
        </HeadingL>
      </CDCardHeader>
      
      <CDCardBody>
        <div className={styles.breakdown.container}>
          {/* Base price */}
          <motion.div 
            className={styles.breakdown.row}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <BodyM className="font-medium">Base Market Value</BodyM>
            <BodyM className="font-medium">{formatCurrency(basePrice)}</BodyM>
          </motion.div>
          
          {/* Adjustments */}
          {sortedAdjustments.map((adjustment, index) => {
            const isPositive = adjustment.impact > 0;
            const isNeutral = adjustment.impact === 0;
            
            let impactClass = styles.breakdown.neutral;
            if (isPositive) impactClass = styles.breakdown.positive;
            else if (!isNeutral) impactClass = styles.breakdown.negative;
            
            const Icon = isNeutral 
              ? Minus 
              : isPositive 
                ? ArrowUp 
                : ArrowDown;
                
            return (
              <motion.div 
                key={adjustment.factor}
                className={styles.breakdown.row}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + (index * 0.1), duration: 0.3 }}
              >
                <div className="flex items-center gap-1.5">
                  <Icon 
                    className={`h-4 w-4 ${impactClass}`} 
                  />
                  <BodyM className={styles.breakdown.factor}>
                    {adjustment.factor}
                  </BodyM>
                </div>
                
                <BodyM className={cn(styles.breakdown.impact, impactClass)}>
                  {isNeutral
                    ? '$0'
                    : `${isPositive ? '+' : ''}${formatCurrency(adjustment.impact)}`
                  }
                </BodyM>
              </motion.div>
            );
          })}
          
          {/* Total */}
          <motion.div 
            className="flex justify-between items-center pt-4 mt-4 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <BodyM className="font-bold">Final Valuation</BodyM>
            <BodyM className="font-bold text-primary text-xl">
              {formatCurrency(estimatedValue)}
            </BodyM>
          </motion.div>
        </div>
      </CDCardBody>
    </CDCard>
  );
};

export default Breakdown;
