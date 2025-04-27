
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  error: string;
}

export const ErrorMessage = ({ error }: ErrorMessageProps) => (
  <div className="p-4 border border-destructive/30 bg-destructive/10 rounded-md">
    <div className="flex items-start gap-2">
      <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-destructive">Failed to load vehicle data</p>
        <p className="text-xs text-destructive/80 mt-1">{error}</p>
      </div>
    </div>
  </div>
);
