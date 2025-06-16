
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ManualEntryFormFreeProps {
  onSubmit?: () => void;
}

export const ManualEntryFormFree: React.FC<ManualEntryFormFreeProps> = ({ onSubmit }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onSubmit) {
      onSubmit();
    } else {
      navigate('/manual-valuation');
    }
  };

  return (
    <div className="text-center space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Manual Vehicle Entry</h3>
        <p className="text-sm text-muted-foreground">
          Enter your vehicle details manually for a personalized valuation
        </p>
      </div>
      <Button onClick={handleClick} size="lg" className="w-full max-w-sm">
        Enter Vehicle Details
      </Button>
    </div>
  );
};

export default ManualEntryFormFree;
