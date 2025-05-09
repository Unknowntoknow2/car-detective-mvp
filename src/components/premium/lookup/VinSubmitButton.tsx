
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';

interface VinSubmitButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
}

export function VinSubmitButton({ 
  onClick, 
  disabled, 
  isLoading 
}: VinSubmitButtonProps) {
  return (
    <Button 
      onClick={onClick}
      disabled={disabled || isLoading}
      className="px-6 w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Looking up VIN...
        </>
      ) : (
        <>
          <Search className="mr-2 h-4 w-4" />
          Look up Vehicle
        </>
      )}
    </Button>
  );
}
