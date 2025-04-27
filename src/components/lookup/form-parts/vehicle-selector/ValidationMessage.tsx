
import { AlertCircle } from 'lucide-react';

interface ValidationMessageProps {
  error: string | null;
}

export const ValidationMessage = ({ error }: ValidationMessageProps) => {
  if (!error) return null;

  return (
    <div className="flex items-center gap-2 text-destructive text-sm">
      <AlertCircle className="h-4 w-4" />
      <span>{error}</span>
    </div>
  );
};
