
import React from 'react';
import { motion } from 'framer-motion';
import { CDTooltip } from '@/components/ui-kit/CDTooltip';
import { CDBadge } from '@/components/ui-kit/CDBadge';
import { BodyM, BodyS } from '@/components/ui-kit/typography';
import { InfoIcon, ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';
import styles from '../styles';
import { 
  formatCurrency, 
  PriceRange, 
  MarketTrend, 
  getConfidenceLevel, 
  getConfidenceColor 
} from '../logic';

interface SummaryProps {
  confidenceScore: number;
  priceRange: PriceRange;
  marketTrend: MarketTrend;
  recommendationText: string;
}

export const Summary: React.FC<SummaryProps> = ({
  confidenceScore,
  priceRange,
  marketTrend,
  recommendationText
}) => {
  const confidenceLevel = getConfidenceLevel(confidenceScore);
  const confidenceColorClass = getConfidenceColor(confidenceScore);
  
  const getTrendIcon = () => {
    switch(marketTrend) {
      case 'rising':
        return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'falling':
        return <ArrowDown className="h-4 w-4 text-red-500" />;
      default:
        return <ArrowRight className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getTrendLabel = () => {
    switch(marketTrend) {
      case 'rising':
        return 'Rising Market';
      case 'falling':
        return 'Falling Market';
      default:
        return 'Stable Market';
    }
  };
  
  const getTrendColor = () => {
    switch(marketTrend) {
      case 'rising':
        return 'success';
      case 'falling':
        return 'error';
      default:
        return 'neutral';
    }
  };
  
  return (
    <motion.div 
      className={styles.score.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <div className="flex items-center gap-8">
        {/* Confidence Score */}
        <div className={styles.score.scoreItem}>
          <motion.div 
            className={cn(styles.score.confidenceCircle, confidenceColorClass)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5, type: 'spring' }}
          >
            {confidenceScore}%
          </motion.div>
          <BodyS className="flex items-center gap-1.5">
            Confidence: {confidenceLevel}
            <CDTooltip 
              content={
                <div className="max-w-xs">
                  <p>Our confidence score reflects the precision of our valuation based on available data.</p>
                  <p className="mt-1.5">Higher confidence indicates more reliable pricing data and detailed vehicle information.</p>
                </div>
              }
            >
              <InfoIcon className="h-4 w-4 text-gray-400 cursor-help" />
            </CDTooltip>
          </BodyS>
        </div>
        
        {/* Price Range */}
        <div className="flex flex-col">
          <BodyS className="text-gray-500 mb-1">Price Range</BodyS>
          <BodyM className="font-semibold">
            {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
          </BodyM>
          <div className="mt-2 flex items-center gap-2">
            <CDBadge
              variant={getTrendColor() as any}
              size="sm"
              icon={getTrendIcon()}
            >
              {getTrendLabel()}
            </CDBadge>
          </div>
        </div>
      </div>
      
      {/* Recommendation */}
      <motion.div 
        className="bg-gray-50 p-3 rounded-lg mt-4 sm:mt-0 w-full sm:w-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <BodyS className="text-gray-500 mb-1">Recommendation</BodyS>
        <BodyM>{recommendationText}</BodyM>
      </motion.div>
    </motion.div>
  );
};

export default Summary;
