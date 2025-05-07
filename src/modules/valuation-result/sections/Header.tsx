
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { HeadingL, BodyS } from '@/components/ui-kit/typography';
import styles from '../styles';
import { formatCurrency } from '../logic';

interface HeaderProps {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  estimatedValue: number;
  isPremium?: boolean;
  additionalInfo?: Record<string, string>;
}

export const Header: React.FC<HeaderProps> = ({
  make,
  model,
  year,
  mileage,
  condition,
  estimatedValue,
  isPremium = false,
  additionalInfo = {}
}) => {
  return (
    <motion.div 
      className={styles.header.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.header.vehicleInfo}>
        <HeadingL as="h1" className={styles.header.vehicleName}>
          {year} {make} {model}
          {isPremium && (
            <span className={styles.premiumBadge}>
              Premium
            </span>
          )}
        </HeadingL>
        
        <div className={styles.header.vehicleDetails}>
          <Badge variant="outline" className="capitalize">
            {condition} Condition
          </Badge>
          
          <Badge variant="outline">
            {mileage.toLocaleString()} miles
          </Badge>
          
          {Object.entries(additionalInfo).map(([key, value]) => (
            <Badge key={key} variant="outline">
              {value}
            </Badge>
          ))}
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
      >
        <div className="text-right">
          <BodyS className="text-gray-500 mb-1">Estimated Value</BodyS>
          <HeadingL as="p" className={cn(styles.header.price, "text-primary")}>
            {formatCurrency(estimatedValue)}
          </HeadingL>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Header;
