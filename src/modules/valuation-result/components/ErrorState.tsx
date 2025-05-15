
import React from 'react';
import { CDCard } from '@/components/ui-kit/CDCard';
import { Heading, BodyM } from '@/components/ui-kit/typography';
import { AlertCircle } from 'lucide-react';
import styles from '../styles';

interface ErrorStateProps {
  error: Error | string | null;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  // Create a safe error message string
  const errorMessage = error 
    ? (typeof error === 'object' && error !== null && 'message' in error 
      ? String(error.message) 
      : String(error)) 
    : "Could not load valuation data. Please try again or contact support.";

  return (
    <div className={styles.container}>
      <CDCard className="p-6 bg-red-50">
        <div className="flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
          <div>
            <Heading 
              level={1} 
              className="text-xl font-bold text-red-700 mb-2"
            >
              Error Loading Valuation
            </Heading>
            <BodyM className="text-red-600">
              {errorMessage}
            </BodyM>
          </div>
        </div>
      </CDCard>
    </div>
  );
};

export default ErrorState;
