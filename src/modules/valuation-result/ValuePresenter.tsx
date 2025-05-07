
import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '@/components/animations/AnimatedCounter';
import { getConfidenceColor, getConfidenceLabel } from '@/components/animations/utils';
import { ProgressRing } from '@/components/animations/ProgressRing';
import { CDCard } from '@/components/ui-kit/CDCard';
import { formatCurrency } from '@/utils/formatters';

interface ValuePresenterProps {
  value: number;
  confidenceScore: number;
  isAnimated?: boolean;
  isPremium?: boolean;
  className?: string;
}

export const ValuePresenter: React.FC<ValuePresenterProps> = ({
  value,
  confidenceScore,
  isAnimated = true,
  isPremium = false,
  className = ''
}) => {
  // Get color and label based on confidence score
  const confidenceColor = getConfidenceColor(confidenceScore);
  const confidenceLabel = getConfidenceLabel(confidenceScore);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <motion.div
      className={`${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <CDCard className={`p-6 ${isPremium ? 'bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20' : ''}`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Value Display */}
          <motion.div variants={itemVariants} className="text-center md:text-left">
            <p className="text-sm text-gray-500 mb-1">Estimated Value</p>
            <h2 className="text-4xl font-bold text-primary">
              <AnimatedCounter 
                value={value} 
                prefix="$"
                formatter={(val) => val.toLocaleString()} 
                animate={isAnimated}
                duration={2000}
              />
            </h2>
          </motion.div>
          
          {/* Confidence Ring */}
          <motion.div variants={itemVariants} className="text-center">
            <ProgressRing
              value={confidenceScore}
              size={90}
              strokeWidth={6}
              color={confidenceColor}
              backgroundColor="#f1f5f9"
              duration={1.5}
            >
              <div className="flex flex-col justify-center items-center">
                <span className="text-xl font-bold" style={{ color: confidenceColor }}>
                  {confidenceScore}%
                </span>
                <span className="text-xs">{confidenceLabel}</span>
              </div>
            </ProgressRing>
            <p className="text-xs text-gray-500 mt-2">Confidence Score</p>
          </motion.div>
        </div>

        {/* Premium Badge */}
        {isPremium && (
          <motion.div 
            className="absolute top-4 right-4"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.3 }}
          >
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-medium rounded-full">
              Premium
            </span>
          </motion.div>
        )}
      </CDCard>
    </motion.div>
  );
};

export default ValuePresenter;
