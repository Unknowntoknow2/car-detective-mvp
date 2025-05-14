
import React from 'react';
import { BodyM } from '@/components/ui-kit/typography';
import { Loader2 } from 'lucide-react';
import styles from '../styles';

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading valuation data...' 
}) => {
  return (
    <div className={styles.container}>
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <BodyM>{message}</BodyM>
      </div>
    </div>
  );
};

export default LoadingState;
