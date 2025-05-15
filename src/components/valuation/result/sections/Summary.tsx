
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { TrendingDown, TrendingUp, LineHorizontal, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import styles from '../styles';

interface SummaryProps {
  confidenceScore: number;
  priceRange: {
    low: number;
    high: number;
  };
  marketTrend: string;
  recommendationText: string;
}

const Summary: React.FC<SummaryProps> = ({
  confidenceScore,
  priceRange,
  marketTrend,
  recommendationText
}) => {
  // Determine trend icons and colors
  const getTrendIcon = () => {
    switch (marketTrend) {
      case 'rising':
      case 'up':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'falling':
      case 'down':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      default:
        return <LineHorizontal className="h-5 w-5 text-amber-500" />;
    }
  };
  
  const getTrendColor = () => {
    switch (marketTrend) {
      case 'rising':
      case 'up':
        return 'text-green-600';
      case 'falling':
      case 'down':
        return 'text-red-600';
      default:
        return 'text-amber-600';
    }
  };
  
  return (
    <div className={styles.summary.container}>
      <Card className={styles.summary.card}>
        <div className={styles.summary.title}>Confidence Score</div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className={styles.summary.value}>{confidenceScore}%</div>
            <Sparkles className="h-5 w-5 text-yellow-500" />
          </div>
          <Progress value={confidenceScore} className="h-2" />
        </div>
      </Card>
      
      <Card className={styles.summary.card}>
        <div className={styles.summary.title}>Price Range</div>
        <div className={styles.summary.value}>
          {formatCurrency(priceRange.low)} - {formatCurrency(priceRange.high)}
        </div>
      </Card>
      
      <Card className={styles.summary.card}>
        <div className={styles.summary.title}>Market Trend</div>
        <div className="flex items-center">
          <div className={`${styles.summary.value} ${getTrendColor()} mr-2`}>
            {marketTrend === 'up' || marketTrend === 'rising' 
              ? 'Rising'
              : marketTrend === 'down' || marketTrend === 'falling'
                ? 'Falling'
                : 'Stable'
            }
          </div>
          {getTrendIcon()}
        </div>
      </Card>
      
      <Card className={styles.summary.card}>
        <div className={styles.summary.title}>Recommendation</div>
        <div className={styles.summary.value}>
          {recommendationText}
        </div>
      </Card>
    </div>
  );
};

export default Summary;
