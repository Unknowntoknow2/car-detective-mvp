
import React from 'react';
import { motion } from 'framer-motion';
import { CDCard, CDCardBody } from '@/components/ui-kit/CDCard';
import { CDTooltip } from '@/components/ui-kit/CDTooltip';
import { BodyM, BodyS } from '@/components/ui-kit/typography';
import { Info, TrendingUp, TrendingDown, Check } from 'lucide-react';
import styles from '../styles';
import { formatCurrency } from '../logic';
import { cn } from '@/lib/utils';

interface SummaryProps {
  confidenceScore: number;
  priceRange: { low: number; high: number };
  marketTrend: 'up' | 'down' | 'stable';
  recommendationText: string;
}

export const Summary: React.FC<SummaryProps> = ({
  confidenceScore,
  priceRange,
  marketTrend,
  recommendationText
}) => {
  // Get confidence color
  const getConfidenceColor = () => {
    if (confidenceScore >= 85) return 'text-success-dark';
    if (confidenceScore >= 70) return 'text-primary';
    return 'text-warning-dark';
  };
  
  // Get confidence level text
  const getConfidenceLevel = () => {
    if (confidenceScore >= 85) return 'High';
    if (confidenceScore >= 70) return 'Medium';
    return 'Low';
  };
  
  // Get market trend icon
  const TrendIcon = marketTrend === 'up' 
    ? TrendingUp 
    : marketTrend === 'down' 
      ? TrendingDown 
      : Check;
      
  // Get market trend text
  const getTrendText = () => {
    if (marketTrend === 'up') return 'Trending Up';
    if (marketTrend === 'down') return 'Trending Down';
    return 'Stable';
  };
  
  // Get market trend color
  const getTrendColor = () => {
    if (marketTrend === 'up') return 'text-success-dark';
    if (marketTrend === 'down') return 'text-error-dark';
    return 'text-neutral-darker';
  };

  return (
    <CDCard className="mb-6">
      <CDCardBody>
        <div className={styles.summary.container}>
          {/* Confidence Score */}
          <motion.div 
            className={styles.summary.itemContainer}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center mb-1.5">
              <BodyS className="text-neutral-dark mr-1.5">Confidence Score</BodyS>
              <CDTooltip 
                content="Our system's confidence in the accuracy of this valuation based on available data"
              >
                <Info className="h-3.5 w-3.5 text-neutral-dark" />
              </CDTooltip>
            </div>
            
            <div className="flex items-center">
              <BodyM className={cn("font-semibold mr-2", getConfidenceColor())}>
                {confidenceScore}%
              </BodyM>
              <span className={cn("text-xs px-2 py-0.5 rounded-full", 
                confidenceScore >= 85 ? "bg-success-light text-success-dark" :
                confidenceScore >= 70 ? "bg-primary-light text-primary" :
                "bg-warning-light text-warning-dark"
              )}>
                {getConfidenceLevel()}
              </span>
            </div>
          </motion.div>
          
          {/* Price Range */}
          <motion.div 
            className={styles.summary.itemContainer}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <div className="flex items-center mb-1.5">
              <BodyS className="text-neutral-dark mr-1.5">Price Range</BodyS>
              <CDTooltip 
                content="The estimated range your vehicle could sell for in the current market"
              >
                <Info className="h-3.5 w-3.5 text-neutral-dark" />
              </CDTooltip>
            </div>
            
            <BodyM className="font-semibold">
              {formatCurrency(priceRange.low)} – {formatCurrency(priceRange.high)}
            </BodyM>
          </motion.div>
          
          {/* Market Trend */}
          <motion.div 
            className={styles.summary.itemContainer}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <div className="flex items-center mb-1.5">
              <BodyS className="text-neutral-dark mr-1.5">Market Trend</BodyS>
              <CDTooltip 
                content="Current market direction for vehicles matching this make, model, and year"
              >
                <Info className="h-3.5 w-3.5 text-neutral-dark" />
              </CDTooltip>
            </div>
            
            <div className="flex items-center">
              <TrendIcon className={cn("h-4 w-4 mr-1.5", getTrendColor())} />
              <BodyM className={cn("font-semibold", getTrendColor())}>
                {getTrendText()}
              </BodyM>
            </div>
          </motion.div>
          
          {/* Recommendation */}
          <motion.div 
            className={styles.summary.itemContainer}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <BodyS className="text-neutral-dark mb-1.5">Recommendation</BodyS>
            <BodyM className="font-semibold text-neutral-darkest">
              {recommendationText}
            </BodyM>
          </motion.div>
        </div>
      </CDCardBody>
    </CDCard>
  );
};

export default Summary;
