
import { X } from 'lucide-react';

interface PhotoUploadErrorProps {
  error: string | null;
}

export function PhotoUploadError({ error }: PhotoUploadErrorProps) {
  if (!error) return null;
  
  return (
    <div className="text-sm text-red-500 flex items-center gap-1">
      <X className="h-4 w-4" />
      {error}
    </div>
  );
}
