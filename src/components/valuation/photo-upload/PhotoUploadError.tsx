
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface PhotoUploadErrorProps {
  error: string | null;
}

export function PhotoUploadError({ error }: PhotoUploadErrorProps) {
  if (!error) return null;
  
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error uploading photos</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}
