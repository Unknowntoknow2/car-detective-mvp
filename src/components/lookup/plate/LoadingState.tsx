
import { Loader2 } from 'lucide-react';

export const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 bg-background/40 backdrop-blur-sm rounded-lg border border-border/50">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Looking up vehicle information...</p>
    </div>
  );
};
