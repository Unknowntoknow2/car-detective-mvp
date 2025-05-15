
import React from 'react';
import { formatCurrency } from '@/utils/formatters';
import { Check, Shield } from 'lucide-react';
import styles from '../styles';

interface HeaderProps {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  estimatedValue: number;
  isPremium: boolean;
  additionalInfo?: Record<string, string>;
}

export const Header: React.FC<HeaderProps> = ({
  make,
  model,
  year,
  mileage,
  condition,
  estimatedValue,
  isPremium,
  additionalInfo = {}
}) => {
  const formattedMileage = mileage ? `${mileage.toLocaleString()} miles` : 'N/A';
  
  return (
    <div className={styles.header.container}>
      <div className={styles.header.info}>
        <h1 className={styles.header.title}>
          {year} {make} {model}
          {isPremium && (
            <span className={`${styles.premiumBadge} text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1`}>
              <Shield className="h-3 w-3" />
              Premium
            </span>
          )}
        </h1>
        <p className={styles.header.subtitle}>
          {formattedMileage} • {condition} Condition
        </p>
        
        {/* Additional info badges */}
        {Object.keys(additionalInfo).length > 0 && (
          <div className={styles.header.badge.container}>
            {Object.entries(additionalInfo).map(([key, value]) => (
              <span key={key} className={styles.header.badge.item}>
                {key === 'fuelType' ? 'Fuel' : key}: {value}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="text-right">
        <div className="text-sm text-muted-foreground mb-1">Estimated Value</div>
        <div className={styles.header.price}>
          {formatCurrency(estimatedValue)}
        </div>
        <div className="text-xs text-muted-foreground mt-1 flex items-center justify-end gap-1">
          <Check className="h-3 w-3 text-green-500" />
          Updated {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default Header;
