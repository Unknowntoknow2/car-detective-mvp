
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronUp, 
  ChevronDown, 
  Minus 
} from 'lucide-react';
import { Heading, BodyM, BodyS } from '@/components/ui-kit/typography';
import { formatCurrency } from '@/utils/formatters';
import { Progress } from '@/components/ui/progress';

interface PriceAdjustment {
  factor: string;
  impact: number;
  description?: string;
}

interface BreakdownProps {
  basePrice: number;
  adjustments: PriceAdjustment[];
  estimatedValue: number;
}

export const Breakdown: React.FC<BreakdownProps> = ({
  basePrice,
  adjustments = [],
  estimatedValue
}) => {
  // Filter out zero impact adjustments
  const significantAdjustments = adjustments.filter(adj => adj.impact !== 0);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Heading className="text-xl font-semibold mb-4">
        Price Breakdown
      </Heading>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Base Price */}
        <motion.div variants={itemVariants} className="flex justify-between items-center">
          <BodyM className="font-medium">Base Market Value</BodyM>
          <span className="text-xl font-semibold">
            {formatCurrency(basePrice)}
          </span>
        </motion.div>
        
        {/* Adjustments */}
        {significantAdjustments.length > 0 && (
          <div className="space-y-3 py-3 border-y border-dashed border-gray-200">
            {significantAdjustments.map((adjustment, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="flex justify-between items-center"
              >
                <div className="flex items-center gap-2">
                  {adjustment.impact > 0 ? (
                    <ChevronUp className="h-4 w-4 text-green-500" />
                  ) : adjustment.impact < 0 ? (
                    <ChevronDown className="h-4 w-4 text-red-500" />
                  ) : (
                    <Minus className="h-4 w-4 text-gray-400" />
                  )}
                  <BodyS>{adjustment.factor}</BodyS>
                </div>
                <span className={`font-medium ${
                  adjustment.impact > 0 
                    ? 'text-green-600' 
                    : adjustment.impact < 0 
                      ? 'text-red-600' 
                      : 'text-gray-600'
                }`}>
                  {adjustment.impact > 0 ? '+' : ''}
                  {formatCurrency(adjustment.impact)}
                </span>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Final Value */}
        <motion.div 
          variants={itemVariants}
          className="flex justify-between items-center pt-2"
        >
          <BodyM className="font-bold">Final Valuation</BodyM>
          <span className="text-2xl font-bold text-primary">
            {formatCurrency(estimatedValue)}
          </span>
        </motion.div>
        
        {/* Confidence Bar */}
        <motion.div variants={itemVariants} className="mt-6">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Confidence Level</span>
            <span className="font-medium">85%</span>
          </div>
          <Progress value={85} className="h-2" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Breakdown;
