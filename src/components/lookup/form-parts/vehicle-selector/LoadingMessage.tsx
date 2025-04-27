
import { Loader2 } from 'lucide-react';

export const LoadingMessage = () => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading vehicle data...</p>
    </div>
  </div>
);
