
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LoadingButton } from '@/components/ui/loading-button';

interface ValuationFormActionsProps {
  onNewSearch: () => void;
  onStartOver: () => void;
  isNewSearch: boolean;
  isResetting: boolean;
}

export const ValuationFormActions: React.FC<ValuationFormActionsProps> = ({
  onNewSearch,
  onStartOver,
  isNewSearch,
  isResetting
}) => {
  const navigate = useNavigate();

  const handleNewSearch = () => {
    toast.success('Starting a new search!');
    onNewSearch();
    navigate('/valuation');
  };

  const handleStartOver = () => {
    toast.success('Resetting the form!');
    onStartOver();
  };

  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
      <LoadingButton
        onClick={handleNewSearch}
        variant="default"
        isLoading={isNewSearch}
        loadingText="Searching..."
        className="w-full"
      >
        New Search
      </LoadingButton>
      <LoadingButton
        onClick={handleStartOver}
        variant="outline"
        isLoading={isResetting}
        loadingText="Resetting..."
        className="w-full"
      >
        Start Over
      </LoadingButton>
    </div>
  );
};
