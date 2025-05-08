
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';

interface VinSubmitButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
  text?: string;
  loadingText?: string;
}

export function VinSubmitButton({
  onClick,
  disabled,
  isLoading,
  text = 'Look up Vehicle',
  loadingText = 'Looking up VIN...'
}: VinSubmitButtonProps) {
  return (
    <Button 
      onClick={onClick}
      disabled={disabled || isLoading}
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        <>
          <Search className="mr-2 h-4 w-4" />
          {text}
        </>
      )}
    </Button>
  );
}
