import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface ValueShowcaseProps {
  estimatedValue: number;
  priceRange?: {
    min: number;
    max: number;
  };
  marketComparison?: {
    averagePrice?: number;
    percentDifference?: number;
  };
  confidenceScore: number;
  className?: string;
}

export function ValueShowcase({
  estimatedValue,
  priceRange,
  marketComparison,
  confidenceScore,
  className = ''
}: ValueShowcaseProps) {
  // Add defensive checks
  if (!estimatedValue || typeof estimatedValue !== 'number') {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">Loading value data...</p>
      </Card>
    );
  }
  const [displayValue, setDisplayValue] = useState(0);
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, latest => Math.round(latest));

  // Animate the value counter
  useEffect(() => {
    const controls = animate(motionValue, estimatedValue, {
      duration: 2,
      ease: "easeOut"
    });

    const unsubscribe = rounded.onChange(latest => {
      setDisplayValue(latest);
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [estimatedValue, motionValue, rounded]);

  const getComparisonDisplay = () => {
    if (!marketComparison?.percentDifference) return null;
    
    const isAbove = marketComparison.percentDifference > 0;
    const percentage = Math.abs(marketComparison.percentDifference);
    
    return {
      isAbove,
      percentage,
      icon: isAbove ? TrendingUp : TrendingDown,
      color: isAbove ? 'text-green-600' : 'text-red-600',
      bgColor: isAbove ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200',
      text: `${percentage.toFixed(1)}% ${isAbove ? 'above' : 'below'} market average`
    };
  };

  const comparison = getComparisonDisplay();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      <Card className="bg-gradient-to-br from-primary/5 via-background to-primary/10 border-2 border-primary/20 shadow-lg overflow-hidden">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-muted-foreground">
                  Estimated Market Value
                </h2>
              </div>
              <Badge 
                variant={confidenceScore >= 70 ? "default" : "secondary"}
                className="text-xs"
              >
                {confidenceScore}% Confidence
              </Badge>
            </motion.div>

            {/* Main Value */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-center">
                <DollarSign className="w-8 h-8 md:w-12 md:h-12 text-primary/80" />
                <span className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent">
                  {displayValue.toLocaleString()}
                </span>
              </div>
              
              {/* Price Range */}
              {priceRange && (
                <motion.p 
                  className="text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  Range: ${priceRange.min.toLocaleString()} - ${priceRange.max.toLocaleString()}
                </motion.p>
              )}
            </motion.div>

            {/* Market Comparison */}
            {comparison && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${comparison.bgColor}`}
              >
                <comparison.icon className={`w-4 h-4 ${comparison.color}`} />
                <span className={`text-sm font-medium ${comparison.color}`}>
                  {comparison.text}
                </span>
              </motion.div>
            )}

            {/* Market Average Reference */}
            {marketComparison?.averagePrice && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="text-xs text-muted-foreground"
              >
                Market average: ${marketComparison.averagePrice.toLocaleString()}
              </motion.div>
            )}

            {/* Confidence Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
              className="flex justify-center"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className={`w-2 h-2 rounded-full ${
                  confidenceScore >= 80 ? 'bg-green-500' :
                  confidenceScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span>
                  {confidenceScore >= 80 && 'High accuracy estimate'}
                  {confidenceScore >= 60 && confidenceScore < 80 && 'Good accuracy estimate'}
                  {confidenceScore < 60 && 'Limited data estimate'}
                </span>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}