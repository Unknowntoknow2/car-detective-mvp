
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ErrorStateProps {
  message?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  message = "We couldn't retrieve the valuation at this time."
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertTriangle className="h-12 w-12 text-destructive" />
      <h2 className="mt-4 text-xl font-semibold">Valuation Error</h2>
      <p className="mt-2 text-muted-foreground max-w-md mx-auto">{message}</p>
      <div className="mt-6 space-x-4">
        <Button onClick={() => navigate('/valuation')}>
          Try Again
        </Button>
        <Button variant="outline" onClick={() => navigate('/')}>
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default ErrorState;
